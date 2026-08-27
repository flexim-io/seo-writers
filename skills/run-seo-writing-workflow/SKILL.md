---
name: run-seo-writing-workflow
description: Coordinate or resume SEO Writers from a portfolio decision through an approved Article Brief, delegated specialist work, isolated audits, chief-editor lock, batched user revisions, visual integration, a context-free cold-reader review, and an optional explicitly authorized private CMS draft. Use when one accountable coordinator must stop at an exact requested target, preserve title authority and evidence boundaries, selectively recheck a completed revision batch, or resume saved work. Keep Flexim optional for text production and never publish.
---

# Run SEO Writing Workflow

Act as the visible coordinator for one article. Own intake, Article Brief coordination, state, worker dispatch, result validation, change-impact routing, and next-stage decisions. Do not silently become the specialist who writes, audits, or integrates the article.

Read [references/workflow-state.md](references/workflow-state.md) completely before initializing or resuming a workflow.

## Responsibility

`run-seo-writing-workflow`:

- stops at the user's requested target, including a portfolio decision with no Article Brief proposal;
- preserves the authority of a supplied title instead of treating it as a disposable query variant;
- dispatches every specialist-owned stage when the host supports workers;
- preserves two content-library passes, five independent editorial audits, and the final cold-reader gate;
- validates specialist handoffs, artifact identity, coverage, isolation, warnings, and blockers before accepting them;
- records checkpoint artifacts, decisions, delegation, aggregate `changeImpactManifest` results, and `carried_forward` gates in resumable state;
- dispatches compatible optional media-production workers without turning them into canonical stages or replacing the integration owner;
- batches post-lock user corrections and reruns only gates whose controlling inputs changed when the batch closes;
- pauses at approval, missing evidence, media production, isolation, or mutation authorization boundaries.

It does not replace a specialist skill, compress gates into one generic review, invent evidence or author experience, silently amend an Article Brief, turn Flexim into a text-workflow requirement, mutate a CMS without explicit permission, or publish.

## Inputs and priority

Accept:

1. explicit user instruction and corrections, including requested target and supplied title;
2. existing workflow state or state path for `resume`;
3. topic or idea, corpus access, and destination;
4. host capabilities for subagents, tasks, sessions, and isolated contexts;
5. sources, claim permissions, product-state evidence, author assignment, author evidence, and author voice input;
6. approved Article Brief or inputs needed to prepare one;
7. draft, audit, media, integration, and final artifacts already produced;
8. explicit private-draft authorization;
9. mode: `run`, `resume`, or `automatic`.

Priority: explicit user correction, approved Article Brief, verified primary source or real asset, claim permissions and product state, editorial policy and permitted author voice, current artifact, model assumption.

Trust artifacts over state labels. When they disagree, record the mismatch and apply the state reference's impact rules.

## Modes and targets

- `run`: work interactively, asking only one decision-changing question at a time.
- `resume`: validate state and artifacts, then continue from the first incomplete, invalidated, or affected stage.
- `automatic`: ask no questions; run every safe stage supported by inputs and host capability, then return `ready` or `blocked`.

Use `requestedTarget`: `portfolio_decision`, `article_brief`, `draft`, `edited`, `text_lock`, `media_plan`, `final_package`, or `cms_draft`. Default to `final_package`. A topic-selection request such as “choose the best topic” maps to `portfolio_decision` unless the user asks for a Brief or later stage. A full workflow request does not authorize a CMS mutation.

## Intake, title, and delegation

### 1. Initialize or resume

Create or migrate state according to the reference. Record whether a host supports workers and the selected `delegation` mechanism. When workers are available, dispatch specialists; the coordinator may prepare an Article Brief but must not produce specialist outputs itself.

When workers are unavailable, disclose `same_context_disclosed` for non-independent stages. For independent audits or the cold reader, return the smallest external clean-context dispatch package instead of performing a same-context imitation.

If an artifact changed outside the workflow, register a new version and create a `changeImpactManifest` before choosing a rerun. Do not use stage order alone as an invalidation graph.

### 2. Classify title authority

