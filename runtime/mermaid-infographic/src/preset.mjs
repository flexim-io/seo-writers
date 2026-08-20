import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseTokens, tokenNumber, tokenValue } from "./tokens.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MERMAID_THEME_TOKENS = {
  fontFamily: "--flexim-font-body",
  fontSize: "--flexim-type-default-size",
  background: "--flexim-color-canvas",
  primaryColor: "--flexim-color-surface",
  primaryTextColor: "--flexim-color-ink",
  primaryBorderColor: "--flexim-color-border",
  secondaryColor: "--flexim-color-accent-soft",
  secondaryTextColor: "--flexim-color-ink",
  secondaryBorderColor: "--flexim-color-accent-border",
  tertiaryColor: "--flexim-color-surface-muted",
  tertiaryTextColor: "--flexim-color-ink-subtle",
  tertiaryBorderColor: "--flexim-color-border",
  lineColor: "--flexim-color-edge-active",
  textColor: "--flexim-color-ink",
  mainBkg: "--flexim-color-surface",
  nodeBorder: "--flexim-color-border",
  clusterBkg: "--flexim-color-cluster",
  clusterBorder: "--flexim-color-cluster-border",
  edgeLabelBackground: "--flexim-color-canvas",
  titleColor: "--flexim-color-ink",
  actorBkg: "--flexim-color-surface",
  actorBorder: "--flexim-color-accent-border",
  actorTextColor: "--flexim-color-ink",
  actorLineColor: "--flexim-color-edge",
  signalColor: "--flexim-color-signal",
  signalTextColor: "--flexim-color-ink",
  labelBoxBkgColor: "--flexim-color-canvas",
  labelBoxBorderColor: "--flexim-color-edge",
  labelTextColor: "--flexim-color-ink",
  loopTextColor: "--flexim-color-ink",
  noteBkgColor: "--flexim-color-warning-surface",
  noteBorderColor: "--flexim-color-warning-border",
  noteTextColor: "--flexim-color-ink",
  activationBkgColor: "--flexim-color-accent-soft",
  activationBorderColor: "--flexim-color-accent",
  emUiFill: "--flexim-color-surface",
  emUiStroke: "--flexim-color-border",
  emProcessorFill: "--flexim-color-surface-muted",
  emProcessorStroke: "--flexim-color-border",
  emCommandFill: "--flexim-color-surface",
  emCommandStroke: "--flexim-color-accent-border",
  emEventFill: "--flexim-color-accent-soft",
  emEventStroke: "--flexim-color-accent-border",
  emReadModelFill: "--flexim-color-accent",
  emReadModelStroke: "--flexim-color-accent",
  emRelationStroke: "--flexim-color-edge-active",
  emArrowhead: "--flexim-color-accent",
  emSwimlaneBackgroundOdd: "--flexim-color-surface",
  emSwimlaneBackgroundStroke: "--flexim-color-border",
  git0: "--flexim-color-accent",
  git1: "--flexim-color-ink",
  git2: "--flexim-color-data-muted",
  git3: "--flexim-color-edge",
  gitInv0: "--flexim-color-on-strong",
  gitInv1: "--flexim-color-on-strong",
  gitInv2: "--flexim-color-on-strong",
  gitInv3: "--flexim-color-ink",
  pie1: "--flexim-color-accent",
  pie2: "--flexim-color-accent-border",
  pie3: "--flexim-color-edge",
  pie4: "--flexim-color-accent-pale",
  pieTitleTextSize: "--flexim-type-data-title-size",
  pieSectionTextSize: "--flexim-type-data-label-size",
  pieLegendTextSize: "--flexim-type-data-label-size",
};

export function composeMermaidConfig(baseConfig, presetCss) {
  const tokens = parseTokens(presetCss);
  const config = structuredClone(baseConfig);
  config.journey = {
    ...(config.journey ?? {}),
    width: tokenNumber(tokens, "--flexim-step-width"),
    height: tokenNumber(tokens, "--flexim-step-min-height"),
  };
  config.sequence = {
    ...(config.sequence ?? {}),
    width: tokenNumber(tokens, "--flexim-step-width"),
    height: tokenNumber(tokens, "--flexim-step-min-height"),
  };
  const themeVariables = { ...(baseConfig.themeVariables ?? {}) };
  for (const [themeVariable, tokenName] of Object.entries(
    MERMAID_THEME_TOKENS,
  )) {
    themeVariables[themeVariable] = tokenValue(tokens, tokenName);
  }
  return {
    ...config,
    themeVariables,
    themeCSS: `${baseConfig.themeCSS ?? ""}\n${presetCss}`,
  };
}

export function presetStylesheetPaths(preset) {
  const files = [
    path.join(ROOT, "presets", "flexim-tokens.css"),
    path.join(ROOT, "presets", "flexim-base.css"),
  ];
  if (preset === "flexim-flow")
    files.push(path.join(ROOT, "presets", "flexim-flow.css"));
  return files;
}

export async function loadPresetCss(preset) {
  const stylesheets = await Promise.all(
    presetStylesheetPaths(preset).map((filePath) => readFile(filePath, "utf8")),
  );
  const css = `${stylesheets.join("\n")}\n`;
  const tokens = parseTokens(css);
  return css.replaceAll(
    "@media (--flexim-mobile)",
    `@media (max-width: ${tokenValue(tokens, "--flexim-breakpoint-mobile-max")})`,
  );
}

export function presetFingerprintPaths(preset) {
  return [
    path.join(ROOT, "config", "mermaid.json"),
    path.join(ROOT, "config", "production-syntaxes.json"),
    path.join(ROOT, "src", "adapters.mjs"),
    path.join(ROOT, "src", "metadata-core.mjs"),
    path.join(ROOT, "src", "metadata.mjs"),
    path.join(ROOT, "src", "preset.mjs"),
    path.join(ROOT, "src", "qa.mjs"),
    path.join(ROOT, "src", "security.mjs"),
    path.join(ROOT, "src", "svg-normalization.mjs"),
    path.join(ROOT, "src", "tokens.mjs"),
    ...presetStylesheetPaths(preset),
  ];
}

export async function fingerprintPreset(preset) {
  const files = presetFingerprintPaths(preset);
  const hash = createHash("sha256").update(preset);
  for (const filePath of files) hash.update(await readFile(filePath));
  return hash.digest("hex");
}
