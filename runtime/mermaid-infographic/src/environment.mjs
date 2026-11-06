import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export const MINIMUM_NODE_MAJOR = 22;

export function runtimeEnvironment(options = {}) {
  const env = {
    PATH: options.PATH ?? options.Path ?? options.path ?? process.env.PATH ?? process.env.Path ?? process.env.path,
    HOME: options.HOME ?? process.env.HOME,
    USERPROFILE: options.USERPROFILE ?? process.env.USERPROFILE,
    TMPDIR: options.TMPDIR ?? process.env.TMPDIR,
    TMP: options.TMP ?? process.env.TMP,
    TEMP: options.TEMP ?? process.env.TEMP,
    LANG: options.LANG ?? process.env.LANG,
    LANGUAGE: options.LANGUAGE ?? process.env.LANGUAGE,
    LC_ALL: options.LC_ALL ?? process.env.LC_ALL,
    LC_CTYPE: options.LC_CTYPE ?? process.env.LC_CTYPE,
    TZ: options.TZ ?? process.env.TZ,
    SystemRoot: options.SystemRoot ?? options.SYSTEMROOT ?? process.env.SystemRoot ?? process.env.SYSTEMROOT,
    SystemDrive: options.SystemDrive ?? options.SYSTEMDRIVE ?? process.env.SystemDrive ?? process.env.SYSTEMDRIVE,
    ComSpec: options.ComSpec ?? options.COMSPEC ?? process.env.ComSpec ?? process.env.COMSPEC,
    WINDIR: options.WINDIR ?? options.windir ?? process.env.WINDIR ?? process.env.windir,
    PATHEXT: options.PATHEXT ?? process.env.PATHEXT,
    PROGRAMFILES: options.PROGRAMFILES ?? options.ProgramFiles ?? process.env.PROGRAMFILES ?? process.env.ProgramFiles,
    APPDATA: options.APPDATA ?? process.env.APPDATA,
    LOCALAPPDATA: options.LOCALAPPDATA ?? process.env.LOCALAPPDATA,
    XDG_CACHE_HOME: options.XDG_CACHE_HOME ?? process.env.XDG_CACHE_HOME,
    XDG_CONFIG_HOME: options.XDG_CONFIG_HOME ?? process.env.XDG_CONFIG_HOME,
    XDG_DATA_HOME: options.XDG_DATA_HOME ?? process.env.XDG_DATA_HOME,
    XDG_RUNTIME_DIR: options.XDG_RUNTIME_DIR ?? process.env.XDG_RUNTIME_DIR,
    MERMAID_CHROME_PATH: options.MERMAID_CHROME_PATH ?? process.env.MERMAID_CHROME_PATH,
    PUPPETEER_EXECUTABLE_PATH: options.PUPPETEER_EXECUTABLE_PATH ?? process.env.PUPPETEER_EXECUTABLE_PATH,
    PUPPETEER_SKIP_DOWNLOAD: options.PUPPETEER_SKIP_DOWNLOAD ?? process.env.PUPPETEER_SKIP_DOWNLOAD,
    SEO_WRITERS_MERMAID_CACHE: options.SEO_WRITERS_MERMAID_CACHE ?? process.env.SEO_WRITERS_MERMAID_CACHE,
    SEO_WRITERS_INSTALLED_RUNTIME: options.SEO_WRITERS_INSTALLED_RUNTIME ?? process.env.SEO_WRITERS_INSTALLED_RUNTIME,
  };
  return Object.fromEntries(Object.entries(env).filter(([, value]) => value !== undefined));
}

function npmEnvironment(root, options) {
  const home = path.join(root, "home");
  const temporary = path.join(root, "tmp");
  const { PATH, SystemRoot, SystemDrive, ComSpec, WINDIR, PATHEXT } = runtimeEnvironment(options);
  return {
    PATH,
    SystemRoot,
    SystemDrive,
    ComSpec,
    WINDIR,
    PATHEXT,
    HOME: home,
    USERPROFILE: home,
    APPDATA: path.join(home, "AppData", "Roaming"),
    LOCALAPPDATA: path.join(home, "AppData", "Local"),
    XDG_CONFIG_HOME: path.join(home, ".config"),
    XDG_CACHE_HOME: path.join(home, ".cache"),
    XDG_DATA_HOME: path.join(home, ".local", "share"),
    TMPDIR: temporary,
    TMP: temporary,
    TEMP: temporary,
    NPM_CONFIG_USERCONFIG: path.join(root, "user.npmrc"),
    NPM_CONFIG_GLOBALCONFIG: path.join(root, "global.npmrc"),
    NPM_CONFIG_CACHE: path.join(root, "cache"),
    PUPPETEER_SKIP_DOWNLOAD: "true",
  };
}

export function nodeIsCompatible(version = process.versions.node) {
  const major = Number.parseInt(String(version).split(".")[0], 10);
  return Number.isInteger(major) && major >= MINIMUM_NODE_MAJOR;
}

async function isExecutable(candidate) {
  if (!candidate) return false;
  try {
    await access(candidate, 1);
    return true;
  } catch {
    return false;
  }
}

export async function resolveChromeExecutable(env = runtimeEnvironment()) {
  const candidates = [
    env.MERMAID_CHROME_PATH,
    env.PUPPETEER_EXECUTABLE_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    process.platform === "win32"
      ? path.join(env.PROGRAMFILES ?? "", "Google", "Chrome", "Application", "chrome.exe")
      : null,
  ];
  for (const candidate of candidates) {
    if (await isExecutable(candidate)) return path.resolve(candidate);
  }
  const error = new Error("BROWSER_UNAVAILABLE: No compatible local Chrome or Chromium executable found.");
  error.code = "BROWSER_UNAVAILABLE";
  throw error;
}

export function readProcessOutput(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.npmRoot
        ? npmEnvironment(options.npmRoot, options.env)
        : runtimeEnvironment(options.env),
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const timeoutMs = options.timeoutMs ?? 30_000;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      reject(new Error(`${path.basename(command)} timed out after ${timeoutMs}ms.`));
    }, timeoutMs);
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
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${path.basename(command)} exited with ${code}: ${(stderr || stdout).trim().split("\n")[0]}`));
    });
  });
}

export async function chromeVersion(chromePath) {
  const { stdout, stderr } = await readProcessOutput(chromePath, ["--version"], {
    timeoutMs: 10_000,
  });
  return (stdout || stderr).trim().split("\n")[0];
}

export function platformCacheRoot(env = runtimeEnvironment()) {
  if (env.SEO_WRITERS_MERMAID_CACHE) return path.resolve(env.SEO_WRITERS_MERMAID_CACHE);
  if (process.platform === "darwin") return path.join(os.homedir(), "Library", "Caches");
  if (process.platform === "win32") return path.resolve(env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local"));
  return path.resolve(env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache"));
}
