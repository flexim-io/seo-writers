import path from "node:path";

import { hashFile } from "./hashing.mjs";

export function blockedHandoff(code, anchor, message, nextAction, context = {}) {
  return {
    mermaidInfographicHandoff: {
      schemaVersion: 1,
      mode: context.mode ?? null,
      status: "blocked",
      visualId: context.visualId ?? null,
      required: context.required ?? null,
      input: context.input ?? null,
      renderer: context.renderer ?? null,
      renderStatus: context.renderStatus ?? "not-run",
      artifacts: null,
      editorial: context.editorial ?? null,
      checks: context.checks ?? {
        securityValidated: "not-run",
        syntaxValidated: "not-run",
        technicalQaPassed: "not-run",
        privacySafe: "not-run",
        evidenceBoundariesPreserved: "not-run",
      },
      humanReviewRequired: true,
      warnings: [],
      blockers: [{ code, anchor, message, nextAction }],
      nextStage: "none",
    },
  };
}

function workspaceRelative(workspaceRoot, artifactPath) {
  return path.relative(workspaceRoot, artifactPath).split(path.sep).join("/");
}

export async function artifactRecord(workspaceRoot, artifactPath, extra = {}) {
  return {
    path: workspaceRelative(workspaceRoot, artifactPath),
    sha256: await hashFile(artifactPath),
    ...extra,
  };
}