Record `article.title.value`, provenance, and `titleAuthority`:

- `fixed`: explicitly supplied by the user or approved in the Article Brief;
- `candidate`: an unapproved working title the user or coordinator may revise at Article Brief stage;
- `missing`: no title exists.

Never derive a replacement title while resolving a topic-only request. Query selection, portfolio decision, title value, and title promise are separate decisions.

At Article Brief stage, carry a `fixed` title forward verbatim. If verified evidence shows that it cannot be delivered honestly, return `EDITORIAL_CONFLICT` with the exact conflict and smallest proposed amendment. Propose a title only for `candidate` or `missing` and only when the requested target reaches `article_brief`.

## Run the workflow

### 3. Establish the portfolio role

Dispatch `audit-content-library` in `pre-brief` mode using current read-only Flexim access or its complete CMS export input. Flexim absence is not a blocker; corpus incompleteness is.

When `requestedTarget` is `portfolio_decision`, accept the ready report, return the chosen topic or portfolio action, differentiation rationale, warnings, and next option, then stop. Do not prepare an Article Brief, propose a title, draft, or mutate CMS.

For later targets, pause for a portfolio decision when the report recommends `update-existing`, `consolidate`, `internal-link-only`, or `defer`. Do not force a new article through the pipeline.

### 4. Prepare and approve the Article Brief

The coordinator builds the smallest complete Article Brief from the pre-brief differentiation contract, user intent, title authority, and verified inputs. Include reader and situation, useful action, title and promise, search intent and scope, reader-facing key phrase when applicable, claim permissions and evidence, product role, differentiation boundaries, internal links, authorship mode, narrative perspective, first-person permissions, and output requirements.

An explicitly assigned author with verified linkage and a ready `authorVoiceHandoff` should default to `narrativePerspective: FIRST_PERSON` unless the user or approved Brief explicitly selects another perspective. This permits authorial framing, navigation, and source-grounded judgment or recommendation; it does not permit unsupported personal actions, product use, results, failures, decision trails, or lived experience.

Present the Brief for explicit human approval. In `automatic`, return `blocked` with the proposed Brief and approval as the next action. Silence is never approval.

### 5. Resolve voice and author contribution

Dispatch `load-author-voice` when the approved Brief requires a named voice. A complete portable profile or handoff is valid when Flexim is unavailable. A voice profile is not evidence.

Dispatch `draft-article` in `structure` mode for author-contribution preflight before full copy. Route `REQUIRED` to a reality-first author interview. For `RECOMMENDED`, preserve permitted non-experiential first person and use local `REPHRASE`, `CUT`, or evidence-required handling only for unsafe spans. Never neutralize the whole article merely because distinctive contribution is absent.

During an author interview, retain the answers in the active conversation and save one completed interview artifact when the interview ends. Create an intermediate checkpoint only when the interview is interrupted, blocked, deferred for a later answer, or approaching a context-loss risk. Do not rewrite the full transcript after each answer.

### 6. Draft and edit

Dispatch `draft-article` for the full draft only after Brief approval and preflight readiness. Validate its handoff, then dispatch `edit-article` with the same Brief, evidence permissions, author handoff, and source provenance.

Do not let either stage promote unresolved claims or production language into reader Markdown. Route `EDITORIAL_CONFLICT` to the smallest required approval instead of changing the contract silently.

### 7. Dispatch independent audits

The required gate set is:

1. `audit-useful-action`;
2. `audit-paragraph-structure`;
3. `audit-tone-honesty`;
4. `audit-eeat`;
5. `audit-content-library` in `pre-chief-editor` mode.

Create five clean packages from the same current reader snapshot. Each worker receives exactly one assigned skill and the smallest complete permitted input package. Do not pass prior reports, Linear comments, chief-editor preferences, or an expected verdict. Only the content-library worker may obtain a fresh read-only corpus snapshot. Only the E-E-A-T worker receives the allowed source bundle and trust metadata.

Dispatch the five workers in fresh isolated contexts, preferably in parallel. Reject an independent report unless its snapshot, coverage, anchors, status, and clean-context provenance are valid. If a clean context is unavailable, return five external dispatch packages and do not claim independent-audit readiness.

