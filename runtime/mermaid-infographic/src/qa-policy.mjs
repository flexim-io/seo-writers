export function evaluateTechnicalQa(qa) {
  const errors = Array.isArray(qa?.errors) ? qa.errors.filter(Boolean) : [];
  const warnings = Array.isArray(qa?.warnings) ? qa.warnings.filter(Boolean) : [];
  if (errors.length) {
    return { passed: false, renderStatus: "failed", blocker: "TECHNICAL_QA_FAILED" };
  }
  return {
    passed: true,
    renderStatus: warnings.length ? "rendered-with-warnings" : "rendered",
    blocker: null,
  };
}
