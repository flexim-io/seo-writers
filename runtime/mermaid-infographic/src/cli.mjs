#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createRealAdapters } from "./adapters.mjs";
import { validateProductionContext } from "./brief.mjs";
import { chromeVersion, resolveChromeExecutable } from "./environment.mjs";
import { artifactRecord, blockedHandoff } from "./handoff.mjs";
import { hashFile, sha256 } from "./hashing.mjs";
import { validateMermaidSyntax } from "./mermaid-validation.mjs";
import { parseMermaidDocument } from "./metadata.mjs";
import { buildOutputPaths } from "./naming.mjs";
import { resolveContainedPath } from "./paths.mjs";
import { fingerprintPreset } from "./preset.mjs";
import { renderInputHash, renderOne } from "./renderer.mjs";
import { validateSourceSecurity } from "./security.mjs";
import { readSourceInput } from "./source-input.mjs";
import { analyzeTextDensity } from "./text-density.mjs";

const RUNTIME_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseArgs(argv) {
  const [command = "help", ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];
    if (!argument.startsWith("--")) continue;
    const key = argument.slice(2);
    if (key === "force") options.force = true;
    else {
      const value = rest[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`BRIEF_INCOMPLETE: Missing value for --${key}.`);
      options[key] = value;
      index += 1;
    }
  }
  return { command, options };
}

function required(options, key) {
  if (!options[key]) {
    const error = new Error(`BRIEF_INCOMPLETE: --${key} is required.`);
    error.code = "BRIEF_INCOMPLETE";
    throw error;
  }
  return options[key];
}

function writeResult(value, exitCode = 0) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
  process.exitCode = exitCode;
}

async function prepare(options) {
  const workspaceRoot = await resolveContainedPath(
    required(options, "workspace-root"),
    required(options, "workspace-root"),
  );
  const sourceInput = await readSourceInput({
    workspaceRoot,
    sourceOption: required(options, "source"),
  });
  const contextPath = await resolveContainedPath(
    workspaceRoot,
    required(options, "context"),
  );
  const outputRoot = await resolveContainedPath(
    workspaceRoot,
    required(options, "output-root"),
    { writable: true },
  );
  const allowlist = JSON.parse(
    await readFile(path.join(RUNTIME_ROOT, "config", "production-syntaxes.json"), "utf8"),
  );
  const { sourcePath, sourceDocument } = sourceInput;
  const parsed = parseMermaidDocument(sourceDocument, allowlist);
  const security = validateSourceSecurity(
    `${JSON.stringify(parsed.metadata)}\n${parsed.mermaidSource}`,
  );
  if (!security.ok) {
    const error = new Error(`SOURCE_UNSAFE: ${security.errors[0]}`);
    error.code = "SOURCE_UNSAFE";
    throw error;
  }
  await validateMermaidSyntax(parsed.mermaidSource);
  const density = analyzeTextDensity(parsed.mermaidSource, {
    canvas: parsed.metadata.canvas,
  });
  if (!density.ok) {
    const error = new Error(`TECHNICAL_QA_FAILED: ${density.errors[0]} Recommended canvas: ${density.recommendedCanvas}.`);
    error.code = "TECHNICAL_QA_FAILED";
    throw error;
  }
  const context = JSON.parse(await readFile(contextPath, "utf8"));
  const brief = validateProductionContext(context, parsed.metadata);
  const packageJson = JSON.parse(await readFile(path.join(RUNTIME_ROOT, "package.json"), "utf8"));
  const packageLockSha256 = await hashFile(path.join(RUNTIME_ROOT, "package-lock.json"));
  const presetHash = await fingerprintPreset(parsed.metadata.preset);
  const chromePath = await resolveChromeExecutable();
  const detectedChromeVersion = await chromeVersion(chromePath);
  return {
    workspaceRoot,
    sourcePath,
    outputRoot,
    sourceDocument,
    ...parsed,
    density,
    brief,
    rendererVersion: packageJson.version,
    packageLockSha256,
    presetHash,
    chromePath,
    chromeVersion: detectedChromeVersion,
  };
}

