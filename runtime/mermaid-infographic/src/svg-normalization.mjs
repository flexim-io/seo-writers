const NUMBER_PATTERN = "-?\\d+(?:\\.\\d+)?";
const CLASS_RELATION_LABEL_CLEARANCE = 8;
const TIMELINE_DESCRIPTION_OFFSET = 24;
const TIMELINE_TITLE_CLEARANCE = 48;
const EVENT_MODELING_TITLE_BASELINE_OFFSET = 52;
const EVENT_MODELING_TITLE_HEIGHT = 24;
const EVENT_MODELING_TITLE_MARGIN = 30;
const ISHIKAWA_TITLE_BASELINE_OFFSET = 44;
const ISHIKAWA_TITLE_HEIGHT = 24;
const ISHIKAWA_TITLE_MARGIN = 24;
const ISHIKAWA_HORIZONTAL_SCALE = 1.8;
const ISHIKAWA_VERTICAL_SCALE = 0.55;

function formatNumber(value) {
  return Number(value.toFixed(3)).toString();
}

function attributeValue(markup, name) {
  return markup.match(new RegExp(`\\b${name}="(${NUMBER_PATTERN})"`))?.[1];
}

function replaceAttribute(markup, name, value) {
  return markup.replace(
    new RegExp(`\\b${name}="${NUMBER_PATTERN}"`),
    `${name}="${formatNumber(value)}"`,
  );
}

function scaleAttributeOccurrences(markup, name, scale) {
  return markup.replace(
    new RegExp(`\\b${name}="(${NUMBER_PATTERN})"`, "g"),
    (_match, value) => `${name}="${formatNumber(Number(value) * scale)}"`,
  );
}

function scaleAttributeOccurrencesAround(markup, name, origin, scale) {
  return markup.replace(
    new RegExp(`\\b${name}="(${NUMBER_PATTERN})"`, "g"),
    (_match, value) =>
      `${name}="${formatNumber(origin + (Number(value) - origin) * scale)}"`,
  );
}

function escapeXmlText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function insertTitleAboveSvg(
  svg,
  { className, title, titleX, titleY, titleHeight, titleMargin },
) {
  if (
    typeof title !== "string" ||
    !title.trim() ||
    svg.includes(`class="${className}"`)
  ) {
    return svg;
  }

  const titleMarkup = `<text class="${className}" x="${formatNumber(titleX)}" y="${formatNumber(titleY)}" text-anchor="middle">${escapeXmlText(title.trim())}</text>`;
  const firstGroupIndex = svg.indexOf("<g");
  let normalized =
    firstGroupIndex >= 0
      ? `${svg.slice(0, firstGroupIndex)}${titleMarkup}${svg.slice(firstGroupIndex)}`
      : svg;

  const viewBoxMatch = normalized.match(
    new RegExp(
      `viewBox="(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})"`,
    ),
  );
  if (!viewBoxMatch) return normalized;

  const [, x, y, width, height] = viewBoxMatch.map(Number);
  const currentBottom = y + height;
  const titleTop = titleY - titleHeight - titleMargin;
  const nextY = Math.min(y, titleTop);
  normalized = normalized.replace(
    viewBoxMatch[0],
    `viewBox="${formatNumber(x)} ${formatNumber(nextY)} ${formatNumber(width)} ${formatNumber(currentBottom - nextY)}"`,
  );
  return normalized;
}

function nodeSize(pathData) {
  const height = pathData.match(
    new RegExp(`^M0\\s+(${NUMBER_PATTERN})(?:\\s|$)`),
  )?.[1];
  const horizontal = pathData.match(
    new RegExp(`\\sh(${NUMBER_PATTERN})(?:\\s|$)`),
  )?.[1];
  const corner = pathData.match(
    new RegExp(`\\sq0,${NUMBER_PATTERN},(${NUMBER_PATTERN}),`),
  )?.[1];
  if (height === undefined || horizontal === undefined || corner === undefined)
    return null;
  return {
    height: Math.abs(Number(height)),
    width: Math.abs(Number(horizontal)) + Math.abs(Number(corner)) * 2,
  };
}

