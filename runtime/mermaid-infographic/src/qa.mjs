const RENDER_STATUSES = ["rendered", "rendered-with-warnings", "failed"];
const EDITORIAL_STATUSES = [
  "production-ready",
  "needs-preset",
  "native-limited",
  "experimental",
  "unsuitable-for-editorial",
];

function numericAttribute(attributes, name) {
  const match = attributes.match(
    new RegExp(`${name}=["'](-?\\d+(?:\\.\\d+)?)["']`, "i"),
  );
  return match ? Number(match[1]) : 0;
}

export function inspectSvgMarkup(svg) {
  const errors = [];
  const warnings = [];
  const viewBoxMatch = svg.match(
    /viewBox=["'](-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)["']/i,
  );
  if (!viewBoxMatch) {
    errors.push("SVG is missing a numeric viewBox.");
  } else {
    const [, rawX, rawY, rawWidth, rawHeight] = viewBoxMatch;
    const bounds = {
      x: Number(rawX),
      y: Number(rawY),
      width: Number(rawWidth),
      height: Number(rawHeight),
    };
    for (const match of svg.matchAll(/<foreignObject\b([^>]*)>/gi)) {
      const x = numericAttribute(match[1], "x");
      const y = numericAttribute(match[1], "y");
      const width = numericAttribute(match[1], "width");
      const height = numericAttribute(match[1], "height");
      if (
        x < bounds.x ||
        y < bounds.y ||
        x + width > bounds.x + bounds.width ||
        y + height > bounds.y + bounds.height
      ) {
        errors.push("A foreignObject extends outside the SVG viewBox.");
      }
    }
  }
  for (const match of svg.matchAll(
    /font-size=["'](\d+(?:\.\d+)?)(?:px)?["']/gi,
  )) {
    if (Number(match[1]) < 12)
      errors.push(`Effective font-size ${match[1]}px is below 12px.`);
  }
  if (/<text\b[^>]*>\s*<\/text>/i.test(svg))
    warnings.push("SVG contains an empty text element.");
  return {
    ok: errors.length === 0,
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
    needsHumanReview: /<foreignObject\b/i.test(svg),
  };
}

export function inspectPngBuffer(buffer, expected) {
  const errors = [];
  const signature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== signature) {
    errors.push("PNG output is missing or corrupt.");
    return { ok: false, errors, warnings: [], width: null, height: null };
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  if (expected?.width && width !== expected.width) {
    errors.push(`PNG width ${width} does not match expected ${expected.width}.`);
  }
  if (expected?.height && height !== expected.height) {
    errors.push(`PNG height ${height} does not match expected ${expected.height}.`);
  }
  return { ok: errors.length === 0, errors, warnings: [], width, height };
}

export function summarizeManifest(entries) {
  const render = Object.fromEntries(
    RENDER_STATUSES.map((status) => [status, 0]),
  );
  const editorial = Object.fromEntries(
    EDITORIAL_STATUSES.map((status) => [status, 0]),
  );
  for (const entry of entries) {
    if (entry.renderStatus in render) render[entry.renderStatus] += 1;
    if (entry.editorialStatus in editorial)
      editorial[entry.editorialStatus] += 1;
  }
  return { total: entries.length, render, editorial };
}
