import YAML from "yaml";

import {
  validateApprovedPair,
  validateProductionMetadata,
} from "./metadata-core.mjs";

export function detectSyntax(source) {
  const firstLine = source
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("%%"));
  if (!firstLine) return null;
  return firstLine.match(/^([A-Za-z][A-Za-z0-9-]*)\b/)?.[1] ?? null;
}

export function parseMermaidDocument(source, allowlist) {
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    const error = new Error("BRIEF_INCOMPLETE: Mermaid document requires YAML frontmatter.");
    error.code = "BRIEF_INCOMPLETE";
    throw error;
  }
  const closingIndex = normalized.indexOf("\n---\n", 4);
  if (closingIndex === -1) {
    const error = new Error("BRIEF_INCOMPLETE: Mermaid frontmatter is unclosed.");
    error.code = "BRIEF_INCOMPLETE";
    throw error;
  }
  let frontmatter;
  try {
    frontmatter = YAML.parse(normalized.slice(4, closingIndex));
  } catch (cause) {
    const error = new Error("SYNTAX_INVALID: Mermaid frontmatter is not valid YAML.", {
      cause,
    });
    error.code = "SYNTAX_INVALID";
    throw error;
  }
  const metadata = validateProductionMetadata(frontmatter?.visual);
  validateApprovedPair(metadata, allowlist);
  const mermaidSource = normalized.slice(closingIndex + 5).trimStart();
  if (!mermaidSource.trim()) {
    const error = new Error("SYNTAX_INVALID: Mermaid source is empty.");
    error.code = "SYNTAX_INVALID";
    throw error;
  }
  const detectedSyntax = detectSyntax(mermaidSource);
  if (detectedSyntax !== metadata.syntax) {
    const error = new Error(
      `SYNTAX_INVALID: Frontmatter declares ${metadata.syntax}, source starts with ${detectedSyntax ?? "unknown"}.`,
    );
    error.code = "SYNTAX_INVALID";
    throw error;
  }
  return { metadata, mermaidSource, frontmatter };
}

export function buildRenderableSource(metadata, mermaidSource) {
  const title = YAML.stringify({ title: metadata.title }).trimEnd();
  return `---\n${title}\n---\n${mermaidSource.trim()}\n`;
}