### 8. Reconcile and lock

Dispatch `chief-editor-review` only after the baseline five audit reports are valid, or after an amendment with valid reruns and explicitly recorded carried-forward coverage. The chief editor alone changes shared reader Markdown and must route each changed concern through the change-impact rules.

Do not lock meaning until every affected gate is ready or provably `carried_forward`. Keep the explicit `interview_now`, `keep_current_text`, or `defer` decision for a `RECOMMENDED` contribution opportunity.

After the first chief-editor lock, keep that immutable checkpoint as the base and use one working reader Markdown for subsequent user corrections. Do not create a new immutable reader artifact for each micro-edit.

### 9. Plan and integrate visuals

After text lock, dispatch `visual-storytelling` in `plan` mode. A process mention, a `[MEDIA: ...]` marker, or entry into the visual phase does not justify dispatch of any producer by itself.

When the approved media map contains `format: diagram`, `production: design`, and a complete Mermaid-compatible production brief, optionally dispatch `render-mermaid-infographic` as a media-production worker. It is not a canonical workflow stage: record each `visualId + canvas` invocation under `media_integration`, preserve its `mermaid_render_handoff`, and keep `visual-storytelling` in `integrate` mode as the stage owner. Missing Node, Chrome, or renderer setup blocks only that visual. In `automatic`, never authorize setup; preserve the plan or route an approved fallback.

Dispatch `visual-storytelling` integration only after real assets exist and every rendered Mermaid candidate has passed required human semantic review against its brief. Required proof visuals need real sources; generated images, mockups, and stock cannot become proof.

Any meaning or claim change returns to `chief-editor-review`. A media, caption, `alt`, or link change goes through the selective impact matrix rather than reopening unrelated text work.

### 10. Final integration and independent cold reader

Dispatch `final-integration-check` against the lock, final reader Markdown, media manifest, visible trust surface, and proposed payload. A ready integration result is not yet a `final_package`.

From its minimal reader-surface package, dispatch `cold-reader-review` to a fresh isolated worker. Give that worker only title, reader Markdown or rendered page, visible author and publisher surface, media, captions, `alt`, and reader links. Do not give it the Brief, sources, author profile, workflow state, audit reports, or expected result.

If the cold reader blocks:

- text, promise, coherence, example, or useful-action defects return through `chief-editor-review`;
- media defects return through `visual-storytelling` or `final-integration-check`;
- visible packaging leaks return to `final-integration-check` unless they change meaning.

Then use the impact matrix, final integration, and a new fresh cold-reader review. A ready cold-reader report is required for `final_package` and `cms_draft`. For non-Flexim destinations, return the portable final package and mark CMS draft skipped with the destination reason.

### 11. Hand off a private Flexim draft

Treat a CMS draft request as an instruction to close any collecting `revisionBatch`. Complete its aggregate change-impact analysis, affected reruns, final integration, and fresh cold-reader review before evaluating CMS readiness.

Dispatch `cms-draft-handoff` only when all are true:

- `requestedTarget` is `cms_draft`;
- destination is Flexim;
- final integration and cold-reader review are ready for the same final reader-visible surface;
- current explicit `authorization.draftMutationAuthorized` is true.

Preparing or reviewing a payload is not mutation authorization. Private-draft permission is not publication permission.

## Revision batches

After the first complete valid editorial pass and chief-editor lock, treat consecutive user corrections as one `revisionBatch` instead of a sequence of production cycles.