function roundedRectanglePath(width, height, requestedRadius) {
  const radius = Math.min(requestedRadius, width / 2, height / 2);
  const right = width - radius;
  const bottom = height - radius;
  return [
    `M${formatNumber(radius)} 0`,
    `H${formatNumber(right)}`,
    `Q${formatNumber(width)} 0 ${formatNumber(width)} ${formatNumber(radius)}`,
    `V${formatNumber(bottom)}`,
    `Q${formatNumber(width)} ${formatNumber(height)} ${formatNumber(right)} ${formatNumber(height)}`,
    `H${formatNumber(radius)}`,
    `Q0 ${formatNumber(height)} 0 ${formatNumber(bottom)}`,
    `V${formatNumber(radius)}`,
    `Q0 0 ${formatNumber(radius)} 0`,
    "Z",
  ].join(" ");
}

function classFrameBounds(pathData) {
  const match = pathData.match(
    new RegExp(
      `^M(${NUMBER_PATTERN})[ ,]+(${NUMBER_PATTERN})[ ,]+L(${NUMBER_PATTERN})[ ,]+(${NUMBER_PATTERN})[ ,]+L(${NUMBER_PATTERN})[ ,]+(${NUMBER_PATTERN})[ ,]+L(${NUMBER_PATTERN})[ ,]+(${NUMBER_PATTERN})(?:\\s|$)`,
    ),
  );
  if (!match) return null;

  const points = [
    [Number(match[1]), Number(match[2])],
    [Number(match[3]), Number(match[4])],
    [Number(match[5]), Number(match[6])],
    [Number(match[7]), Number(match[8])],
  ];
  const xs = [...new Set(points.map(([x]) => x))];
  const ys = [...new Set(points.map(([, y]) => y))];
  if (xs.length !== 2 || ys.length !== 2) return null;

  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return {
    x,
    y,
    width: Math.max(...xs) - x,
    height: Math.max(...ys) - y,
  };
}

function straightClassDividerPath(pathData) {
  const firstSubpath = pathData.trim().split(/\s+M\s*(?=-?\d)/, 1)[0];
  if (!firstSubpath.includes("C")) return null;

  const coordinates = firstSubpath
    .match(new RegExp(NUMBER_PATTERN, "g"))
    ?.map(Number);
  if (!coordinates || coordinates.length < 8) return null;

  return `M${formatNumber(coordinates[0])} ${formatNumber(coordinates[1])} L${formatNumber(coordinates.at(-2))} ${formatNumber(coordinates.at(-1))}`;
}

function normalizeClassDiagramSvg(svg, nodeRadius) {
  if (!svg.includes('aria-roledescription="class"')) return svg;

  const relationLabelPattern = new RegExp(
    `(<g class="edgeLabel" transform="translate\\()(${NUMBER_PATTERN})(,\\s*)(${NUMBER_PATTERN})(\\)")`,
    "g",
  );

  return svg
    .replace(
      /<g class="basic label-container outer-path">\s*<path\b(?=[^>]*\bd="([^"]+)")[^>]*\/>\s*<path\b[^>]*\/>\s*<\/g>/g,
      (frame, pathData) => {
        const bounds = classFrameBounds(pathData);
        if (!bounds) return frame;
        return `<rect class="class-frame" x="${formatNumber(bounds.x)}" y="${formatNumber(bounds.y)}" width="${formatNumber(bounds.width)}" height="${formatNumber(bounds.height)}" rx="${formatNumber(nodeRadius)}" ry="${formatNumber(nodeRadius)}"/>`;
      },
    )
    .replace(
      /(<g class="divider"[^>]*>\s*<path\b[^>]*\bd=")([^"]+)("[^>]*\/>\s*<\/g>)/g,
      (divider, open, pathData, close) => {
        const straightPath = straightClassDividerPath(pathData);
        return straightPath ? `${open}${straightPath}${close}` : divider;
      },
    )
    .replace(/<marker\b[^>]*>/g, (marker) => {
      if (!/\bid="[^"]*_class-dependencyEnd"/.test(marker)) return marker;
      return marker.replace(/\brefX="[^"]*"/, 'refX="18"');
    })
    .replace(
      relationLabelPattern,
      (_match, open, x, separator, y, close) =>
        `${open}${formatNumber(Number(x) - CLASS_RELATION_LABEL_CLEARANCE)}${separator}${formatNumber(Number(y))}${close}`,
    );
}

