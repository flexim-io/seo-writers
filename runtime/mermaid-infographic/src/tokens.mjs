import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const TOKEN_CSS_PATH = path.join(ROOT, "presets", "flexim-tokens.css");

export function parseTokens(css) {
  return new Map(
    [...css.matchAll(/(--flexim-[a-z0-9-]+)\s*:\s*([^;]+);/gi)].map(
      ([, name, value]) => [name, value.replace(/\s+/g, " ").trim()],
    ),
  );
}

export function tokenValue(tokens, name) {
  const value = tokens.get(name);
  if (value === undefined)
    throw new Error(`Missing required Flexim token: ${name}`);
  return value;
}

export function tokenNumber(tokens, name) {
  const rawValue = tokenValue(tokens, name);
  const value = Number.parseFloat(rawValue);
  if (!Number.isFinite(value))
    throw new Error(
      `Flexim token ${name} must be numeric, received: ${rawValue}`,
    );
  return value;
}

export function tokenOptionalNumber(tokens, name) {
  const rawValue = tokenValue(tokens, name);
  return rawValue === "none" ? null : tokenNumber(tokens, name);
}

export function tokenBoolean(tokens, name) {
  const rawValue = tokenValue(tokens, name);
  if (rawValue === "true") return true;
  if (rawValue === "false") return false;
  throw new Error(
    `Flexim token ${name} must be true or false, received: ${rawValue}`,
  );
}

export const DESIGN_TOKENS = parseTokens(
  await readFile(TOKEN_CSS_PATH, "utf8"),
);
