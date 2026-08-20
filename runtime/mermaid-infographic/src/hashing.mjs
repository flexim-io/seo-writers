import { createHash } from "node:crypto";
import { lstat, readFile, readdir, readlink } from "node:fs/promises";
import path from "node:path";

export function canonicalizeJson(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("Canonical JSON rejects non-finite numbers.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalizeJson).join(",")}]`;
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalizeJson(value[key])}`).join(",")}}`;
  }
  throw new TypeError(`Canonical JSON does not support ${typeof value}.`);
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function fingerprintCanonicalJson(value) {
  return sha256(canonicalizeJson(value));
}

export async function hashFile(filePath) {
  return sha256(await readFile(filePath));
}

export async function hashDirectory(root, options = {}) {
  const ignored = new Set(options.ignore ?? [".git", "node_modules"]);
  const hash = createHash("sha256");

  async function visit(directory, relativeRoot = "") {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      if (ignored.has(entry.name)) continue;
      const relative = path.posix.join(relativeRoot, entry.name);
      const absolute = path.join(directory, entry.name);
      const stats = await lstat(absolute);
      if (stats.isDirectory()) {
        hash.update(`d:${relative}\n`);
        await visit(absolute, relative);
      } else if (stats.isSymbolicLink()) {
        hash.update(`l:${relative}:${await readlink(absolute)}\n`);
      } else if (stats.isFile()) {
        hash.update(`f:${relative}:${stats.mode & 0o777}:`);
        hash.update(await readFile(absolute));
        hash.update("\n");
      }
    }
  }

  await visit(path.resolve(root));
  return hash.digest("hex");
}
