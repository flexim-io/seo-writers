import { fingerprintCanonicalJson } from "./hashing.mjs";

const ALLOWED_ROLES = new Set(["explain", "compare", "orient", "summarize", "hook"]);
const REQUIRED_MEDIA_FIELDS = [
  "id",
  "placement",
  "readerQuestion",
  "role",
  "format",
  "content",
  "sourceOfTruth",
  "authenticity",
  "required",
  "caption",
  "alt",
  "production",
  "status",
  "templateDecision",
  "acceptanceCriteria",
  "privacyConstraints",
];
const REQUIRED_PRODUCTION_STRING_FIELDS = ["objective", "composition", "caption", "alt"];
const REQUIRED_PRODUCTION_ARRAY_FIELDS = [
  "inImageCopy",
  "sourceOfTruth",
  "forbiddenContent",
  "responsiveConstraints",
  "acceptanceCriteria",
  "privacyConstraints",
];

function briefError(code, message) {
  const error = new Error(`${code}: ${message}`);
  error.code = code;
  throw error;
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function stringArray(value, { allowEmpty = false } = {}) {
  return (
    Array.isArray(value) &&
    (allowEmpty || value.length > 0) &&
    value.every(nonEmptyString)
  );
}

export function validateProductionContext(context, metadata) {
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    briefError("BRIEF_INCOMPLETE", "Production context must be a JSON object.");
  }
  const mediaMap = context.mediaMap;
  if (!mediaMap || typeof mediaMap !== "object" || Array.isArray(mediaMap)) {
    briefError("BRIEF_INCOMPLETE", "mediaMap is required.");
  }
  for (const field of REQUIRED_MEDIA_FIELDS) {
    if (!(field in mediaMap)) briefError("BRIEF_INCOMPLETE", `mediaMap.${field} is required.`);
  }
  if (mediaMap.id !== metadata.id) briefError("BRIEF_INCOMPLETE", "mediaMap.id must match visual metadata id.");
  if (!ALLOWED_ROLES.has(mediaMap.role)) {
    briefError("NOT_MERMAID_COMPATIBLE", `Role ${mediaMap.role} is not approved for Mermaid production.`);
  }
  if (mediaMap.format !== "diagram" || mediaMap.production !== "design") {
    briefError("NOT_MERMAID_COMPATIBLE", "The media item must use format diagram and production design.");
  }
  if (mediaMap.status !== "needs-production") {
    briefError("BRIEF_INCOMPLETE", "The media item must be in needs-production status.");
  }
  if (!["evidence", "illustration", "mockup", "demo"].includes(mediaMap.authenticity)) {
    briefError("BRIEF_INCOMPLETE", "mediaMap.authenticity is invalid.");
  }
  if (typeof mediaMap.required !== "boolean") {
    briefError("BRIEF_INCOMPLETE", "mediaMap.required must be a boolean.");
  }
  for (const field of ["placement", "readerQuestion", "content", "caption", "alt"]) {
    if (!nonEmptyString(mediaMap[field])) briefError("BRIEF_INCOMPLETE", `mediaMap.${field} must be non-empty.`);
  }
  if (mediaMap.caption !== metadata.caption || mediaMap.alt !== metadata.alt) {
    briefError("BRIEF_INCOMPLETE", "Caption and alt must match the approved media map exactly.");
  }
  for (const field of ["sourceOfTruth", "acceptanceCriteria"]) {
    if (!stringArray(mediaMap[field])) {
      briefError("BRIEF_INCOMPLETE", `mediaMap.${field} must be non-empty.`);
    }
  }
  if (!stringArray(mediaMap.privacyConstraints, { allowEmpty: true })) {
    briefError("BRIEF_INCOMPLETE", "mediaMap.privacyConstraints must be an array of strings.");
  }
  if (
    !mediaMap.templateDecision ||
    !nonEmptyString(mediaMap.templateDecision.selectedTemplate) ||
    !nonEmptyString(mediaMap.templateDecision.relationship) ||
    !nonEmptyString(mediaMap.templateDecision.reason)
  ) {
    briefError("BRIEF_INCOMPLETE", "A complete templateDecision is required.");
  }
  if (!context.productionBrief || typeof context.productionBrief !== "object") {
    briefError("BRIEF_INCOMPLETE", "productionBrief is required.");
  }
  for (const field of REQUIRED_PRODUCTION_STRING_FIELDS) {
    if (!nonEmptyString(context.productionBrief[field])) {
      briefError("BRIEF_INCOMPLETE", `productionBrief.${field} must be non-empty.`);
    }
  }
  for (const field of REQUIRED_PRODUCTION_ARRAY_FIELDS) {
    const allowEmpty = ["forbiddenContent", "privacyConstraints"].includes(field);
    if (!stringArray(context.productionBrief[field], { allowEmpty })) {
      briefError("BRIEF_INCOMPLETE", `productionBrief.${field} must be ${allowEmpty ? "an array of strings" : "a non-empty string array"}.`);
    }
  }
  if (
    !context.productionBrief.templateDecision ||
    typeof context.productionBrief.templateDecision !== "object" ||
    Array.isArray(context.productionBrief.templateDecision)
  ) {
    briefError("BRIEF_INCOMPLETE", "productionBrief.templateDecision is required.");
  }
  if (
    context.productionBrief.caption !== metadata.caption ||
    context.productionBrief.alt !== metadata.alt
  ) {
    briefError("BRIEF_INCOMPLETE", "Production-brief caption and alt must match visual metadata exactly.");
  }
  if (
    fingerprintCanonicalJson(context.productionBrief.sourceOfTruth) !==
      fingerprintCanonicalJson(mediaMap.sourceOfTruth) ||
    fingerprintCanonicalJson(context.productionBrief.acceptanceCriteria) !==
      fingerprintCanonicalJson(mediaMap.acceptanceCriteria) ||
    fingerprintCanonicalJson(context.productionBrief.privacyConstraints) !==
      fingerprintCanonicalJson(mediaMap.privacyConstraints) ||
    fingerprintCanonicalJson(context.productionBrief.templateDecision) !==
      fingerprintCanonicalJson(mediaMap.templateDecision)
  ) {
    briefError("BRIEF_INCOMPLETE", "Production brief must match the approved media-map controls exactly.");
  }
  if (
    context.privacyConstraints !== undefined &&
    fingerprintCanonicalJson(context.privacyConstraints) !==
      fingerprintCanonicalJson(mediaMap.privacyConstraints)
  ) {
    briefError("PRIVACY_RISK", "Top-level privacy constraints must match the approved media map.");
  }
  if (
    !context.lockedReader ||
    !nonEmptyString(context.lockedReader.snapshotId) ||
    !nonEmptyString(context.lockedReader.anchor)
  ) {
    briefError("BRIEF_INCOMPLETE", "lockedReader snapshotId and anchor are required.");
  }
  if (!Array.isArray(context.claimPermissions) || context.claimPermissions.length === 0) {
    briefError("EVIDENCE_CONFLICT", "claimPermissions must identify every visible claim boundary.");
  }
  for (const permission of context.claimPermissions) {
    if (!permission || !nonEmptyString(permission.id) || !["allowed", "qualified", "future"].includes(permission.status)) {
      briefError("EVIDENCE_CONFLICT", "Unknown, prohibited, or malformed claim permission is not renderable.");
    }
    if (permission.status !== "allowed" && !nonEmptyString(permission.qualification)) {
      briefError("EVIDENCE_CONFLICT", `Claim ${permission.id} requires an explicit qualification.`);
    }
  }
  if (context.privacyReview?.status !== "passed") {
    briefError("PRIVACY_RISK", "privacyReview.status must be passed before rendering.");
  }

  const components = {
    mediaMap,
    productionBrief: context.productionBrief,
    lockedReader: context.lockedReader,
    claimPermissions: context.claimPermissions,
    privacyReview: context.privacyReview,
    privacyConstraints: context.privacyConstraints ?? mediaMap.privacyConstraints,
    caption: mediaMap.caption,
    alt: mediaMap.alt,
    canvas: metadata.canvas,
    acceptanceCriteria: mediaMap.acceptanceCriteria,
  };
  const componentHashes = Object.fromEntries(
    Object.entries(components).map(([key, value]) => [key, fingerprintCanonicalJson(value)]),
  );
  return {
    mediaMap,
    components,
    componentHashes,
    briefFingerprint: fingerprintCanonicalJson(components),
  };
}
