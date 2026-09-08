# Audit coverage and concise reports

This is the shared reporting contract for the five independent editorial audits and their chief-editor consumer. It changes report representation, not the work each audit must do. Read it when preparing or accepting an audit. Do not load other audit reports or the coordinator's history with it.

## First dispatch

Use `reportDetail: findings` by default. Declare the contract at the first dispatch, together with exact reader and Brief input identities, allowed source/metadata/corpus versions, and the assigned skill. Do not provide an expected verdict. Standalone audits use the same default. `reportDetail: expanded` is available on request; a valid compact report does not require another audit to expand its presentation.

An independent report retains its native status, verdict, warnings, blockers, and `nextStage`, plus:

```yaml
reportDetail: findings
readerSnapshot: "exact input artifact identity"
workerRef:
  skill: audit-paragraph-structure
  mechanism: subagent
  isolation: isolated
  inputArtifactIds: []
coverageInventory:
  - id: P001
    anchor: "heading + unique verbatim excerpt or exact occurrence locator"
passedUnits: []
coverageFingerprint:
  concern: paragraph_structure
  controllingInputs: []
  coveredUnits: []
```

`coverageInventory` is an anchored index of every unit in the assigned scope, not a prose explanation of each success. Each inventoried ID appears exactly once in either `passedUnits` or the skill's native finding manifest. List found and checked counts by unit type, exclusions with reasons, and any missing or ambiguous units. A heading plus first words alone is insufficient when repeated: include a unique location. Never insert IDs into reader Markdown.

Passing units may be grouped by explicit IDs or contiguous ID ranges that resolve against the complete inventory, with one shared result and the gates checked. Findings keep exact anchor, diagnosis, minimal action, priority, and final status. Give a reason for every failed, changed, uncertain, or disputed unit. Empty finding arrays mean no findings only when coverage and independent provenance are complete; counts or a checksum alone prove neither.

Keep the native useful-action statement, tone contract, evidence/experience and interview decisions, and portfolio decision. Do not duplicate the Brief, article, source bundle, successful unit analysis, or the same finding across a narrative report and YAML. Native manifests may contain findings only when `passedUnits` accounts for the remaining inventory. In standalone rewrite modes, return the requested corrected copy; an independent audit never applies changes to shared copy.

Define each input identity once and reuse its short reference. `coverageFingerprint.controllingInputs` may use exact selectors into those immutable inputs instead of restating the selected content; `coveredUnits` may reference the complete inventory. An inventory locator and a finding's quote need not each repeat the full paragraph. Keep successful scan/QA results as one confirmation; explain only an exception or unresolved issue. Use compact tables or inline mappings where they retain the same traceability. Do not add a second contract summary, redundant empty fields, or expanded mode's optional analysis to a findings report. Native required verdict and QA fields remain available; report brevity must not conceal a false, missing, or unperformed check.

When returning structured output, keep the skill's native names, such as `paragraphManifest`, `structureManifest`, `toneManifest`, `claimManifest`, `evidenceFindings`, `overlapMap`, and `blockers`. Compact detail changes which successful explanations are printed; it does not authorize new aliases for existing fields.

## Evidence and corpus exceptions

For `audit-eeat`, retain a compact record for **every atomic claim**, including passes: exact span/locator, claim type, load-bearing flag, risk, status, support pointers, and provenance. Preserve duplicate links and every qualification or contradictory support. Optional false flags and empty action text may be omitted; omission of a flag means false, never an unperformed check. Successful evidence records do not need a second explanatory paragraph. Trust conditions can be grouped only with their supplied evidence pointers. Missing input is never a pass.

Here `claimManifest` itself is the claim inventory and pass accounting; do not repeat those records in `coverageInventory` and `passedUnits`. Likewise, the corpus inventory and anchored `overlapMap` supply native corpus coverage. Use the common envelope in all audit/automatic output forms, even where a skill's abbreviated YAML shows only its native fields. Keep `workerRef.isolation` truthful for standalone non-independent work; the coordinator accepts only independent reports for its five gates.

For `audit-content-library`, retain complete published/draft inventory evidence, snapshot freshness, every plausible neighbor's full-read identity, anchored comparison and link handoffs. The summary can group non-colliding records by a stated exclusion reason, but cannot omit plausible neighbors, hide overlap dimensions, or replace full reads with previews. No minimum number of neighbors exists when the complete corpus has fewer.

## File identity and concern identity

`readerSnapshot` checks artifact integrity. `coverageFingerprint` records what controls the particular judgment: the relevant content and relationships, input identities, and covered units. Do not use the whole reader-file hash as the only coverage fingerprint or mechanically hash layout-dependent paragraph IDs into every gate. Record selectors and values/references sufficient for a later comparison, using these concern boundaries:

| Concern | Controlling content and relationships |
| --- | --- |
| Useful action | Title promise, opening, section roles/order, examples, instructions, product job, conclusion/CTA, relevant Brief decisions and links. |
| Paragraph structure | Paragraph/list/table boundaries and order, wording, heading fit, scan sequence. |
| Tone honesty | Speaker, perspective, complete voice/profile identity when used, wording and confidence, stake/disclosure visibility, claim-qualification and reader relationships. |
| E-E-A-T | Atomic claims, exact support/source/answer versions, qualification associations, product state, author evidence, byline/disclosure and other relevant trust metadata. |
| Content-library role | Actual job, promise/scope, evidence role, product role, internal-link destinations and roles, differentiation contract, complete current corpus snapshot. |

These are dependency selectors, not permission to ignore the rest of the auditor's assigned scope. Initial audits still cover the whole current snapshot.

## Carrying a report forward

The coordinator or chief editor compares inputs; an unaffected auditor need not be called to repeat the comparison. Preserve the prior report unchanged and attach a carry-forward record to the aggregate `changeImpactManifest`:

```yaml
carriedForwardGates:
  - gate: audit-eeat
    priorReport: "immutable report reference"
    fromReaderSnapshot: "old identity"
    toReaderSnapshot: "new identity"
    coverageFingerprint: "unchanged concern identity"
    anchorMapping: []
    externalInputs: []
    rationale: "exact change and why this concern's controls are unchanged"
```

Verify unchanged relevant wording, order, meaning, qualification attachment, links, and external controls. When byte positions or paragraph IDs move, give an unambiguous old-to-new `anchorMapping`; one old paragraph may map to two new paragraphs while an unchanged claim maps to the same sentence. Do not rewrite the original inventory to pretend the old report audited the new file. Ambiguous mapping or uncertain semantic effect invalidates the affected gate.

Soft-line reflow that leaves rendered content and all semantic associations unchanged can retain all editorial gates. A blank-line split changes paragraph structure; it need not invalidate unchanged evidence, tone, or portfolio role. If the split separates an essential qualification, changes emphasis/confidence, or obscures an instruction, invalidate those affected concerns too. Formatting classification requires inspection, not whitespace stripping alone; code, tables, hard breaks, emphasis, or list nesting can change meaning.

For external controls, compare supplied source/answer versions, metadata, product state, and corpus freshness evidence. An unchanged reader hash cannot establish their freshness. If a controlling external input changed or its required freshness cannot be established, rerun the dependent gate or obtain that missing input through its authorized owner. Never ask a text auditor to query external services.

All five initial audits remain mandatory. Only after a complete first pass on an immutable audited input can this evidence support selective reruns, including changes made during the first chief-editor reconciliation. Follow the workflow's impact rules for final integration and the fresh cold-reader gate; compact editorial coverage does not replace either.
