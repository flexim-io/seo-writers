import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { platformCacheRoot } from "./environment.mjs";
import { hashDirectory, hashFile } from "./hashing.mjs";

export async function runtimeIdentity(runtimeRoot) {
  const packageJson = JSON.parse(await readFile(path.join(runtimeRoot, "package.json"), "utf8"));
  const packageLockSha256 = await hashFile(path.join(runtimeRoot, "package-lock.json"));
  const runtimeSha256 = await hashDirectory(runtimeRoot);
  return {
    rendererVersion: packageJson.version,
    packageLockSha256,
    runtimeSha256,
  };
}

export function cacheLocations(identity, env = process.env) {
  const cacheRoot = path.join(platformCacheRoot(env), "seo-writers", "mermaid-infographic");
  const key = `${identity.rendererVersion}-${identity.packageLockSha256}`;
  const entryRoot = path.join(cacheRoot, key);
  return {
    cacheRoot,
    key,
    entryRoot,
    runtimeRoot: path.join(entryRoot, "runtime"),
    markerPath: path.join(entryRoot, "complete.json"),
  };
}

export function requiredCacheRelativePaths(platform = process.platform) {
  return [
    "src/cli.mjs",
    platform === "win32" ? "node_modules/.bin/mmdc.cmd" : "node_modules/.bin/mmdc",
    "node_modules/@mermaid-js/mermaid-cli/package.json",
    "node_modules/dompurify/package.json",
    "node_modules/mermaid/package.json",
    "node_modules/puppeteer/package.json",
    "node_modules/yaml/package.json",
  ];
}

export async function inspectRuntimeCache(installedRuntimeRoot, env = process.env) {
  const identity = await runtimeIdentity(installedRuntimeRoot);
  const locations = cacheLocations(identity, env);
  try {
    const marker = JSON.parse(await readFile(locations.markerPath, "utf8"));
    if (
      marker.schemaVersion !== 1 ||
      marker.rendererVersion !== identity.rendererVersion ||
      marker.packageLockSha256 !== identity.packageLockSha256 ||
      marker.runtimeSha256 !== identity.runtimeSha256
    ) {
      return { ready: false, reason: "completion marker does not match the installed runtime", identity, locations };
    }
    const cachedIdentity = await runtimeIdentity(locations.runtimeRoot);
    if (
      cachedIdentity.rendererVersion !== identity.rendererVersion ||
      cachedIdentity.packageLockSha256 !== identity.packageLockSha256 ||
      cachedIdentity.runtimeSha256 !== identity.runtimeSha256
    ) {
      return { ready: false, reason: "cached runtime bytes do not match the installed runtime", identity, locations };
    }
    for (const relativePath of requiredCacheRelativePaths()) {
      await access(path.join(locations.runtimeRoot, relativePath), 4);
    }
    return { ready: true, reason: null, marker, identity, locations };
  } catch {
    return { ready: false, reason: "dependency cache is absent or incomplete", identity, locations };
  }
}

function quotePosix(value) {
  return `'${String(value).replaceAll("'", `'"'"'`)}'`;
}

export function setupCommand(launcherPath) {
  if (process.platform === "win32") {
    return `set PUPPETEER_SKIP_DOWNLOAD=true&& node "${launcherPath}" setup`;
  }
  return `PUPPETEER_SKIP_DOWNLOAD=true node ${quotePosix(launcherPath)} setup`;
}