function preflightHandoff(prepared, mode = "preflight") {
  return {
    mermaidInfographicHandoff: {
      schemaVersion: 1,
      mode,
      status: "ready",
      visualId: prepared.metadata.id,
      required: prepared.brief.mediaMap.required,
      input: {
        sourcePath: prepared.sourcePath
          ? path.relative(prepared.workspaceRoot, prepared.sourcePath).split(path.sep).join("/")
          : null,
        sourceSha256: sha256(prepared.sourceDocument),
        briefFingerprint: prepared.brief.briefFingerprint,
        componentHashes: prepared.brief.componentHashes,
        syntax: prepared.metadata.syntax,
        preset: prepared.metadata.preset,
        canvas: prepared.metadata.canvas,
      },
      renderer: {
        version: prepared.rendererVersion,
        packageLockSha256: prepared.packageLockSha256,
        nodeVersion: process.version,
        chromeVersion: prepared.chromeVersion,
      },
      renderStatus: "not-run",
      artifacts: { source: null, svg: null, png: null, preview: null, qa: null },
      editorial: {
        readerQuestion: prepared.brief.mediaMap.readerQuestion,
        role: prepared.brief.mediaMap.role,
        sourceOfTruth: prepared.brief.mediaMap.sourceOfTruth,
        claimIds: prepared.brief.components.claimPermissions.map((claim) => claim.id),
        caption: prepared.metadata.caption,
        alt: prepared.metadata.alt,
        authenticity: prepared.brief.mediaMap.authenticity,
      },
      checks: {
        securityValidated: "passed",
        syntaxValidated: "passed",
        technicalQaPassed: "not-run",
        privacySafe: "passed",
        evidenceBoundariesPreserved: "passed",
      },
      humanReviewRequired: true,
      warnings: prepared.density.warnings,
      blockers: [],
      nextStage: "media_production",
    },
  };
}

async function renderHandoff(prepared, mode, force) {
  const hash = renderInputHash({
    source: prepared.mermaidSource,
    metadata: prepared.metadata,
    presetHash: prepared.presetHash,
    rendererVersion: prepared.rendererVersion,
    packageLockSha256: prepared.packageLockSha256,
  });
  const expectedOutputs = buildOutputPaths(
    prepared.outputRoot,
    prepared.metadata,
    hash.slice(0, 12),
  );
  const adapters = createRealAdapters({
    runtimeRoot: RUNTIME_ROOT,
    workRoot: expectedOutputs.work,
    chromePath: prepared.chromePath,
  });
  const result = await renderOne({
    sourcePath: prepared.sourcePath,
    sourceDocument: prepared.sourceDocument,
    source: prepared.mermaidSource,
    metadata: prepared.metadata,
    presetHash: prepared.presetHash,
    outputRoot: prepared.outputRoot,
    adapters,
    rendererVersion: prepared.rendererVersion,
    packageLockSha256: prepared.packageLockSha256,
    force,
  });
  if (result.renderStatus === "failed") {
    const context = preflightHandoff(prepared, mode).mermaidInfographicHandoff;
    context.checks.technicalQaPassed = "failed";
    return blockedHandoff(
      "TECHNICAL_QA_FAILED",
      prepared.metadata.id,
      result.errors[0] ?? "Rendering or technical QA failed.",
      "Revise the source or canvas, then rerun preflight and render.",
      {
        mode,
        visualId: context.visualId,
        required: context.required,
        input: context.input,
        renderer: context.renderer,
        renderStatus: "failed",
        editorial: context.editorial,
        checks: context.checks,
      },
    );
  }
  const artifacts = {
    source: await artifactRecord(prepared.workspaceRoot, result.outputs.source),
    svg: await artifactRecord(prepared.workspaceRoot, result.outputs.svg),
    png: await artifactRecord(prepared.workspaceRoot, result.outputs.png, {
      width: result.qa.png.width,
      height: result.qa.png.height,
    }),
    preview: await artifactRecord(prepared.workspaceRoot, result.outputs.preview),
    qa: await artifactRecord(prepared.workspaceRoot, result.outputs.qa),
  };
  const handoff = preflightHandoff(prepared, mode).mermaidInfographicHandoff;
  handoff.input.sourceSha256 = artifacts.source.sha256;
  handoff.renderStatus = result.renderStatus;
  handoff.artifacts = artifacts;
  handoff.checks.technicalQaPassed = "passed";
  handoff.warnings = [...handoff.warnings, ...result.warnings];
  handoff.nextStage = "media_integration";
  return { mermaidInfographicHandoff: handoff };
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (command === "help") {
    writeResult({ status: "ready", commands: ["preflight", "render"] });
    return;
  }
  if (!["preflight", "render"].includes(command)) {
    throw Object.assign(new Error(`BRIEF_INCOMPLETE: Unknown cached command: ${command}.`), {
      code: "BRIEF_INCOMPLETE",
    });
  }
  const prepared = await prepare(options);
  if (command === "preflight") {
    writeResult(preflightHandoff(prepared));
    return;
  }
  writeResult(await renderHandoff(prepared, options.mode === "automatic" ? "automatic" : "render", options.force === true));
}

main().catch((error) => {
  const code = error.code ?? error.message?.match(/^([A-Z_]+):/)?.[1] ?? "TECHNICAL_QA_FAILED";
  writeResult(
    blockedHandoff(
      code,
      "runtime",
      error.message.split("\n")[0],
      code === "BRIEF_INCOMPLETE" ? "Complete the approved media brief and rerun preflight." : "Correct the anchored issue and rerun preflight.",
    ),
    1,
  );
});
