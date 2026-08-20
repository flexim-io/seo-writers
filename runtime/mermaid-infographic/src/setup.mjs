import { cp, mkdir, mkdtemp, realpath, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { cacheLocations, inspectRuntimeCache, runtimeIdentity } from "./cache.mjs";
import { readProcessOutput } from "./environment.mjs";
import { hashDirectory } from "./hashing.mjs";
import { assertDisjointPaths } from "./paths.mjs";

const REMOVE_TREE_OPTIONS = {
  recursive: true,
  force: true,
  maxRetries: 8,
  retryDelay: 250,
};

export async function setupRuntime(options) {
  const { installedRuntimeRoot, chromePath, chromeVersion, env = process.env } = options;
  if (env.PUPPETEER_SKIP_DOWNLOAD !== "true") {
    const error = new Error("SETUP_REQUIRED: Setup requires PUPPETEER_SKIP_DOWNLOAD=true.");
    error.code = "SETUP_REQUIRED";
    throw error;
  }

  const identity = await runtimeIdentity(installedRuntimeRoot);
  const locations = cacheLocations(identity, env);
  assertDisjointPaths(installedRuntimeRoot, locations.cacheRoot);
  const existing = await inspectRuntimeCache(installedRuntimeRoot, env);
  if (existing.ready) return existing;

  await mkdir(locations.cacheRoot, { recursive: true });
  assertDisjointPaths(
    await realpath(installedRuntimeRoot),
    await realpath(locations.cacheRoot),
  );
  const temporaryRoot = await mkdtemp(path.join(locations.cacheRoot, ".setup-"));
  const temporaryRuntime = path.join(temporaryRoot, "runtime");
  const chromeSmokeProfile = path.join(temporaryRoot, "chrome-smoke-profile");
  try {
    await cp(installedRuntimeRoot, temporaryRuntime, {
      recursive: true,
      filter: (source) => !source.split(path.sep).includes("node_modules"),
    });
    await readProcessOutput(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["ci", "--omit=dev"],
      {
        cwd: temporaryRuntime,
        env: { ...env, PUPPETEER_SKIP_DOWNLOAD: "true" },
        timeoutMs: 300_000,
      },
    );
    await readProcessOutput(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["ls", "--omit=dev", "--json"],
      { cwd: temporaryRuntime, env, timeoutMs: 30_000 },
    );
    await readProcessOutput(
      process.execPath,
      [
        path.join(temporaryRuntime, "src", "browser-smoke.mjs"),
        chromePath,
        chromeSmokeProfile,
      ],
      {
        cwd: temporaryRuntime,
        env: { ...env, MERMAID_CHROME_PATH: chromePath },
        timeoutMs: 60_000,
      },
    );
    await rm(chromeSmokeProfile, REMOVE_TREE_OPTIONS);
    await readProcessOutput(process.execPath, [path.join(temporaryRuntime, "src", "cli.mjs"), "help"], {
      cwd: temporaryRuntime,
      env: { ...env, MERMAID_CHROME_PATH: chromePath },
      timeoutMs: 30_000,
    });

    const copiedRuntimeSha256 = await hashDirectory(temporaryRuntime);
    if (copiedRuntimeSha256 !== identity.runtimeSha256) {
      throw new Error("Cached runtime bytes changed during dependency setup.");
    }
    await writeFile(
      path.join(temporaryRoot, "complete.json"),
      `${JSON.stringify(
        {
          schemaVersion: 1,
          rendererVersion: identity.rendererVersion,
          packageLockSha256: identity.packageLockSha256,
          runtimeSha256: identity.runtimeSha256,
          nodeVersion: process.version,
          chromeVersion,
        },
        null,
        2,
      )}\n`,
    );
    await rm(locations.entryRoot, REMOVE_TREE_OPTIONS);
    await rename(temporaryRoot, locations.entryRoot);
    return inspectRuntimeCache(installedRuntimeRoot, env);
  } catch (error) {
    await rm(temporaryRoot, REMOVE_TREE_OPTIONS);
    throw error;
  }
}