function normalizeTimelineSvg(svg, nodeRadius) {
  if (!svg.includes('aria-roledescription="timeline"')) return svg;

  const taskPattern = new RegExp(
    `<g class="taskWrapper" transform="translate\\((${NUMBER_PATTERN}),\\s*(${NUMBER_PATTERN})\\)">`,
    "g",
  );
  const eventPattern = new RegExp(
    `<g class="eventWrapper" transform="translate\\((${NUMBER_PATTERN}),\\s*(${NUMBER_PATTERN})\\)">`,
    "g",
  );
  const pathPattern =
    /(<path\b[^>]*\bclass="[^"]*\bnode-bkg\b[^"]*"[^>]*\bd=")([^"]+)("[^>]*>)/g;
  const linePattern = /<g class="lineWrapper"><line [^>]*\/><\/g>/g;

  const tasks = [...svg.matchAll(taskPattern)];
  const events = [...svg.matchAll(eventPattern)];
  const paths = [...svg.matchAll(pathPattern)].map((match) => ({
    pathData: match[2],
    size: nodeSize(match[2]),
  }));
  const lines = [...svg.matchAll(linePattern)];
  const verticalLines = lines.filter((match) =>
    match[0].includes("stroke-dasharray"),
  );
  const mainLine = lines.find(
    (match) => !match[0].includes("stroke-dasharray"),
  );
  const firstSize = paths[0]?.size;

  if (
    tasks.length === 0 ||
    tasks.length !== events.length ||
    tasks.length !== verticalLines.length ||
    paths.some(({ size }) => size === null) ||
    !mainLine ||
    !firstSize
  ) {
    return svg;
  }

  const mainX1 = Number(attributeValue(mainLine[0], "x1"));
  const mainX2 = Number(attributeValue(mainLine[0], "x2"));
  const mainY = Number(attributeValue(mainLine[0], "y1"));
  if (![mainX1, mainX2, mainY].every(Number.isFinite)) return svg;

  const shiftedMainY = mainY + TIMELINE_TITLE_CLEARANCE;
  const descriptionY = shiftedMainY + TIMELINE_DESCRIPTION_OFFSET;
  const firstLeft = mainX1;
  const lastLeft = mainX2 - firstSize.width;
  const stageStep =
    tasks.length === 1 ? 0 : (lastLeft - firstLeft) / (tasks.length - 1);
  const stageLefts = tasks.map((_, index) => firstLeft + stageStep * index);

  let taskIndex = 0;
  let normalized = svg.replace(taskPattern, (_match, _x, y) => {
    const left = stageLefts[taskIndex];
    taskIndex += 1;
    return `<g class="taskWrapper" transform="translate(${formatNumber(left)}, ${formatNumber(Number(y) + TIMELINE_TITLE_CLEARANCE)})">`;
  });

  let eventIndex = 0;
  normalized = normalized.replace(eventPattern, () => {
    const left = stageLefts[eventIndex];
    eventIndex += 1;
    return `<g class="eventWrapper" transform="translate(${formatNumber(left)}, ${formatNumber(descriptionY)})">`;
  });

  for (const [index, match] of verticalLines.entries()) {
    const center = stageLefts[index] + firstSize.width / 2;
    let replacement = replaceAttribute(match[0], "x1", center);
    replacement = replaceAttribute(replacement, "x2", center);
    replacement = replaceAttribute(
      replacement,
      "y1",
      Number(attributeValue(match[0], "y1")) + TIMELINE_TITLE_CLEARANCE,
    );
    replacement = replaceAttribute(replacement, "y2", descriptionY);
    replacement = replacement.replace(/\smarker-end="[^"]*"/, "");
    normalized = normalized.replace(match[0], replacement);
  }

  let shiftedMainLine = replaceAttribute(mainLine[0], "y1", shiftedMainY);
  shiftedMainLine = replaceAttribute(shiftedMainLine, "y2", shiftedMainY);
  normalized = normalized.replace(mainLine[0], shiftedMainLine);

  const titleX = (mainX1 + mainX2) / 2;
  normalized = normalized.replace(
    new RegExp(`<text x="${NUMBER_PATTERN}" font-size="4ex"`),
    `<text x="${formatNumber(titleX)}" text-anchor="middle" font-size="4ex"`,
  );

  normalized = normalized.replace(
    pathPattern,
    (_match, before, pathData, after) => {
      const size = nodeSize(pathData);
      if (!size) return _match;
      return `${before}${roundedRectanglePath(size.width, size.height, nodeRadius)}${after}`;
    },
  );

  const viewBoxMatch = normalized.match(
    new RegExp(
      `viewBox="(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})"`,
    ),
  );
  if (viewBoxMatch) {
    const [, x, y, width] = viewBoxMatch.map(Number);
    const eventHeights = paths
      .filter((_, index) => index % 2 === 1)
      .map(({ size }) => size?.height ?? 0);
    const outerMargin = Math.max(0, mainX1 - x);
    const contentBottom = descriptionY + Math.max(...eventHeights);
    const height = contentBottom + outerMargin - y;
    normalized = normalized.replace(
      viewBoxMatch[0],
      `viewBox="${formatNumber(x)} ${formatNumber(y)} ${formatNumber(width)} ${formatNumber(height)}"`,
    );
  }

  return normalized;
}

