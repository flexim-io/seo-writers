---
name: chief-editor-review
description: Resolve an article's independent editorial audits against its approved Article Brief, sources, author evidence, product state, and current reader Markdown. Use after edit-article and the five independent audits, or when author answers, user amendments, or final-reader findings reopen a locked decision. Accept, reject, or defer every material finding, apply only traceable edits, classify change impact, rerun only affected gates, decide explicitly on recommended author interviews, and lock meaning before visual work. Do not perform the independent audits, invent evidence, produce visuals, mutate CMS, or publish.
---

# Chief editor review

## Purpose

Make one accountable editorial decision across complementary or conflicting audit reports, apply only evidence-safe changes, and lock a version whose meaning can move to `visual-storytelling`.

The chief editor owns the decision, not the evidence. Independent auditors diagnose; the chief editor accepts, rejects, or defers findings and owns changes to shared reader Markdown.

## Responsibility

`chief-editor-review`:

- compares five independent reports with the Brief, sources, author evidence, and product state;
- records an explicit decision for every material finding;
- decides separately what to do with a `RECOMMENDED` author interview;
- changes shared reader Markdown only from allowed evidence;
- classifies edits through the workflow `changeImpactManifest` and assigns only affected reruns;
- locks meaning, structure, evidence, first-person permissions, and snapshot.

It does not rerun independent audits itself, rewrite unaffected copy for taste, invent facts or experience, silently change the Brief, plan or produce visuals, read or mutate CMS, or publish.

## Inputs and priority

Use:

1. approved Article Brief and explicit amendments;
2. current reader Markdown after `edit-article`;
3. source bundle, claim permissions, and product-state snapshot;
4. author-contribution preflight and supplied author evidence or answers;
5. independent reports from `audit-useful-action`, `audit-paragraph-structure`, `audit-tone-honesty`, `audit-eeat`, and `audit-content-library` in `pre-chief-editor` mode;
6. current `authorVoiceHandoff` when used;
7. previous chief-editor decision log and `changeImpactManifest` only for rerun or amendment;
8. mode: `review`, `amend`, or `automatic`.

Priority: explicit user correction, approved Brief, verified primary source or real artifact or author answer, product state and claim permissions, independent findings, author voice and editorial policy, current draft, model preference.

When a user correction changes promise, reader, scope, product role, or mandatory claim, record a Brief amendment first. Never use the decision log as a hidden contract replacement.

## Modes

- `review`: perform the first complete reconciliation, apply decisions, and assign reruns.
- `amend`: process a new user correction, author answer, source, or integration finding after lock; supersede affected decisions and rerun only affected gates.
- `automatic`: ask no questions; return `blocked` for any contract change or external evidence need; do not accept an optional `RECOMMENDED` interview without an explicit editorial decision in the package.

Default to `review`; use `amend` when a locked snapshot and new input exist.

## Process

### 1. Verify package integrity

Confirm that the first complete pass has five reports for one reader snapshot and Brief version. On amendment, accept an affected fresh report or a valid `carried_forward` report only when its concern-specific `coverageFingerprint`, source artifact, impact-manifest ID, and rationale prove its controls unchanged. Every fresh report needs coverage, exact anchors, action, status, and clean-context provenance; text auditors did not mutate shared copy or read forbidden inputs; the corpus snapshot is fresh enough; and every marker and blocker is listed.

Never mix reports from different article versions. Request the affected rerun before deciding when snapshots differ.

### 2. Build the finding ledger

Normalize every material finding:

| Field | Meaning |
| --- | --- |
| `id` | Stable chief-editor ID |
| `source` | Gate or explicit correction |
| `anchor` | Exact reader span or artifact |
| `diagnosis` | What fails |
| `risk` | Reader, evidence, trust, portfolio, or integration risk |
| `proposedAction` | Auditor's minimum action |
| `dependencies` | Source, author answer, Brief amendment, or rerun |

Merge duplicates while preserving all report sources. Auditor majority is not a decision rule.

### 3. Accept, reject, or defer

- `accept`: a higher-priority input confirms the finding and the action preserves the contract;
- `reject`: the finding is incorrect, outside the gate's role, or would violate a higher-priority requirement;
- `defer`: the finding is real but needs a future source, answer, asset, or separate scope and does not block the current safe version.

Every decision needs a reason and applied or next action. Never ignore a finding silently or edit without a ledger entry.

### 4. Decide author contribution separately

Compare `audit-eeat.authorContribution.decision` with the early preflight.

