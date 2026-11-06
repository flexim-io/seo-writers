export const ALLOWED_HTML_TAGS = Object.freeze([
  "div",
  "span",
  "strong",
  "small",
  "b",
  "br",
]);

export const ALLOWED_CLASSES = Object.freeze([
  "card",
  "step",
  "contract",
  "decision",
  "outcome",
  "comparison",
  "metric",
  "callout",
  "quote",
  "featured",
  "muted",
  "warning",
  "success",
  "eyebrow",
  "title",
  "description",
  "meta",
  "badge",
  "value",
  "label",
  "align-left",
  "align-right",
  "align-center",
]);

const tagPattern = /<\/?([A-Za-z][\w:-]*)([^>]*)>/g;
const attributePattern =
  /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const uriSchemePattern = /(?:^|[\s"'[(])(?:https?|javascript|data|file|ftp|wss?):/i;

function lineAnchor(source, index) {
  return `line ${source.slice(0, index).split("\n").length}`;
}

function addError(errors, source, index, message) {
  errors.push(`${lineAnchor(source, index)}: ${message}`);
}

export function escapeLabelValue(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function validateSourceSecurity(source) {
  const errors = [];
  const forbiddenPatterns = [
    [/^\s*(?:classDef|style|linkStyle)\b/gim, "Inline Mermaid CSS/style directives are forbidden."],
    [/^\s*click\s+/gim, "Mermaid click, callback, call, and link actions are forbidden."],
    [/%%\{\s*(?:init|initialize)\s*:/gim, "Mermaid init and initialize directives are forbidden."],
    [/^\s*(?:init|initialize)\b/gim, "Mermaid init and initialize directives are forbidden."],
    [/^\s*(?:import|include|resource)\b/gim, "Resource and import directives are forbidden."],
  ];
  for (const [pattern, message] of forbiddenPatterns) {
    for (const match of source.matchAll(pattern)) addError(errors, source, match.index, message);
  }
  for (const match of source.matchAll(new RegExp(uriSchemePattern.source, "gim"))) {
    addError(errors, source, match.index, "External and executable URI schemes are forbidden.");
  }
  for (const match of source.matchAll(/(?:^|[\s"'[(])\/\//gim)) {
    addError(errors, source, match.index, "Protocol-relative URLs are forbidden.");
  }

  for (const match of source.matchAll(tagPattern)) {
    const [fullTag, rawName, rawAttributes] = match;
    const tagName = rawName.toLowerCase();
    if (!ALLOWED_HTML_TAGS.includes(tagName)) {
      addError(errors, source, match.index, `Forbidden HTML tag: ${rawName}.`);
      continue;
    }
    if (fullTag.startsWith("</")) continue;

    const attributes = rawAttributes.replace(/\/\s*$/, "").trim();
    if (!attributes) continue;
    let consumed = "";
    for (const attribute of attributes.matchAll(attributePattern)) {
      consumed += attribute[0];
      const name = attribute[1].toLowerCase();
      const value = attribute[2] ?? attribute[3] ?? attribute[4] ?? "";
      if (name === "style") {
        addError(errors, source, match.index, "Inline styles are forbidden.");
      } else if (name.startsWith("on")) {
        addError(errors, source, match.index, `Event handler is forbidden: ${name}.`);
      } else if (name !== "class") {
        addError(errors, source, match.index, `Unknown attribute: ${name}.`);
      } else {
        for (const className of value.split(/\s+/).filter(Boolean)) {
          if (!ALLOWED_CLASSES.includes(className)) {
            addError(errors, source, match.index, `Unknown class: ${className}.`);
          }
        }
      }
    }
    if (attributes.replace(/\s+/g, "") !== consumed.replace(/\s+/g, "")) {
      addError(errors, source, match.index, `Unknown attribute syntax in <${tagName}>.`);
    }
  }

  for (const match of source.matchAll(/^\s*class\s+[^\s]+\s+([^\n;]+)/gim)) {
    if (match[1].trimStart().startsWith("{")) continue;
    for (const className of match[1].split(/[\s,]+/).filter(Boolean)) {
      if (!ALLOWED_CLASSES.includes(className)) {
        addError(errors, source, match.index, `Unknown class: ${className}.`);
      }
    }
  }
  for (const match of source.matchAll(/:::(\w[\w-]*)/g)) {
    if (!ALLOWED_CLASSES.includes(match[1])) {
      addError(errors, source, match.index, `Unknown class: ${match[1]}.`);
    }
  }

  return { ok: errors.length === 0, errors: [...new Set(errors)] };
}

export const validateHtmlLabels = validateSourceSecurity;
