import { cp, lstat, mkdir, mkdtemp, readFile, readlink, realpath, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { cacheLocations, inspectRuntimeCache, runtimeIdentity } from "./cache.mjs";
import { readProcessOutput, runtimeEnvironment } from "./environment.mjs";
import { hashDirectory } from "./hashing.mjs";
import { assertDisjointPaths, isContainedPath } from "./paths.mjs";

const REMOVE_TREE_OPTIONS = {
  recursive: true,
  force: true,
  maxRetries: 8,
  retryDelay: 250,
};

async function resolveNpmCli(suppliedPath) {
  const nodePaths = [...new Set([process.execPath, await realpath(process.execPath)])];
  const candidates = suppliedPath ? [path.resolve(suppliedPath)] : nodePaths.flatMap((nodePath) => {
    const directory = path.dirname(nodePath);
    return [
      path.join(directory, "node_modules", "npm", "bin", "npm-cli.js"),
      path.join(directory, "..", "lib", "node_modules", "npm", "bin", "npm-cli.js"),
      path.join(directory, "..", "share", "nodejs", "npm", "bin", "npm-cli.js"),
    ];
  });
  for (const candidate of candidates) {
    const cliPath = await realpath(candidate).catch((error) => {
      if (!["ENOENT", "ENOTDIR"].includes(error.code)) throw error;
      return null;
    });
    if (!cliPath || path.basename(cliPath) !== "npm-cli.js" || path.basename(path.dirname(cliPath)) !== "bin") continue;
    const root = path.dirname(path.dirname(cliPath));
    const packagePath = await realpath(path.join(root, "package.json"));
    if (!isContainedPath(root, packagePath)) throw new Error("SETUP_REQUIRED: npm package metadata must stay inside its installation.");
    const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
    if (packageJson.name === "npm") return { root, cliPath };
  }
  const error = new Error("SETUP_REQUIRED: A self-contained npm installation beside Node.js or an explicit npm CLI path is required.");
  error.code = "SETUP_REQUIRED";
  throw error;
}

async function copyNpmCli(source, destination) {
  assertDisjointPaths(source.root, destination);
  await cp(source.root, destination, {
    recursive: true,
    verbatimSymlinks: true,
    filter: async (filePath) => {
      const relative = path.relative(source.root, filePath);
      if (relative && !["package.json", "bin", "lib", "node_modules"].includes(relative.split(path.sep)[0])) return false;
      if (["npmrc", ".npmrc"].includes(path.basename(filePath).toLowerCase())) return false;
      if ((await lstat(filePath)).isSymbolicLink()) {
        const target = await readlink(filePath);
        const resolvedTarget = await realpath(filePath);
        if (path.isAbsolute(target) || !isContainedPath(source.root, resolvedTarget) || ["npmrc", ".npmrc"].includes(path.basename(resolvedTarget).toLowerCase())) {
          const error = new Error("SETUP_REQUIRED: npm must not link to external code or configuration.");
          error.code = "SETUP_REQUIRED";
          throw error;
        }
      }
      return true;
    },
  });
  await writeFile(path.join(destination, "npmrc"), "");
  return path.join(destination, path.relative(source.root, source.cliPath));
}

export async function setupRuntime(options) {
  const { installedRuntimeRoot, chromePath, chromeVersion, env = runtimeEnvironment() } = options;
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
  const temporaryRoot = await realpath(await mkdtemp(path.join(locations.cacheRoot, ".setup-")));
  const temporaryRuntime = path.join(temporaryRoot, "runtime");
  const chromeSmokeProfile = path.join(temporaryRoot, "chrome-smoke-profile");
  const npmRoot = path.join(temporaryRoot, "npm");
  try {
    await cp(installedRuntimeRoot, temporaryRuntime, {
      recursive: true,
      filter: (source) => !source.split(path.sep).includes("node_modules"),
    });
    const projectConfig = await lstat(path.join(temporaryRuntime, ".npmrc")).catch((error) => {
      if (error.code !== "ENOENT") throw error;
      return null;
    });
    if (projectConfig) throw new Error("SETUP_REQUIRED: Project npm configuration is not allowed in the bundled runtime.");
    await mkdir(path.join(npmRoot, "home"), { recursive: true });
    await mkdir(path.join(npmRoot, "tmp"));
    await writeFile(path.join(npmRoot, "user.npmrc"), "");
    await writeFile(path.join(npmRoot, "global.npmrc"), "");
    const npmCli = await copyNpmCli(await resolveNpmCli(options.npmCliPath), path.join(npmRoot, "cli"));
    const readRoots = [...new Set([npmRoot, temporaryRuntime, process.execPath, await realpath(process.execPath)])];
    if (readRoots.some((root) => /[*,]/.test(root))) {
      throw new Error("SETUP_REQUIRED: Isolated setup paths cannot contain permission wildcard or list characters.");
    }
    const npmNodeArgs = [
      "--experimental-permission",
      "--disable-warning=ExperimentalWarning",
      "--no-global-search-paths",
      ...readRoots.map((root) => `--allow-fs-read=${root}`),
      ...[npmRoot, temporaryRuntime].map((root) => `--allow-fs-write=${root}`),
      npmCli,
    ];
    await readProcessOutput(
      process.execPath,
      [...npmNodeArgs, "ci", "--prefix", temporaryRuntime, "--omit=dev", "--ignore-scripts", "--bin-links=false", "--no-audit", "--no-fund", "--update-notifier=false", "--replace-registry-host=never"],
      {
        cwd: temporaryRuntime,
        env,
        npmRoot,
        timeoutMs: 300_000,
      },
    );
    await readProcessOutput(
      process.execPath,
      [...npmNodeArgs, "ls", "--prefix", temporaryRuntime, "--omit=dev", "--json", "--update-notifier=false"],
      { cwd: temporaryRuntime, env, npmRoot, timeoutMs: 30_000 },
    );
    await rm(npmRoot, REMOVE_TREE_OPTIONS);
    await readProcessOutput(
      process.execPath,
      [
        "--no-global-search-paths",
        path.join(temporaryRuntime, "src", "browser-smoke.mjs"),
        chromePath,
        chromeSmokeProfile,
      ],
      {
        cwd: temporaryRuntime,
        env: { ...runtimeEnvironment(env), MERMAID_CHROME_PATH: chromePath },
        timeoutMs: 60_000,
      },
    );
    await rm(chromeSmokeProfile, REMOVE_TREE_OPTIONS);
    await readProcessOutput(process.execPath, ["--no-global-search-paths", path.join(temporaryRuntime, "src", "cli.mjs"), "help"], {
      cwd: temporaryRuntime,
      env: { ...runtimeEnvironment(env), MERMAID_CHROME_PATH: chromePath },
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
