#!/usr/bin/env node

import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, realpath, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { inspectRuntimeCache, setupCommand } from "./cache.mjs";
import {
  chromeVersion,
  isolatedEnvironment,
  nodeIsCompatible,
  resolveChromeExecutable,
  runtimeEnvironment,
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

export async function runCachedCli(cliPath, args, env, timeoutMs = 120_000) {
  const readOnly = args[0] === "preflight";
  const temporaryRoot = readOnly
    ? path.join(os.tmpdir(), `seo-writers-cli-${randomUUID()}`)
    : await mkdtemp(path.join(os.tmpdir(), "seo-writers-cli-"));
  let closed = Promise.resolve();
  try {
    const isolatedEnv = await isolatedEnvironment(temporaryRoot, env, { readOnly });
    return await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ["--no-global-search-paths", cliPath, ...args], {
        env: isolatedEnv,
        stdio: ["pipe", "pipe", "pipe"],
      });
      closed = new Promise((resolveClose) => child.once("close", resolveClose));
      let stdout = "";
      let stderr = "";
      let settled = false;
      let killTimer;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        killTimer = setTimeout(() => child.kill("SIGKILL"), 250);
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
        clearTimeout(timer);
        clearTimeout(killTimer);
        if (settled) return;
        settled = true;
        reject(error);
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        clearTimeout(killTimer);
        if (settled) return;
        settled = true;
        resolve({ code, stdout, stderr });
      });
    });
  } finally {
    await closed;
    if (!readOnly) await rm(temporaryRoot, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
  }
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

  let npmCliPath;
  if (rawCommand === "setup") {
    const npmCliIndex = rawArgs.indexOf("--npm-cli");
    if (npmCliIndex !== -1) {
      npmCliPath = rawArgs[npmCliIndex + 1];
      if (!npmCliPath || npmCliPath.startsWith("--")) {
        writeResult(blocker("BRIEF_INCOMPLETE", "--npm-cli", "The --npm-cli option requires a path to npm's bin/npm-cli.js.", "Provide --npm-cli <path> or omit it to use npm beside Node.js.", rawCommand), 1);
        return;
      }
    }
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
        npmCliPath,
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
    runtimeEnvironment({
      MERMAID_CHROME_PATH: chromePath,
      SEO_WRITERS_INSTALLED_RUNTIME: INSTALLED_RUNTIME_ROOT,
    }),
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

if (process.argv[1] && await realpath(process.argv[1]) === await realpath(LAUNCHER_PATH)) {
  main().catch((error) => {
    const mode = process.argv[2] ?? "preflight";
    writeResult(blocker(error.code ?? "TECHNICAL_QA_FAILED", "launcher", error.message, "Inspect the local runtime and retry.", mode), 1);
  });
}
