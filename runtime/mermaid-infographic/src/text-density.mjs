const PROFILE_LIMITS = {
  desktop: { maxLabel: 220, maxNodes: 28 },
  article: { maxLabel: 150, maxNodes: 20 },
  mobile: { maxLabel: 80, maxNodes: 10 },
};

function visibleText(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&\w+;/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

export function analyzeTextDensity(source, { canvas }) {
  const profile = PROFILE_LIMITS[canvas] ?? PROFILE_LIMITS.article;
  const candidates = [];
  for (const match of source.matchAll(
    /(?:\[|\(|\{|\|)["']?([^\])}|\n]+)["']?(?:\]|\)|\}|\|)/g,
  )) {
    candidates.push(visibleText(match[1]));
  }
  const longest = candidates.reduce(
    (winner, candidate) =>
      candidate.length > winner.length ? candidate : winner,
    "",
  );
  const nodeCount = (
    source.match(/(?:^|\s)[A-Za-z][\w-]*\s*(?:\[|\(|\{)/gm) ?? []
  ).length;
  const errors = [];
  const warnings = [];
  let recommendedCanvas = canvas;
  if (longest.length > profile.maxLabel) {
    errors.push(
      `Long label has ${longest.length} characters; ${canvas} allows ${profile.maxLabel}.`,
    );
    recommendedCanvas = canvas === "mobile" ? "article" : "desktop";
  }
  if (nodeCount > profile.maxNodes) {
    errors.push(
      `Node count ${nodeCount} exceeds ${canvas} limit ${profile.maxNodes}.`,
    );
    recommendedCanvas = canvas === "mobile" ? "article" : "desktop";
  }
  if (longest.length > profile.maxLabel * 0.75 && errors.length === 0) {
    warnings.push("Label length is close to the profile limit.");
  }
  return {
    ok: errors.length === 0,
    errors,
    warnings,
    longestLabel: longest.length,
    nodeCount,
    recommendedCanvas,
  };
}
