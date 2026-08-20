import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import puppeteer from "puppeteer";

import { buildRenderableSource } from "./metadata.mjs";
import { composeMermaidConfig, loadPresetCss } from "./preset.mjs";
import { PREVIEW_FIT_MAP, PREVIEW_LAYOUT } from "./preview-fit.mjs";
import { escapeLabelValue } from "./security.mjs";
import { normalizeSvgMarkup } from "./svg-normalization.mjs";
import {
  DESIGN_TOKENS,
  tokenNumber,
  tokenValue,
} from "./tokens.mjs";

export const PROFILE_MAP = Object.freeze({
  desktop: Object.freeze({
    width: tokenNumber(DESIGN_TOKENS, "--flexim-canvas-desktop-width"),
    height: tokenNumber(DESIGN_TOKENS, "--flexim-canvas-desktop-height"),
    padding: tokenNumber(DESIGN_TOKENS, "--flexim-canvas-desktop-padding"),
    deviceScaleFactor: tokenNumber(
      DESIGN_TOKENS,
      "--flexim-canvas-desktop-device-scale",
    ),
    minFontSize: tokenNumber(
      DESIGN_TOKENS,
      "--flexim-canvas-desktop-min-font-size",
    ),
  }),
  article: Object.freeze({
    width: tokenNumber(DESIGN_TOKENS, "--flexim-canvas-article-width"),
    height: tokenNumber(DESIGN_TOKENS, "--flexim-canvas-article-height"),
    padding: tokenNumber(DESIGN_TOKENS, "--flexim-canvas-article-padding"),
    deviceScaleFactor: tokenNumber(
      DESIGN_TOKENS,
      "--flexim-canvas-article-device-scale",
    ),
    minFontSize: tokenNumber(
      DESIGN_TOKENS,
      "--flexim-canvas-article-min-font-size",
    ),
  }),
  mobile: Object.freeze({
    width: tokenNumber(DESIGN_TOKENS, "--flexim-canvas-mobile-width"),
    height: tokenNumber(
      DESIGN_TOKENS,
      "--flexim-canvas-mobile-preview-height",
    ),
    padding: tokenNumber(DESIGN_TOKENS, "--flexim-canvas-mobile-padding"),
    deviceScaleFactor: tokenNumber(
      DESIGN_TOKENS,
      "--flexim-canvas-mobile-device-scale",
    ),
    minFontSize: tokenNumber(
      DESIGN_TOKENS,
      "--flexim-canvas-mobile-min-font-size",
    ),
  }),
});

function runProcess(command, args, options = {}) {
  const { cwd, env = process.env, timeoutMs = 90_000 } = options;
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env });
    let stdout = "";
    let stderr = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGTERM");
      reject(new Error(`Renderer timeout after ${timeoutMs}ms.`));
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
      else reject(new Error(`Mermaid CLI exited with ${code}: ${(stderr || stdout).trim().split("\n")[0]}`));
    });
  });
}

async function prepareInvocationRuntime({ runtimeRoot, workRoot, preset, chromePath }) {
  await mkdir(workRoot, { recursive: true });
  const presetCss = await loadPresetCss(preset);
  const baseConfig = JSON.parse(
    await readFile(path.join(runtimeRoot, "config", "mermaid.json"), "utf8"),
  );
  const mermaidConfig = composeMermaidConfig(baseConfig, presetCss);
  const configPath = path.join(workRoot, `${preset}.mermaid.json`);
  const cssPath = path.join(workRoot, `${preset}.css`);
  const puppeteerConfigPath = path.join(workRoot, "puppeteer.json");
  await writeFile(configPath, `${JSON.stringify(mermaidConfig, null, 2)}\n`);
  await writeFile(cssPath, presetCss);
  await writeFile(
    puppeteerConfigPath,
    `${JSON.stringify(
      {
        executablePath: chromePath,
        headless: true,
        args: ["--no-sandbox", "--disable-background-networking"],
        userDataDir: path.join(workRoot, "mmdc-chrome-profile"),
      },
      null,
      2,
    )}\n`,
  );
  return { configPath, cssPath, puppeteerConfigPath, mermaidConfig };
}

function pageTemplate(svg, metadata, profile, background, previewFit) {
  const title = escapeLabelValue(metadata.title);
  const framePadding = previewFit.framePadding ?? profile.padding;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; min-height: 100%; background: ${background}; }
  #frame { width: ${profile.width}px; height: ${profile.height}px; padding: ${framePadding}px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: ${background}; }
  #frame > svg { display: block; flex: none; max-width: 100%; height: auto; overflow: visible; }
