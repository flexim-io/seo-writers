import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export const MINIMUM_NODE_MAJOR = 22;

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

export async function resolveChromeExecutable(env = process.env) {
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
      env: options.env ?? process.env,
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

export function platformCacheRoot(env = process.env) {
  if (env.SEO_WRITERS_MERMAID_CACHE) return path.resolve(env.SEO_WRITERS_MERMAID_CACHE);
  if (process.platform === "darwin") return path.join(os.homedir(), "Library", "Caches");
  if (process.platform === "win32") return path.resolve(env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local"));
  return path.resolve(env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache"));
}