- `REQUIRED`: do not fabricate a patch; route to `author_interview`, or accept a documented `REPHRASE` or `CUT` only when it preserves the Brief.
- `RECOMMENDED`: explicitly choose `interview_now`, `keep_current_text`, or `defer` and explain the reader-value trade-off. Do not describe evidence-safe generic copy as demonstrated author contribution.
- `NOT_NEEDED`: confirm sufficiency or irrelevance without decorative biography.

Reject interview questions that depend on model-invented frames and return them to `audit-eeat` for reality-first reformulation.

### 5. Resolve report conflicts

Use substance, not vote count:

- evidence and honest qualification outrank smoothness;
- useful action outranks decorative completeness;
- the Article Brief outranks model preference;
- a real author answer outranks invented editorial taxonomy;
- portfolio role outranks repetition of a neighboring guide;
- first person never replaces provenance, but permitted authorial framing, navigation, and source-grounded judgment do not need to be neutralized merely because they are first person;
- production traceability stays outside reader Markdown.

When findings require mutually exclusive edits, choose by input priority and record the rejected trade-off.

### 6. Apply accepted changes

- Use exact anchors and the smallest sufficient scope.
- Link every factual or experiential insertion to a source or answer.
- Keep audit IDs and ledger data outside reader Markdown.
- Preserve primary key phrase placement or assign keyword regression.
- When an author answer changes a central framework, update the Brief or source handoff before reader copy.
- Never apply a change when its source is unavailable or its qualification would be lost.

### 7. Assign and verify reruns

Route changes:

- promise, opening, section role, or conclusion → `audit-useful-action`;
- paragraph, list, or table composition → `audit-paragraph-structure`;
- voice, disclosure, confidence, approved narrative perspective, or product motive → `audit-tone-honesty`;
- claims, experiential first person, author evidence, or trust surface → `audit-eeat`;
- owned job, scope, or internal links → `audit-content-library` `pre-chief-editor`;
- key phrase placement → `draft-article` or `edit-article` QA;
- new or changed media → later visual and integration stages after lock.

Create or validate the `changeImpactManifest` before dispatching. Every affected gate must return `ready` for the current controls. Mark an unaffected gate `carried_forward` only with its unchanged coverage fingerprint, prior artifact, manifest ID, and recorded reason. If the edit's semantic effect or controlling inputs are unclear, escalate conservatively instead of carrying a gate forward.

### 8. Lock meaning

After reruns pass, record approved title and useful action; reader and scope; section order and required artifacts; allowed, qualified, and prohibited claims; author contribution, narrative perspective, and first-person permissions; product role and disclosure; reader-facing key phrase and placements; internal-link destinations; reader snapshot or hash; deferred findings and owners; and visual constraints that require returning to chief-editor review if changed.

The lock allows typo and integration fixes. Any change to meaning, claim, structure, or reader promise reopens affected gates.

## Readiness gates

Return `ready` only when the initial five reports are complete and every later audit concern has either a fresh matching report or valid carried-forward coverage; every material finding has a reasoned decision; accepted changes are traceable; author contribution decision is explicit; amendments precede contract changes; every affected gate reran and passed; no critical evidence, trust, portfolio, or marker blocker remains; meaning and snapshot are locked; and no CMS mutation or publication occurred.

Until reruns complete, return `blocked` or `in_review`; never call the text locked.

## Output

```yaml
status: ready | blocked | in_review
mode: review | amend | automatic
package:
  briefVersion: "..."
  readerSnapshot: "..."
  reportsPresent: []
findingLedger:
  - id: CE001
    source: audit-eeat
    anchor: "..."
    diagnosis: "..."
    decision: accept | reject | defer
    reason: "..."
    action: "..."
authorContribution:
  auditDecision: REQUIRED | RECOMMENDED | NOT_NEEDED
  editorialDecision: interview_now | keep_current_text | defer | not_needed
  rationale: "..."
appliedEdits: []
briefAmendments: []
reruns:
  required: []
  completed: []
  carriedForward: []
  invalidated: []
lockedMeaning:
  title: "..."
  usefulAction: "..."
  reader: "..."
  scope: "..."
  productRole: "..."
  authorContribution: "..."
  narrativePerspective: FIRST_PERSON | NEUTRAL | ORGANIZATIONAL | THIRD_PERSON
  keyPhrase: "..."
  snapshot: "..."
deferredFindings: []
warnings: []
blockers: []
nextStage: visual_storytelling | author_interview | research | edit_article | blocked
```

Return reader Markdown and a human-readable decision log beside the package, never inside it.

## Do not

- Average auditor opinions by vote.
- Accept a `RECOMMENDED` interview silently.
- Treat voice as author evidence or confidence as an evidence fix.
- Amend the Brief after the fact to legalize existing copy.
- Skip an affected gate rerun.
- Start visual production before meaning lock.
- Create a CMS draft or publish.
