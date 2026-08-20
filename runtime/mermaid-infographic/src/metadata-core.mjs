export const CANVAS_PROFILES = Object.freeze(["desktop", "article", "mobile"]);
export const OUTPUT_FORMATS = Object.freeze(["svg", "png"]);
export const PRODUCTION_PRESETS = Object.freeze(["flexim-base", "flexim-flow"]);

const REQUIRED_FIELDS = Object.freeze([
  "id",
  "syntax",
  "preset",
  "canvas",
  "outputs",
  "title",
  "alt",
  "caption",
  "experimental",
]);

const LITERAL_REFERENCE_PATTERN = /^[^\s]+\.(?:ya?ml|json|md)#[^\s]+$/i;

function metadataError(message, code = "BRIEF_INCOMPLETE") {
  const error = new Error(`${code}: ${message}`);
  error.code = code;
  throw error;
}

export function validateProductionMetadata(metadata) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    metadataError("Missing visual metadata object.");
  }

  const unknownFields = Object.keys(metadata).filter(
    (field) => !REQUIRED_FIELDS.includes(field),
  );
  if (unknownFields.length) {
    metadataError(`Unknown visual metadata field: ${unknownFields.join(", ")}`);
  }
  for (const field of REQUIRED_FIELDS) {
    if (!(field in metadata)) metadataError(`Missing metadata field: ${field}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.id)) {
    metadataError("Visual id must be a lowercase kebab-case identifier.");
  }
  if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(metadata.syntax)) {
    metadataError("Syntax must be a safe Mermaid syntax identifier.", "SYNTAX_INVALID");
  }
  if (!PRODUCTION_PRESETS.includes(metadata.preset)) {
    metadataError(`Unknown production preset: ${metadata.preset}`, "SYNTAX_NOT_APPROVED");
  }
  if (!CANVAS_PROFILES.includes(metadata.canvas)) {
    metadataError(`Unknown canvas profile: ${metadata.canvas}`);
  }
  if (
    !Array.isArray(metadata.outputs) ||
    metadata.outputs.length !== 2 ||
    metadata.outputs[0] !== "svg" ||
    metadata.outputs[1] !== "png"
  ) {
    metadataError("Outputs must contain exactly svg and png in that order.");
  }
  if (metadata.experimental !== false) {
    metadataError("Experimental Mermaid sources are not approved for production.", "SYNTAX_NOT_APPROVED");
  }
  for (const field of ["title", "alt", "caption"]) {
    if (typeof metadata[field] !== "string" || metadata[field].trim() === "") {
      metadataError(`Metadata field ${field} must be a non-empty string.`);
    }
  }
  for (const field of ["alt", "caption"]) {
    if (LITERAL_REFERENCE_PATTERN.test(metadata[field].trim())) {
      metadataError(`Metadata field ${field} must be a literal string, not a file reference.`);
    }
  }
  return metadata;
}

export function validateApprovedPair(metadata, allowlist) {
  const pair = allowlist?.pairs?.find(
    (entry) =>
      entry.syntax === metadata.syntax &&
      entry.preset === metadata.preset &&
      entry.editorialStatus === "production-ready",
  );
  if (!pair) {
    const error = new Error(
      `SYNTAX_NOT_APPROVED: ${metadata.syntax} with ${metadata.preset} is not production-ready.`,
    );
    error.code = "SYNTAX_NOT_APPROVED";
    throw error;
  }
  return pair;
}