</style>
</head>
<body><main id="frame" aria-label="${title}">${svg}</main></body>
</html>`;
}

async function inspectPage(page, profile) {
  return page.evaluate(async ({ minFontSize }) => {
    await document.fonts.ready;
    const svg = document.querySelector("svg");
    const frame = document.querySelector("#frame");
    if (!(svg instanceof SVGSVGElement) || !(frame instanceof HTMLElement)) {
      return { errors: ["Preview has no SVG root."], warnings: [], needsHumanReview: true };
    }
    const errors = [];
    const warnings = [];
    const svgBounds = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const scale = viewBox.width > 0 ? svgBounds.width / viewBox.width : 1;

    const outside = [];
    for (const element of svg.querySelectorAll(".node, .edgeLabel, .cluster-label, foreignObject, text")) {
      const bounds = element.getBoundingClientRect();
      if (bounds.width === 0 && bounds.height === 0) continue;
      if (
        bounds.left < svgBounds.left - 2 ||
        bounds.top < svgBounds.top - 2 ||
        bounds.right > svgBounds.right + 2 ||
        bounds.bottom > svgBounds.bottom + 2
      ) {
        outside.push(element.getAttribute("data-id") || element.id || element.tagName);
      }
    }
    if (outside.length) errors.push(`${outside.length} rendered elements extend outside the SVG bounds.`);

    const overflow = [];
    for (const foreignObject of svg.querySelectorAll("foreignObject")) {
      const content = foreignObject.firstElementChild;
      if (
        content instanceof HTMLElement &&
        (content.scrollWidth > content.clientWidth + 2 ||
          content.scrollHeight > content.clientHeight + 2)
      ) {
        overflow.push(content.textContent?.trim().slice(0, 80) || "HTML label");
      }
    }
    if (overflow.length) errors.push(`${overflow.length} HTML labels overflow their allocated bounds.`);

    const nodes = [...svg.querySelectorAll(".node")]
      .map((node) => ({ node, bounds: node.getBoundingClientRect() }))
      .filter(({ bounds }) => bounds.width > 0 && bounds.height > 0);
    let overlaps = 0;
    for (let left = 0; left < nodes.length; left += 1) {
      for (let right = left + 1; right < nodes.length; right += 1) {
        const a = nodes[left].bounds;
        const b = nodes[right].bounds;
        if (
          a.left < b.right - 1 &&
          a.right > b.left + 1 &&
          a.top < b.bottom - 1 &&
          a.bottom > b.top + 1
        ) overlaps += 1;
      }
    }
    if (overlaps) errors.push(`${overlaps} pairs of diagram nodes overlap.`);

    const fontSizes = [...svg.querySelectorAll("text, foreignObject span, foreignObject strong, foreignObject small, foreignObject b")]
      .map((element) => Number.parseFloat(getComputedStyle(element).fontSize))
      .filter(Number.isFinite);
    const minRenderedFontSize = fontSizes.length ? Math.min(...fontSizes) * scale : null;
    if (minRenderedFontSize !== null && minRenderedFontSize < minFontSize) {
      errors.push(`Minimum rendered font-size is ${minRenderedFontSize}px; profile minimum is ${minFontSize}px.`);
    }
    const emptyLabels = [...svg.querySelectorAll(".node .label")].filter(
      (element) => !element.textContent?.trim() && !element.closest(".node")?.textContent?.trim(),
    ).length;
    if (emptyLabels) warnings.push(`${emptyLabels} rendered labels are empty.`);

    return {
      errors,
      warnings,
      needsHumanReview: true,
      viewport: { width: frame.clientWidth, height: frame.clientHeight },
      svg: {
        width: svgBounds.width,
        height: svgBounds.height,
        viewBox: { x: viewBox.x, y: viewBox.y, width: viewBox.width, height: viewBox.height },
        scale,
      },
      minRenderedFontSize,
      nodeCount: nodes.length,
      connectionCount: svg.querySelectorAll(".edgePath, .flowchart-link, .messageLine0, .messageLine1, .relation").length,
    };
  }, profile);
}

export function createRealAdapters(options) {
  const { runtimeRoot, workRoot, chromePath, timeoutMs = 90_000 } = options;
  return {
    async renderSvg({ source, metadata, outputPath }) {
      const runtime = await prepareInvocationRuntime({
        runtimeRoot,
        workRoot,
        preset: metadata.preset,
        chromePath,
      });
      const renderSourcePath = path.join(workRoot, `${metadata.id}.render.mmd`);
      await writeFile(renderSourcePath, buildRenderableSource(metadata, source));
      await runProcess(
        path.join(
          runtimeRoot,
          "node_modules",
          ".bin",
          process.platform === "win32" ? "mmdc.cmd" : "mmdc",
        ),
        [
          "--input", renderSourcePath,
          "--output", outputPath,
          "--configFile", runtime.configPath,
          "--cssFile", runtime.cssPath,
          "--puppeteerConfigFile", runtime.puppeteerConfigPath,
          "--backgroundColor", runtime.mermaidConfig.themeVariables.background,
          "--svgId", metadata.id,
          "--quiet",
        ],
        { cwd: runtimeRoot, timeoutMs },
      );
      const renderedSvg = await readFile(outputPath, "utf8");
      const normalizedSvg = normalizeSvgMarkup(renderedSvg, {
        syntax: metadata.syntax,
        nodeRadius: tokenNumber(DESIGN_TOKENS, "--flexim-radius-node"),
        title: metadata.title,
        accentColor: tokenValue(DESIGN_TOKENS, "--flexim-color-accent"),
      });
      if (normalizedSvg !== renderedSvg) await writeFile(outputPath, normalizedSvg);
    },

    async renderPng({ svgPath, metadata, outputPath, previewPath, qaPath }) {
      const profile = PROFILE_MAP[metadata.canvas];
      if (!profile) throw new Error(`Unknown browser profile: ${metadata.canvas}`);
      const background = tokenValue(DESIGN_TOKENS, "--flexim-color-canvas");
      const previewFit =
        PREVIEW_FIT_MAP[metadata.syntax] ?? PREVIEW_FIT_MAP.default;
      const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: true,
        args: ["--no-sandbox", "--disable-background-networking"],
        userDataDir: path.join(workRoot, "qa-chrome-profile"),
      });
      try {
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on("request", (request) => {
          const url = request.url();
          if (url === "about:blank" || url.startsWith("data:")) request.continue();
          else request.abort("blockedbyclient");
        });
        await page.setViewport({
          width: profile.width,
          height: profile.height,
          deviceScaleFactor: profile.deviceScaleFactor,
        });
        const svg = await readFile(svgPath, "utf8");
        await page.setContent(pageTemplate(svg, metadata, profile, background, previewFit), {
          waitUntil: "load",
          timeout: timeoutMs,
        });
        await page.evaluate(
          ({
            allowUpscale,
            contentInset,
            minimumWidthRatio,
            mobileFullWidthThreshold,
          }) => {
            const svgElement = document.querySelector("svg");
            const frame = document.querySelector("#frame");
            if (
              !(svgElement instanceof SVGSVGElement) ||
              !(frame instanceof HTMLElement)
            ) return;

            if (contentInset !== null) {
              const contentBounds = svgElement.getBBox();
              if (contentBounds.width > 0 && contentBounds.height > 0) {
                svgElement.setAttribute(
                  "viewBox",
                  [
                    contentBounds.x - contentInset,
                    contentBounds.y - contentInset,
                    contentBounds.width + contentInset * 2,
                    contentBounds.height + contentInset * 2,
                  ].join(" "),
                );
              }
            }

            if (allowUpscale) svgElement.style.maxWidth = "none";
            const viewBox = svgElement.viewBox.baseVal;
            const frameStyle = getComputedStyle(frame);
            const availableWidth =
              frame.clientWidth -
              Number.parseFloat(frameStyle.paddingLeft) -
              Number.parseFloat(frameStyle.paddingRight);
            const availableHeight =
              frame.clientHeight -
              Number.parseFloat(frameStyle.paddingTop) -
              Number.parseFloat(frameStyle.paddingBottom);
            const minimumWidth =
              frame.clientWidth <= mobileFullWidthThreshold
                ? availableWidth
                : availableWidth * minimumWidthRatio;
            const preferredWidth = Math.min(
              Math.max(viewBox.width, minimumWidth),
              availableWidth,
            );
            const width = Math.min(
              preferredWidth,
              (availableHeight / viewBox.height) * viewBox.width,
            );
            svgElement.style.width = `${width}px`;
            svgElement.style.height = `${(viewBox.height / viewBox.width) * width}px`;
          },
          { ...previewFit, ...PREVIEW_LAYOUT },
        );
        const qa = await inspectPage(page, profile);
        const frame = await page.$("#frame");
        if (!frame) throw new Error("Article preview frame is missing.");
        await frame.screenshot({ path: outputPath, type: "png", omitBackground: false });
        const pngBounds = await frame.boundingBox();
        qa.png = {
          width: Math.round((pngBounds?.width ?? profile.width) * profile.deviceScaleFactor),
          height: Math.round((pngBounds?.height ?? profile.height) * profile.deviceScaleFactor),
          deviceScaleFactor: profile.deviceScaleFactor,
        };
        await writeFile(previewPath, `${await page.content()}\n`);
        await writeFile(qaPath, `${JSON.stringify(qa, null, 2)}\n`);
        return qa;
      } finally {
        await browser.close();
      }
    },
  };
}

export { PREVIEW_FIT_MAP, PREVIEW_LAYOUT };
