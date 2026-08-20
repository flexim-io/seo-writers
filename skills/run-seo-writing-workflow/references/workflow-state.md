# Workflow state contract

This reference defines durable coordination state for `run-seo-writing-workflow`. It records progress, provenance, delegation, and revision decisions. It never replaces the Article Brief, reader Markdown, source bundle, specialist report, or CMS read-back.

## Contents

1. [Core rules](#core-rules)
2. [State shape](#state-shape)
3. [Stages and workers](#stages-and-workers)
4. [Artifacts and fingerprints](#artifacts-and-fingerprints)
5. [Transitions](#transitions)
6. [Change impact and selective reruns](#change-impact-and-selective-reruns)
7. [Resume validation](#resume-validation)
8. [Persistence and privacy](#persistence-and-privacy)

## Core rules

- Write new state as `workflowVersion: "1.1"`. Accept a complete `1.0` state, initialize missing fields, append a migration record, and persist `1.1` only after validation.
- Keep one state per article workflow and immutable versions of accepted artifacts. `currentArtifactIds` points only to active versions.
- Treat stage readiness as a derived claim backed by a specialist output, controlling input, and snapshot or coverage fingerprint.
- Keep decisions, author-profile references, source references, authorization, audit reports, and worker identifiers outside reader Markdown.
- The coordinator owns intake, Article Brief coordination and approval, state, dispatch, result validation, impact analysis, and routing. A specialist owns its own output.
- Before the first complete pass, do not carry a mandatory gate forward. After that baseline, reuse a gate only when its controlling coverage fingerprint is proven unchanged by a recorded `changeImpactManifest`.
- When classification, provenance, or a controlling fingerprint is uncertain, invalidate conservatively. Never call a broad rerun mandatory merely because it is simpler.
- Update state after each accepted stage result, explicit decision, migration, impact decision, invalidation, carry-forward decision, or mutation attempt. Append superseding decisions; do not rewrite history.

## State shape

Use JSON when persisting and equivalent YAML or JSON when returning inline.

```yaml
workflowVersion: "1.1"
workflowId: "seo-article-..."
createdAt: "ISO-8601"
updatedAt: "ISO-8601"
mode: run | resume | automatic
requestedTarget: portfolio_decision | article_brief | draft | edited | text_lock | media_plan | final_package | cms_draft
status: in_progress | waiting | blocked | ready
article:
  topic: "..."
  title:
    value: null
    provenance: user | approved_brief | coordinator_candidate | absent
    titleAuthority: fixed | candidate | missing
  language: "..."
  destination: flexim | other_cms | file | undecided
  narrativePerspective: FIRST_PERSON | NEUTRAL | ORGANIZATIONAL | THIRD_PERSON | undecided
currentStage: intake
lastReadyStage: null
briefVersion: null
readerSnapshot: null
meaningLockSnapshot: null
finalSnapshot: null
currentArtifactIds: {}
stages: {}
artifacts: {}
decisions: []
stateMigrations: []
changeImpactManifests: []
delegation:
  supported: null
  mechanism: subagent | task | isolated_session | external_dispatch | same_context_disclosed | unavailable | null
  workers: []
authorization:
  draftMutationAuthorized: false
  draftMutationInstructionRef: null
  publicationAuthorized: false
isolation:
  independentReportsValid: false
  auditSnapshot: null
  reportArtifactIds: []
  coldReaderValid: false
  coldReaderSurfaceSnapshot: null
warnings: []
blockers: []
nextAction:
  owner: coordinator
  skill: null
  instruction: "Run intake."
```

`titleAuthority` governs title changes. An explicit user title and an approved Brief title are `fixed`; an unapproved working title is `candidate`; no title is `missing`. Query selection, portfolio decision, title value, and title promise remain separate decisions.

`publicationAuthorized` remains false in this workflow. Publication is outside the skill even if a broader host has other permission.

## Stages and workers

Create one stage record for every canonical stage:

```yaml
stageId: audit_useful_action
status: pending | active | waiting | blocked | ready | invalidated | carried_forward | skipped
owner: coordinator | human | specialist | isolated_auditor | cold_reader | media_producer
skill: audit-useful-action
mode: audit
inputArtifactIds: []
outputArtifactIds: []
snapshot: null
coverageFingerprint: null
workerRef: null
cleanContext: null
readinessChecked: false
reusedFrom:
  stageId: null
  artifactId: null
  changeImpactManifestId: null
skipReason: null
warnings: []
blockers: []
nextStageReported: null
```

Canonical stage IDs and owners:

| Stage ID | Owner |
| --- | --- |
| `intake` | coordinator |
| `corpus_prebrief` | `audit-content-library` specialist |
| `article_brief` | coordinator and human approver |
| `author_voice` | `load-author-voice` specialist or explicit skip |
| `author_preflight` | `draft-article` specialist in `structure` mode |
| `draft` | `draft-article` specialist |
| `edit` | `edit-article` specialist |
| `audit_useful_action` | isolated `audit-useful-action` |
| `audit_paragraph_structure` | isolated `audit-paragraph-structure` |
| `audit_tone_honesty` | isolated `audit-tone-honesty` |
| `audit_eeat` | isolated `audit-eeat` |
| `corpus_prechief` | isolated `audit-content-library` in `pre-chief-editor` mode |
| `chief_editor` | `chief-editor-review` specialist |
| `visual_plan` | `visual-storytelling` specialist in `plan` mode |
| `media_integration` | media producer plus `visual-storytelling` integration |
| `final_integration` | `final-integration-check` specialist |
| `cold_reader_review` | fresh isolated `cold-reader-review` |
| `cms_draft` | `cms-draft-handoff` specialist or explicit skip |

When the host supports subagents, tasks, or isolated sessions, dispatch every specialist-owned stage. Record a worker for each dispatch:

```yaml
workerRef:
  id: "host worker or session ID"
  mechanism: subagent | task | isolated_session | external_dispatch
  skill: "audit-eeat"
  inputArtifactIds: []
  outputArtifactIds: []
  cleanContext: true | false
```

If the host lacks worker dispatch, record `same_context_disclosed` only for non-independent specialist stages. Never run the five independent audits or `cold_reader_review` in the coordinator's context and call them independent. Return external dispatch packages instead.

## Artifacts and fingerprints

Use an append-only record for every accepted artifact version:

```yaml
artifactId: edited-reader-v2
type: reader_markdown
version: 2
path: "workspace-relative path or null"
externalRef: null
snapshot: "sha256, host snapshot ID, or explicit immutable version"
provenance:
  source: user | specialist | human_editor | flexim_read_only | cms_export | tool
  producedBy: edit
  producedAt: "ISO-8601"
  sourceRefs: []
containsPrivateData: false
validation:
  checked: true
  contract: "edit-article"
  result: ready
supersedes: edited-reader-v1
```

Record a gate's `coverageFingerprint` as the declared controlling inputs for that gate, not a generic whole-document hash. It must identify the exact fields or anchors considered, their artifact snapshots, the applied change classes, and the reason those inputs remain unchanged. A byte hash of the entire article alone cannot prove an unrelated concern is unchanged.

Examples:

- useful action: title, promise, opening, section roles, examples, product block, conclusion, and reader-action anchors;
- paragraph structure: changed paragraphs, lists, tables, and adjacent transitions;
- tone: speaker, narrative perspective, disclosures, confidence, CTA, and changed voice spans;
- E-E-A-T: claims, sources, author evidence, trust metadata, and changed claim spans;
- portfolio: owned job, scope, differentiation contract, internal links, and corpus snapshot;
- final integration: reader-visible text, media, captions, `alt`, visible trust surface, and payload;
- cold reader: final title, reader Markdown, visible author and publisher surface, media, captions, `alt`, and reader links.

Required terminal artifacts:

| Target | Required terminal artifact |
| --- | --- |
| `portfolio_decision` | ready `corpus_prebrief` portfolio decision only |
| `article_brief` | approved Article Brief and pre-brief report |
| `draft` | draft Markdown and `draft-article` handoff |
| `edited` | edited reader Markdown and `edit-article` handoff |
| `text_lock` | locked reader Markdown, decision log, and valid baseline or carried-forward audit coverage |
| `media_plan` | text lock plus media map and production briefs |
| `final_package` | ready final-integration package and ready cold-reader report for the same reader-visible final surface |
| `cms_draft` | verified Flexim draft read-back after the same ready final-integration and cold-reader results |

## Transitions

Apply transitions in order:

1. Mark the stage `active`, record exact input artifact IDs, and create a worker dispatch when required.
2. Run the owner under its own contract.
3. Register output artifacts without overwriting prior versions.
4. Verify status, readiness fields, blockers, warnings, artifact identity, coverage fingerprint, clean-context provenance when required, and expected handoff before accepting a result.
5. Mark `ready` only when the owning contract passes. Mark `carried_forward` only under the selective-rerun rules below.
6. On a required human decision or external input, use `waiting` in `run` or `resume`, and `blocked` in `automatic`. Include one smallest `nextAction` or external dispatch package.
7. On critical conflict, mark `blocked` and preserve the smallest safe resolution.
8. Choose the next incomplete or invalid stage from the canonical order. `portfolio_decision` ends immediately after `corpus_prebrief` is ready.
9. Mark the workflow ready only when the requested target's terminal artifact exists and every required upstream stage is ready or provably `carried_forward`.

Never translate a child `blocked` result to `ready`. A warning may remain non-blocking only when that child's contract permits it.

## Change impact and selective reruns

When an accepted artifact or explicit user correction changes, first create a `changeImpactManifest` before invalidating any stage:

```yaml
id: impact-003
baseArtifactIds: []
changedArtifactIds: []
changedAnchorsOrFields: []
classes:
  - spelling_typography
semanticEffect: none | local | broad | unknown
readerVisibleSurfaceChanged: true | false
confidence: high | medium | low
affectedConcerns: []
affectedStages: []
carriedForwardStages: []
escalationReason: null
rationale: "why each stage changes or remains valid"
```

Classify at least: `production_state_only`, `spelling_typography`, `reader_wording`, `paragraph_structure`, `title_or_useful_action`, `tone_voice_authorship`, `claim_evidence_product_state`, `brief_scope_or_intent`, `media_caption_alt_link`, `visible_trust_metadata`, and `cms_payload_only`.

Use this minimum dependency matrix. Add a related gate whenever the exact change affects its declared controls.

| Change class | Minimum affected stages |
| --- | --- |
| `production_state_only` | no editorial stage; update state only |
| `spelling_typography` with no semantic or structural effect | final integration and cold reader only when the reader-visible surface changed |
| `reader_wording` | tone when voice changes; useful action, paragraph, or E-E-A-T only when their controls changed; then final integration and cold reader for a visible final change |
| `paragraph_structure` | paragraph audit, then final integration and cold reader; add useful action or tone only when section role or voice changes |
| `title_or_useful_action` | useful-action audit, tone when framing changes, then lock, final integration, and cold reader; add portfolio audit when scope changes |
| `tone_voice_authorship` | tone audit; add E-E-A-T only for experiential or provenance-bearing spans; then downstream visible checks |
| `claim_evidence_product_state` | E-E-A-T and every gate whose exact affected section, promise, or portfolio role changes; then lock and downstream checks |
| `brief_scope_or_intent` | all dependent editorial stages after a new approved Brief, unless the manifest proves a listed stage's controls unchanged |
| `media_caption_alt_link` | visual integration when needed, final integration, and cold reader when visible; add chief editor for semantic or claim drift |
| `visible_trust_metadata` | E-E-A-T when trust condition changes, final integration, and cold reader when visible |
| `cms_payload_only` | final integration or CMS preflight only; never rerun reader gates for an invisible field |

Carry a stage forward only when all are true:

1. the first complete required pass already exists;
2. its prior result is `ready` with valid provenance;
3. the manifest proves the stage's coverageFingerprint unchanged;
4. no stricter owning-skill freshness rule applies;
5. the state records `reusedFrom`, manifest ID, and human-readable rationale.

For independent audits, a carried-forward report remains historical evidence for an unchanged concern; it is not relabeled as a fresh audit of a new whole-document snapshot. If its concern changes, dispatch a new clean isolated audit with the complete current package and no earlier auditor report.

Any reader-visible final-surface change requires a new final-integration check and a fresh isolated cold-reader review. A production-only or invisible CMS-payload change does not invalidate the cold-reader result.

## Resume validation

On every `resume`:

1. Parse state, accept only supported `1.0` or `1.1`, and record any `1.0` to `1.1` migration.
2. Resolve every current required artifact and recompute its hash or compare immutable snapshot IDs where available.
3. Verify approved Brief version, title authority, narrative perspective, reader snapshot, meaning lock, final snapshot, and authorization relationships.
4. Confirm every fresh independent report names one reader snapshot and has distinct clean-context provenance.
5. Confirm every `carried_forward` stage has a valid prior artifact, coverageFingerprint, changeImpactManifest, and rationale.
6. Recheck time-sensitive corpus, product, author-profile, asset, or CMS snapshots when the owning skill requires freshness.
7. Apply change impact before choosing a stage. Never expand to a full rerun only because the state was resumed.
8. Reconfirm explicit draft authorization immediately before any CMS mutation.

If state cannot prove required isolation, set the affected result invalid. Do not infer isolation from filenames, wording, or separate timestamps.

## Persistence and privacy

- Preferred path: `.seo-writers/sessions/<workflowId>/workflow-state.json` in the private article workspace.
- Never write workflow state into the installed plugin or marketplace cache.
- Use workspace-relative artifact paths when possible so the private session can move with its content repository.
- Do not commit private session state, corpus exports, author profiles, source bundles, unpublished drafts, cold-reader packages, audit reports, or CMS payloads to this public repository.
- Store authorization with an instruction reference and timestamp, not a paraphrase that expands permission.
- Use an atomic file replacement when the host can do so safely.
- If persistence fails, return the complete updated state inline and record a warning; do not lose a completed mutation record.