function normalizeEventModelingSvg(svg, { title, accentColor }) {
  if (!svg.includes('aria-roledescription="eventmodeling"')) return svg;

  let normalized = svg.replace(
    /<marker\b[^>]*\bid="em-arrowhead-[^"]+"[^>]*>/g,
    (marker) =>
      marker.includes("markerUnits=")
        ? marker
        : marker.replace(
            /\bid="em-arrowhead-[^"]+"/,
            '$& markerUnits="userSpaceOnUse"',
          ),
  );

  const swimlanes = [
    ...normalized.matchAll(/<g class="em-swimlane"><rect\b[^>]*\/?>/g),
  ]
    .map(([markup]) => ({
      x: Number(attributeValue(markup, "x")),
      y: Number(attributeValue(markup, "y")),
      width: Number(attributeValue(markup, "width")),
      height: Number(attributeValue(markup, "height")),
    }))
    .filter(({ x, y, width, height }) =>
      [x, y, width, height].every(Number.isFinite),
    );

  if (swimlanes.length > 1) {
    const dividers = swimlanes.slice(0, -1).map((lane, index) => {
      const nextLane = swimlanes[index + 1];
      const y = (lane.y + lane.height + nextLane.y) / 2;
      return `<line class="em-lane-divider" x1="${formatNumber(lane.x)}" y1="${formatNumber(y)}" x2="${formatNumber(lane.x + lane.width)}" y2="${formatNumber(y)}"/>`;
    });
    normalized = normalized.replace(
      '<g class="em-box">',
      `<g class="em-lane-dividers">${dividers.join("")}</g><g class="em-box">`,
    );
  }

  if (swimlanes.length > 0 && typeof title === "string" && title.trim()) {
    const firstLane = swimlanes[0];
    const titleX = firstLane.x + firstLane.width / 2;
    const titleY = firstLane.y - EVENT_MODELING_TITLE_BASELINE_OFFSET;
    normalized = insertTitleAboveSvg(normalized, {
      className: "em-title",
      title,
      titleX,
      titleY,
      titleHeight: EVENT_MODELING_TITLE_HEIGHT,
      titleMargin: EVENT_MODELING_TITLE_MARGIN,
    });
  }

  if (typeof accentColor === "string" && accentColor) {
    normalized = normalized.replace(
      /<g class="em-box">(<rect\b[^>]*\/>)/g,
      (match, rect) =>
        rect.match(/\bfill="([^"]+)"/)?.[1].toLowerCase() ===
        accentColor.toLowerCase()
          ? `<g class="em-box em-featured">${rect}`
          : match,
    );
  }

  return normalized;
}

