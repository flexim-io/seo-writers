import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { access, mkdir, mkdtemp, rm } from "node:fs/promises";
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

export async function isolatedEnvironment(root, options = {}, { readOnly = false, temporary = path.join(root, "tmp") } = {}) {
  const env = runtimeEnvironment(options);
  const home = path.join(root, "home");
  const directories = {
    HOME: home,
    USERPROFILE: home,
    APPDATA: path.join(home, "AppData", "Roaming"),
    LOCALAPPDATA: path.join(home, "AppData", "Local"),
    XDG_CONFIG_HOME: path.join(home, ".config"),
    XDG_CACHE_HOME: path.join(home, ".cache"),
    XDG_DATA_HOME: path.join(home, ".local", "share"),
    XDG_RUNTIME_DIR: path.join(root, "run"),
    TMPDIR: temporary,
    TMP: temporary,
    TEMP: temporary,
  };
  if (!readOnly) {
    await Promise.all([...new Set(Object.values(directories))].map((directory) => mkdir(directory, { recursive: true, mode: 0o700 })));
  }
  const systemPaths = process.platform === "win32"
    ? [path.join(env.SystemRoot ?? "C:\\Windows", "System32"), env.SystemRoot ?? "C:\\Windows"]
    : ["/usr/bin", "/bin", "/usr/sbin", "/sbin"];
  return {
    ...env,
    ...directories,
    SystemRoot: env.SystemRoot,
    PATH: [path.dirname(process.execPath), ...systemPaths].join(path.delimiter),
    NODE_V8_COVERAGE: "",
  };
}

// Linux Chrome binds its process-singleton socket under TMPDIR, and Unix socket paths are
// limited to 108 bytes. A deep profile cannot hold that directory, so Chrome shares the
// fresh temporary directory created for the current renderer or setup process.
export function browserEnvironment(userDataDir) {
  return isolatedEnvironment(userDataDir, {}, { temporary: os.tmpdir() });
}

async function npmEnvironment(root, options) {
  const isolated = await isolatedEnvironment(root, options);
  const { HOME, USERPROFILE, APPDATA, LOCALAPPDATA, XDG_CONFIG_HOME, XDG_CACHE_HOME, XDG_DATA_HOME, XDG_RUNTIME_DIR, TMPDIR, TMP, TEMP, SystemRoot } = isolated;
  return {
    HOME, USERPROFILE, APPDATA, LOCALAPPDATA, XDG_CONFIG_HOME, XDG_CACHE_HOME, XDG_DATA_HOME, XDG_RUNTIME_DIR, TMPDIR, TMP, TEMP, SystemRoot,
    NPM_CONFIG_USERCONFIG: path.join(root, "user.npmrc"),
    NPM_CONFIG_GLOBALCONFIG: path.join(root, "global.npmrc"),
    NPM_CONFIG_CACHE: path.join(root, "cache"),
    NPM_CONFIG_REGISTRY: "https://registry.npmjs.org",
    PUPPETEER_SKIP_DOWNLOAD: "true",
    NODE_V8_COVERAGE: "",
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

export async function readProcessOutput(command, args, options = {}) {
  const root = options.npmRoot ?? (options.readOnly
    ? path.join(os.tmpdir(), `seo-writers-process-${randomUUID()}`)
    : await mkdtemp(path.join(os.tmpdir(), "seo-writers-process-")));
  let closed;
  try {
    const env = options.npmRoot ? await npmEnvironment(root, options.env) : await isolatedEnvironment(root, options.env, { readOnly: options.readOnly });
    return await new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: options.cwd,
        env,
        stdio: ["ignore", "pipe", "pipe"],
      });
      closed = new Promise((resolveClose) => child.once("close", resolveClose));
      let stdout = "";
      let stderr = "";
      let settled = false;
      let killTimer;
      const timeoutMs = options.timeoutMs ?? 30_000;
      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        killTimer = setTimeout(() => child.kill("SIGKILL"), 250);
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
        if (code === 0) resolve({ stdout, stderr });
        else reject(new Error(`${path.basename(command)} exited with ${code}: ${(stderr || stdout).trim().split("\n")[0]}`));
      });
    });
  } finally {
    await closed;
    if (!options.npmRoot && !options.readOnly) await rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
  }
}

export async function chromeVersion(chromePath) {
  const { stdout, stderr } = await readProcessOutput(chromePath, ["--version"], {
    timeoutMs: 10_000,
    readOnly: true,
  });
  return (stdout || stderr).trim().split("\n")[0];
}

export function platformCacheRoot(env = runtimeEnvironment()) {
  if (env.SEO_WRITERS_MERMAID_CACHE) return path.resolve(env.SEO_WRITERS_MERMAID_CACHE);
  if (process.platform === "darwin") return path.join(os.homedir(), "Library", "Caches");
  if (process.platform === "win32") return path.resolve(env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local"));
  return path.resolve(env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache"));
}