1. The first correction opens the batch automatically with the current lock or final checkpoint as `baseArtifactId` and one `workingArtifactPath`.
2. Apply all corrections from one user message in one patch. Later correction messages update the same working reader Markdown.
3. Acknowledge each accepted message briefly. Do not dispatch audits, final integration, or a cold reader while the batch is `collecting`, and do not persist state for each micro-edit.
4. Close the batch when the user says the equivalent of “done,” “check it,” or “final review,” or when a CMS draft request arrives. If interruption requires a durable checkpoint, persist the batch as `collecting` without starting expensive work. If intent to close is ambiguous, keep collecting.
5. Compare the complete working Markdown with the base checkpoint, classify the aggregate changed anchors and fields, and create one aggregate `changeImpactManifest` for the entire batch.
6. Carry a stage forward only with valid prior provenance, unchanged controls, the aggregate manifest, and explicit rationale. Rerun each affected independent audit once in a new clean context with the current complete package, never with another auditor's report.
7. If meaning changed, route the accepted rerun reports through `chief-editor-review` and create a new meaning lock. Purely surface-level corrections keep the existing meaning lock.
8. For a changed reader-visible final surface, run one final-integration check and one fresh isolated cold-reader review after all affected editorial work is ready. Preserve valid final results for production-only or invisible payload changes.

### Active collection fast path

When a collecting batch was already validated in the same active coordinator context and the new instruction is another correction, reuse the known workflow ID, state reference, base artifact, and working Markdown path. This active context is transient execution memory, not durable state.

- Do not reread the complete workflow state, this `SKILL.md`, or its state reference, and do not revalidate unchanged gates.
- When an anchor may be only part of a Markdown line, run at most one focused target-read command before the patch and use the returned complete line. Do not guess surrounding text.
- Apply all changes from the message in one patch. A successful patch is sufficient verification because it matches the old line before writing the replacement. Do not run a post-patch command unless the patch result itself is ambiguous.
- Leave the fast path when the target is ambiguous, the patch fails, an external file change is plausible, active context was lost, or the user requests a checkpoint, review, finalization, or CMS handoff. Resume normal state validation in those cases.
- Return the YAML block itself without a prose preface or paraphrase:

```yaml
status: in_progress
workflowId: "..."
stateRef: ".seo-writers/sessions/.../workflow-state.json"
stateDelta:
  changedArtifacts:
    - reader_markdown
  changeClasses:
    - reader_wording
  invalidatedGates: []
  carriedForwardGates: []
  statePersisted: false
nextAction: await_more_user_edits
```

The state reference defines change classes, `coverageFingerprint` rules, close behavior, persistence checkpoints, and minimum dependencies. Escalate conservatively when semantic effect, ownership, or fingerprint is unclear.

## Pause, block, or finish

- `waiting`: `run` or `resume` needs one human approval, portable input, real asset, author answer, isolated report, cold-reader context, or explicit draft authorization.
- `blocked`: critical conflict, missing fact, missing required clean context in `automatic`, or other gap that cannot safely be removed, qualified, or routed.
- `ready`: the requested target's terminal artifacts exist and all upstream requirements are ready or validly carried forward.
- `in_progress`: a safe next stage has a complete specialist package and awaits an available worker.

## Output

Return a compact delta by default:

```yaml
status: in_progress | waiting | blocked | ready
workflowId: "..."
stateRef: ".seo-writers/sessions/.../workflow-state.json"
stateDelta:
  changedArtifacts: []
  changeClasses: []
  invalidatedGates: []
  carriedForwardGates: []
  statePersisted: true | false
nextAction: "await_more_user_edits or the smallest concrete next action"
```

Do not return complete state by default. Return it only when the user explicitly asks, persistence fails, or a safe handoff cannot be represented by the compact delta and referenced artifacts. When waiting, include the smallest self-contained input or worker dispatch package. When ready, identify the terminal artifact and confirm that no publication occurred.

## Do not

- Produce a specialist's audit, draft, edit, visual, final-integration, cold-reader, or CMS result in the coordinator when a suitable worker exists.
- Skip either content-library pass, the initial five independent audits, or the cold-reader gate for a final package.
- Call a same-context audit or cold-reader pass independent.
- Change a fixed title or Article Brief without explicit approval.
- Treat author voice as experiential evidence or turn every permitted first-person sentence into an interview requirement.
- Default a correction to a full workflow rerun or carry an affected gate forward without proof.
- Start an audit or final-reader cycle for each correction inside a collecting revision batch.
- Make Flexim mandatory for text work, mutate CMS without private-draft authorization, or publish.