function normalizeCynefinSvg(svg) {
  if (!svg.includes('aria-roledescription="cynefin"')) return svg;

  const firstDomain = svg.match(/<rect class="cynefinDomain"[^>]*>/)?.[0];
  const boundaries = svg.match(
    /<g class="cynefin-boundaries">[\s\S]*?<\/g>/,
  )?.[0];
  const cliff = boundaries?.match(/<path class="cynefinCliff"[^>]*\/>/)?.[0];
  if (!firstDomain || !boundaries || !cliff) return svg;

  const x = Number(attributeValue(firstDomain, "x"));
  const y = Number(attributeValue(firstDomain, "y"));
  const width = Number(attributeValue(firstDomain, "width"));
  const height = Number(attributeValue(firstDomain, "height"));
  if (![x, y, width, height].every(Number.isFinite)) return svg;

  const centerX = x + width;
  const centerY = y + height;
  const right = x + width * 2;
  const replacement = [
    '<g class="cynefin-boundaries">',
    `<line class="cynefinBoundary cynefinBoundaryUpper" x1="${formatNumber(centerX)}" y1="${formatNumber(y)}" x2="${formatNumber(centerX)}" y2="${formatNumber(centerY)}"/>`,
    `<line class="cynefinBoundary cynefinBoundaryHorizontal" x1="${formatNumber(x)}" y1="${formatNumber(centerY)}" x2="${formatNumber(right)}" y2="${formatNumber(centerY)}"/>`,
    cliff,
    "</g>",
  ].join("");

  return svg.replace(boundaries, replacement);
}

