import {
  access,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import { fingerprintCanonicalJson, hashFile } from "./hashing.mjs";
import { buildOutputPaths } from "./naming.mjs";
import { ensureContainedDirectory } from "./paths.mjs";
import { inspectPngBuffer, inspectSvgMarkup } from "./qa.mjs";
import { evaluateTechnicalQa } from "./qa-policy.mjs";

const REMOVE_TREE_OPTIONS = {
  recursive: true,
  force: true,
  maxRetries: 8,
  retryDelay: 250,
};

const exists = (filePath) =>
  access(filePath).then(
    () => true,
    () => false,
  );

export function renderInputHash({ source, metadata, presetHash, rendererVersion, packageLockSha256 }) {
  return fingerprintCanonicalJson({
    source,
    metadata,
    presetHash,
    rendererVersion,
    packageLockSha256,
  });
}

async function validateCachedArtifacts(outputs, inputHash) {
  const required = [outputs.source, outputs.svg, outputs.png, outputs.preview, outputs.qa];
  if (!(await Promise.all(required.map(exists))).every(Boolean)) return null;
  try {
    const qa = JSON.parse(await readFile(outputs.qa, "utf8"));
    if (qa.inputHash !== inputHash || qa.errors?.length) return null;
    const hashes = {
      source: await hashFile(outputs.source),
      svg: await hashFile(outputs.svg),
      png: await hashFile(outputs.png),
      preview: await hashFile(outputs.preview),
    };
    if (
      !qa.artifactHashes ||
      Object.entries(hashes).some(([key, value]) => qa.artifactHashes[key] !== value)
    ) return null;

    const svgQa = inspectSvgMarkup(await readFile(outputs.svg, "utf8"));
    const pngQa = inspectPngBuffer(await readFile(outputs.png), qa.png);
    const policy = evaluateTechnicalQa({
      errors: [...(qa.errors ?? []), ...svgQa.errors, ...pngQa.errors],
      warnings: [...(qa.warnings ?? []), ...svgQa.warnings, ...pngQa.warnings],
    });
    if (!policy.passed) return null;
    return { qa, hashes, policy };
  } catch {
    return null;
  }
}

export async function renderOne(options) {
  const {
    sourcePath,
    sourceDocument,
    source,
    metadata,
    presetHash,
    outputRoot,
    adapters,
    rendererVersion,
    packageLockSha256,
    timeoutMs = 100_000,
    force = false,
  } = options;
  const inputHash = renderInputHash({
    source,
    metadata,
    presetHash,
    rendererVersion,
    packageLockSha256,
  });
  const outputs = buildOutputPaths(outputRoot, metadata, inputHash.slice(0, 12));
  const result = {
    id: metadata.id,
    syntax: metadata.syntax,
    sourcePath,
    renderStatus: "failed",
    errors: [],
    warnings: [],
    outputs,
    hash: inputHash,
    cacheHit: false,
    qa: null,
  };

  await ensureContainedDirectory(outputRoot, outputs.directory);
  if (!force) {
    const cached = await validateCachedArtifacts(outputs, inputHash);
    if (cached) {
      result.renderStatus = cached.policy.renderStatus;
      result.cacheHit = true;
      result.qa = cached.qa;
      result.warnings.push(...(cached.qa.warnings ?? []));
      return result;
    }
  }

  await rm(outputs.work, REMOVE_TREE_OPTIONS);
  await ensureContainedDirectory(outputRoot, outputs.work);
  const temporary = {
    source: path.join(outputs.work, path.basename(outputs.source)),
    svg: path.join(outputs.work, path.basename(outputs.svg)),
    png: path.join(outputs.work, path.basename(outputs.png)),
    preview: path.join(outputs.work, path.basename(outputs.preview)),
    qa: path.join(outputs.work, path.basename(outputs.qa)),
  };

  try {
    await writeFile(temporary.source, sourceDocument);
    await adapters.renderSvg({
      source,
      metadata,
      outputPath: temporary.svg,
      timeoutMs,
    });
    if (!(await exists(temporary.svg))) throw new Error("Missing SVG after renderer completed.");
    const browserQa = await adapters.renderPng({
      svgPath: temporary.svg,
      metadata,
      outputPath: temporary.png,
      previewPath: temporary.preview,
      qaPath: temporary.qa,
      timeoutMs,
    });
    if (!(await exists(temporary.png))) throw new Error("Missing PNG after renderer completed.");

    const svgQa = inspectSvgMarkup(await readFile(temporary.svg, "utf8"));
    const pngQa = inspectPngBuffer(await readFile(temporary.png), browserQa.png);
    const qa = {
      ...browserQa,
      inputHash,
      errors: [...(browserQa.errors ?? []), ...svgQa.errors, ...pngQa.errors],
      warnings: [...(browserQa.warnings ?? []), ...svgQa.warnings, ...pngQa.warnings],
      artifactHashes: {
        source: await hashFile(temporary.source),
        svg: await hashFile(temporary.svg),
        png: await hashFile(temporary.png),
        preview: await hashFile(temporary.preview),
      },
    };
    await writeFile(temporary.qa, `${JSON.stringify(qa, null, 2)}\n`);
    const policy = evaluateTechnicalQa(qa);
    result.qa = qa;
    result.warnings.push(...qa.warnings);
    if (!policy.passed) {
      result.errors.push(...qa.errors);
      return result;
    }

    for (const key of ["source", "svg", "png", "preview", "qa"]) {
      await rename(temporary[key], outputs[key]);
    }
    result.renderStatus = policy.renderStatus;
    return result;
  } catch (cause) {
    result.errors.push(cause instanceof Error ? cause.message.split("\n")[0] : String(cause));
    return result;
  } finally {
    await rm(outputs.work, REMOVE_TREE_OPTIONS);
  }
}
