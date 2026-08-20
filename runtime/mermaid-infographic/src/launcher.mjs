#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { inspectRuntimeCache, setupCommand } from "./cache.mjs";
import {
  chromeVersion,
  nodeIsCompatible,
  resolveChromeExecutable,
} from "./environment.mjs";
import { hashDirectory } from "./hashing.mjs";
import { blockedHandoff } from "./handoff.mjs";
import { setupRuntime } from "./setup.mjs";

const INSTALLED_RUNTIME_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LAUNCHER_PATH = fileURLToPath(import.meta.url);

function blocker(code, anchor, message, nextAction, mode = null) {
  return blockedHandoff(code, anchor, message, nextAction, { mode });
}

function writeResult(result, exitCode = 0) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exitCode = exitCode;
}

function runCachedCli(cliPath, args, env, timeoutMs = 120_000) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cliPath, ...args], {
      env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      reject(new Error(`Cached renderer timed out after ${timeoutMs}ms.`));
    }, timeoutMs);
    if (args.some((argument, index) => argument === "-" && args[index - 1] === "--source")) {
      process.stdin.pipe(child.stdin);
    } else {
      child.stdin.end();
    }
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
  });
}

async function main() {
  const [rawCommand = "preflight", ...rawArgs] = process.argv.slice(2);
  if (!["preflight", "render", "automatic", "setup"].includes(rawCommand)) {
    writeResult(blocker("BRIEF_INCOMPLETE", "command", `Unknown command: ${rawCommand}.`, "Use preflight, render, automatic, or setup.", rawCommand), 1);
    return;
  }
  if (!nodeIsCompatible()) {
    writeResult(blocker("NODE_INCOMPATIBLE", "Node.js", `Node.js ${process.versions.node} is below 22.`, "Use Node.js 22 or newer.", rawCommand), 1);
    return;
  }

  let chromePath;
  let detectedChromeVersion;
  try {
    chromePath = await resolveChromeExecutable();
    detectedChromeVersion = await chromeVersion(chromePath);
  } catch (error) {
    writeResult(blocker("BROWSER_UNAVAILABLE", "Chrome", error.message, "Set MERMAID_CHROME_PATH to a compatible local Chrome or Chromium executable.", rawCommand), 1);
    return;
  }

  if (rawCommand === "setup") {
    try {
      const cache = await setupRuntime({
        installedRuntimeRoot: INSTALLED_RUNTIME_ROOT,
        chromePath,
        chromeVersion: detectedChromeVersion,
      });
      writeResult({
        schemaVersion: 1,
        status: "ready",
        setupStatus: "complete",
        renderer: {
          version: cache.identity.rendererVersion,
          packageLockSha256: cache.identity.packageLockSha256,
          nodeVersion: process.version,
          chromeVersion: detectedChromeVersion,
        },
        cacheKey: cache.locations.key,
        warnings: [],
        blockers: [],
        nextStage: "media_production",
      });
    } catch (error) {
      writeResult(blocker(error.code ?? "SETUP_REQUIRED", "dependency cache", error.message, setupCommand(LAUNCHER_PATH), rawCommand), 1);
    }
    return;
  }

  const cache = await inspectRuntimeCache(INSTALLED_RUNTIME_ROOT);
  if (!cache.ready) {
    writeResult(
      blocker(
        "SETUP_REQUIRED",
        "dependency cache",
        cache.reason,
        setupCommand(LAUNCHER_PATH),
        rawCommand,
      ),
      1,
    );
    return;
  }

  const installedBefore = await hashDirectory(INSTALLED_RUNTIME_ROOT);
  const command = rawCommand === "automatic" ? "render" : rawCommand;
  const modeArgs = rawCommand === "automatic" ? ["--mode", "automatic"] : [];
  const execution = await runCachedCli(
    path.join(cache.locations.runtimeRoot, "src", "cli.mjs"),
    [command, ...modeArgs, ...rawArgs],
    {
      ...process.env,
      MERMAID_CHROME_PATH: chromePath,
      SEO_WRITERS_INSTALLED_RUNTIME: INSTALLED_RUNTIME_ROOT,
    },
  );
  const installedAfter = await hashDirectory(INSTALLED_RUNTIME_ROOT);
  if (installedBefore !== installedAfter) {
    writeResult(blocker("PATH_ESCAPE", "installed runtime", "Installed plugin bytes changed during execution.", "Restore the plugin and use an external private output root.", rawCommand), 1);
    return;
  }
  if (!execution.stdout.trim()) {
    writeResult(blocker("TECHNICAL_QA_FAILED", "runtime", execution.stderr.trim().split("\n")[0] || "Renderer returned no result.", "Inspect the local runtime and retry.", rawCommand), 1);
    return;
  }
  process.stdout.write(execution.stdout);
  process.exitCode = execution.code;
}

main().catch((error) => {
  const mode = process.argv[2] ?? "preflight";
  writeResult(blocker(error.code ?? "TECHNICAL_QA_FAILED", "launcher", error.message, "Inspect the local runtime and retry.", mode), 1);
});