function normalizeIshikawaSvg(svg, { title }) {
  if (!svg.includes('aria-roledescription="ishikawa"')) return svg;

  let normalized = svg.replace(
    /<marker\b[^>]*\bid="ishikawa-arrow-[^"]+"[^>]*>/g,
    (marker) =>
      marker.includes("markerUnits=")
        ? marker
        : marker.replace(
            /\bid="ishikawa-arrow-[^"]+"/,
            '$& markerUnits="userSpaceOnUse"',
          ),
  );
  if (!normalized.includes('data-flexim-x-scale="')) {
    const spine = normalized.match(/<line class="ishikawa-spine"[^>]*>/)?.[0];
    const spineY = Number(spine && attributeValue(spine, "y1"));
    if (!Number.isFinite(spineY)) return normalized;

    normalized = normalized.replace(
      '<g class="ishikawa">',
      `<g class="ishikawa" data-flexim-x-scale="${formatNumber(ISHIKAWA_HORIZONTAL_SCALE)}" data-flexim-y-scale="${formatNumber(ISHIKAWA_VERTICAL_SCALE)}">`,
    );
    normalized = normalized.replace(
      /<line class="ishikawa-(?:spine|branch|sub-branch)"[^>]*>/g,
      (line) => {
        let scaled = scaleAttributeOccurrences(
          line,
          "x1",
          ISHIKAWA_HORIZONTAL_SCALE,
        );
        scaled = scaleAttributeOccurrences(
          scaled,
          "x2",
          ISHIKAWA_HORIZONTAL_SCALE,
        );
        scaled = scaleAttributeOccurrencesAround(
          scaled,
          "y1",
          spineY,
          ISHIKAWA_VERTICAL_SCALE,
        );
        scaled = scaleAttributeOccurrencesAround(
          scaled,
          "y2",
          spineY,
          ISHIKAWA_VERTICAL_SCALE,
        );
        return scaled;
      },
    );
    normalized = normalized.replace(
      /<text class="ishikawa-label[^"]*"[^>]*>[\s\S]*?<\/text>/g,
      (text) => {
        let scaled = scaleAttributeOccurrences(
          text,
          "x",
          ISHIKAWA_HORIZONTAL_SCALE,
        );
        scaled = scaleAttributeOccurrencesAround(
          scaled,
          "y",
          spineY,
          ISHIKAWA_VERTICAL_SCALE,
        );
        return scaled;
      },
    );
    normalized = normalized.replace(
      /<rect class="ishikawa-label-box"[^>]*>/g,
      (rect) => {
        const x = Number(attributeValue(rect, "x"));
        const y = Number(attributeValue(rect, "y"));
        const width = Number(attributeValue(rect, "width"));
        const height = Number(attributeValue(rect, "height"));
        if (![x, y, width, height].every(Number.isFinite)) return rect;
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        let scaled = replaceAttribute(
          rect,
          "x",
          centerX * ISHIKAWA_HORIZONTAL_SCALE - width / 2,
        );
        scaled = replaceAttribute(
          scaled,
          "y",
          spineY + (centerY - spineY) * ISHIKAWA_VERTICAL_SCALE - height / 2,
        );
        return scaled;
      },
    );

    const geometryViewBox = normalized.match(
      new RegExp(
        `viewBox="(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})"`,
      ),
    );
    if (geometryViewBox) {
      const [, x, y, width, height] = geometryViewBox.map(Number);
      const right = x + width;
      const bottom = y + height;
      const nextX = x * ISHIKAWA_HORIZONTAL_SCALE;
      const nextWidth = right - nextX;
      const nextY = spineY + (y - spineY) * ISHIKAWA_VERTICAL_SCALE;
      const nextBottom = spineY + (bottom - spineY) * ISHIKAWA_VERTICAL_SCALE;
      normalized = normalized.replace(
        geometryViewBox[0],
        `viewBox="${formatNumber(nextX)} ${formatNumber(nextY)} ${formatNumber(nextWidth)} ${formatNumber(nextBottom - nextY)}"`,
      );
      normalized = normalized.replace(
        new RegExp(`max-width:\\s*${NUMBER_PATTERN}px`),
        `max-width: ${formatNumber(nextWidth)}px`,
      );
    }
  }
  const viewBoxMatch = normalized.match(
    new RegExp(
      `viewBox="(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})\\s+(${NUMBER_PATTERN})"`,
    ),
  );
  if (!viewBoxMatch) return normalized;

  const [, x, y, width] = viewBoxMatch.map(Number);
  normalized = insertTitleAboveSvg(normalized, {
    className: "ishikawa-title",
    title,
    titleX: x + width / 2,
    titleY: y - ISHIKAWA_TITLE_BASELINE_OFFSET,
    titleHeight: ISHIKAWA_TITLE_HEIGHT,
    titleMargin: ISHIKAWA_TITLE_MARGIN,
  });
  return normalized;
}

export function normalizeSvgMarkup(
  svg,
  { syntax, nodeRadius, title, accentColor },
) {
  if (syntax === "classDiagram")
    return normalizeClassDiagramSvg(svg, nodeRadius);
  if (syntax === "cynefin-beta") return normalizeCynefinSvg(svg);
  if (syntax === "ishikawa-beta") return normalizeIshikawaSvg(svg, { title });
  if (syntax === "eventmodeling")
    return normalizeEventModelingSvg(svg, { title, accentColor });
  if (syntax !== "timeline") return svg;
  if (!Number.isFinite(nodeRadius) || nodeRadius <= 0) {
    throw new Error("Timeline normalization requires a positive node radius.");
  }
  return normalizeTimelineSvg(svg, nodeRadius);
}
