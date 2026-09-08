# Workflow checkpoint contract

Use this contract to coordinate, pause, and resume one article without maintaining a second model-visible copy of the conversation.

## Core rule

Do not create or update a central workflow state file during an uninterrupted run. The active conversation is transient execution memory. The current reader artifact and durable specialist outputs show what exists; immutable checkpoints show what was approved.

Create immutable reader checkpoints only at these boundaries:

1. `draft` after a ready drafting handoff;
2. `chief_editor_lock` after meaning, evidence, structure, and required audit coverage are ready;
3. `final_package` after final integration and a fresh isolated cold-reader review are ready for the same reader-visible surface.

Use one mutable reader Markdown between checkpoints. Do not version every user correction. Preserve separate specialist reports, media assets, integration packages, CMS `mutationReceipt` artifacts, and aggregate `changeImpactManifest` records when their stage completes.

Create a short `boundaryHandoff` only when work is interrupted, waiting, blocked, transferred to a fresh context, or at material risk of context loss. The handoff points to durable artifacts; it does not duplicate them.

## Artifact identity

Each durable artifact records or exposes:

- stable artifact kind and path or external reference;
- content hash or equivalent immutable identity;
- stage and creation time;
- controlling input artifact identities;
- relevant status, warnings, and blockers;
- worker provenance when a specialist produced it.

Reader checkpoints should contain the reader Markdown or an unambiguous pointer plus its checksum. Audit and integration artifacts keep their own native handoff contracts. Do not copy every report into another coordinator record.

Prefer a compact directory such as:

```text
.seo-writers/sessions/<article-slug>/
  checkpoints/
    draft.md
    chief-editor-lock.md
    final-package.md
  working/
    article.md
  reports/
  media/
  handoffs/
  mutation-receipts/
```

The directory name is storage organization, not a workflow ID that must be returned to the model on every turn.

## Selected topic context

For an article that starts from supplied topics, retain the source link in the existing Article Brief provenance, then in the controlling metadata of reader checkpoints and any boundary handoff. Use the same `writingContext`; do not create a second workflow-state file or put these fields in reader Markdown or the cold-reader package.

```yaml
writingContext:
  workspace: null
  contextId: null
  generationId: null
  topicId: null
  market: null
  sourceBriefRef: null
```

Copy identifiers and market from the supplied handoff or verified source; they are opaque values, not values derived from the title or URL. Preserve both market label and code when supplied. `sourceBriefRef` identifies the complete selected source brief and its immutable identity, including product/audience research supplied with it. Other supplied provenance, such as execution identity, remains with that source artifact. Keep a reference to the approved Article Brief separately: approving or amending it does not rewrite the original research.

Missing identifiers remain `null`; portable writing can continue, but a linked topic mutation cannot use an invented or ambiguous target. A fresh context validates source identity against artifact provenance and retains the user's actual selection. If the user has not chosen yet, the boundary handoff preserves the candidate source references and the outstanding question, with `topicId: null`. A new API response from another workspace, market, context, or generation must not replace this context automatically.

At `final_package`, preserve references to final reader Markdown and metadata alongside this provenance. A later CMS choice resumes from that package. Article completion, a topic-status mutation, and a verified CMS record are separate facts; only their respective artifacts or read-back receipts establish them.

## Deriving the current stage

On `run` or `resume`, derive the current stage from evidence in this order:

1. the current explicit user request and correction;
2. the newest valid immutable reader checkpoint;
3. the working reader artifact and its difference from that checkpoint;
4. ready specialist outputs whose input identities match current artifacts;
5. the short `boundaryHandoff`, if one exists;
6. conversation history available in the same active context.

Artifact evidence outranks a handoff label. If the handoff says a gate is ready but its report is missing, stale, or points to another input hash, treat the gate as incomplete. If a valid artifact exists but the handoff omitted it, use the artifact and note the recovered stage in the next compact response.

A report for an older reader hash may remain valid only with the explicit carry-forward record and anchor mapping from [audit-coverage.md](audit-coverage.md). Hash mismatch triggers comparison, not an automatic rerun of every semantic audit.

Do not infer readiness from stage order alone. The current stage is the first required target dependency that is missing, blocked, or invalidated by changed controlling inputs.

## Boundary handoff

`boundaryHandoff` is a compact context-transfer artifact, not persistent workflow memory. It contains only what a fresh coordinator cannot safely derive cheaply from checkpoints and reports.

Minimum form:

```yaml
boundaryHandoff:
  status: waiting | blocked | collecting | in_progress
  requestedTarget: final_package
  baseCheckpointPath: ".seo-writers/sessions/example/checkpoints/chief-editor-lock.md"
  workingArtifactPath: ".seo-writers/sessions/example/working/article.md"
  pendingCorrectionCount: 2
  pendingCorrections:
    - sequence: 1
      userInstruction: "Remove the selected sentence."
      oldText: "Exact selected sentence."
      newText: ""
    - sequence: 2
      userInstruction: "Replace the selected phrase."
      oldText: "Exact old phrase."
      newText: "Exact new phrase."
  openStage: revision_batch
  closeReason: context_transition
  requiredArtifactRefs: []
  nextAction: resume_revision_batch
```

For an open revision batch, preserve `status: collecting`, `baseCheckpointPath`, `workingArtifactPath`, `pendingCorrectionCount`, exact ordered `pendingCorrections`, and the next action. Each pending item retains the user's instruction plus its `oldText` and `newText`; later corrections stay after earlier ones so a fresh context can compose dependencies deterministically. Do not embed the whole article, full audit history, or unchanged decisions when their artifacts can be referenced.

For an interrupted interview, add the partial transcript checkpoint and the exact unanswered question to `requiredArtifactRefs` or a small interview-specific field. Do not regenerate the transcript from memory.

Preserve the preflight's `authorInterviewChoice` reference, including recommendation identity, exact user instruction, pending state, and any revisit condition. Restore a pending offer as unanswered; restore `skip` or `defer` without asking again solely because context changed. Preserve the `editedPreview` receipt when the edited draft has already been shown. Neither record needs the author's voice profile.

Never store CMS authorization in a boundary handoff. The current explicit user request must authorize a new private-draft mutation.

## Worker ownership and delegation

Every specialist-owned stage runs through its named skill when the host supports workers. Record delegation in the specialist output or a small dispatch receipt:

```yaml
workerRef:
  skill: audit-eeat
  mechanism: subagent
  isolation: isolated
  inputArtifactIds:
    - reader-markdown-sha256
    - article-brief-sha256
  outputArtifactIds:
    - audit-eeat-report-sha256
```

Canonical ownership:

| Stage | Owner |
| --- | --- |
| portfolio audit | `audit-content-library` pre-brief |
| author voice | `load-author-voice` |
| draft and preflight | `draft-article` |
| edited reader Markdown | `edit-article` |
| useful action | `audit-useful-action` |
| paragraph structure | `audit-paragraph-structure` |
| tone and honesty | `audit-tone-honesty` |
| evidence and author contribution | `audit-eeat` |
| completed-library role | `audit-content-library` pre-chief-editor |
| meaning lock | `chief-editor-review` |
| media plan and integration | `visual-storytelling` |
| optional Mermaid production | `render-mermaid-infographic` |
| integration readiness | `final-integration-check` |
| reader-only final gate | `cold-reader-review` |
| authorized private draft and read-back | `cms-draft-handoff` |

When artifact storage needs a machine-readable stage key, use the established `cold_reader_review` key for the reader-only final gate.

Never run the five independent audits or the cold reader in the coordinator context and label them independent. If isolated workers are unavailable, create external clean-context dispatch packages and wait for their returned artifacts.

### Capacity and handoff procedure

1. Inspect the host's actual capacity and worker lifecycle. Count the coordinator and any retained completed workers against occupied slots. Do not assume that completion, interruption, or waiting retires a worker.
2. Before retiring a provider, obtain its complete result and verify required inputs are available for the next recipient. The coordinator may hold the full `authorVoiceHandoff` transiently and pass it verbatim to each authorized voice-dependent worker. A summary, profile ID, checksum, or last-line excerpt is not the complete profile.
3. Include an input acknowledgement in the recipient's normal result/receipt: recipient identity, target stage, input identities, and completeness. Verify exact profile content/identity and permitted stage without writing the profile to files, separate logs, or durable boundary handoffs. The checksum may identify a transient payload; it cannot replace that payload. A clean auditor receives only its authorized raw inputs, never the provider's reasoning or previous reports.
4. Reuse a production worker only for compatible non-independent work and when it holds the required inputs. Use the host's supported retire/close operation after result transfer to release retained slots. Verify release before dispatch. Never reuse a drafting, editing, or previous audit context as a fresh independent reviewer.
5. Queue the five audits in waves within capacity. On a four-slot host including the coordinator, at most three workers occupy slots together. Receive and validate results, retire completed workers when supported, then launch the remaining fresh audits. Preserve valid reports; do not restart the entire wave for one failure.
6. After a definite send/spawn failure, record target, error, and the condition needed to retry. Retry only after that condition changes (slot freed, recipient created/idle, corrected target, or supported channel selected). After an ambiguous result, inspect delivery/status before resending to avoid duplicates. Do not repeat a known unsupported transfer method.
7. If safe transfer or fresh capacity cannot be obtained, retain pending packages and return `in_progress` for a known running dependency, otherwise `waiting` interactively or `blocked` in `automatic` with the smallest external clean-context dispatch package. A host without retirement or a fresh-context mechanism cannot complete independent review by relabeling an old worker.

At a context boundary, retain non-sensitive input refs and the exact missing transfer condition in the short `boundaryHandoff`. Never persist or reconstruct a lost profile from a summary: route to `load-author-voice` for an authorized fresh read or complete portable input. Do not write a second central scheduler/runtime or a per-message dispatch history.

## Optional production workers

Optional media producers are not canonical workflow stages. Keep their records append-only under `productionWorkers`, grouped by the owning stage and the real invocation identity.

For Mermaid, preserve the complete `mermaid_render_handoff` from every `visualId + canvas` render. A reusable invocation has a `reuseIdentity` containing all of:

```yaml
productionWorkers:
  media_integration:
    - workerRef:
        skill: render-mermaid-infographic
        inputArtifactIds: []
        outputArtifactIds: []
      mermaid_render_handoff: {}
      reuseIdentity:
        sourceSha256: "..."
        briefFingerprint: "..."
        componentHashes: {}
        rendererVersion: "0.2.1"
        packageLockSha256: "..."
```

Reuse only when every identity field matches and the prior human semantic review still applies. `render-mermaid-infographic` produces the candidate; `visual-storytelling integrate` owns article integration. A process mention or `[MEDIA: ...]` marker alone does not justify dispatch.

## Baseline gates and coverage

Selective invalidation starts only after the first complete required pass, including before the first lock when the chief editor applies changes:

- both content-library audits have valid outputs for their required moments;
- the four text audits and pre-chief-editor content-library audit cover the same edited reader snapshot;
- the original audited reader input is immutable and its identity is recorded in the editing receipt;
- chief-editor review resolves material findings and verifies affected reruns before creating the lock.

Use [audit-coverage.md](audit-coverage.md) at the first dispatch to establish compact complete coverage, concern-specific controls, and anchor-mapping rules. Keep reader byte identity separate from the inputs that control each judgment.

Each independent report carries a concern-specific `coverageFingerprint` derived from its controlling inputs and coverage manifest. A result may be marked `carried_forward` only when:

1. the prior report is valid and independently produced;
2. the aggregate `changeImpactManifest` shows that its controlling content and relationships did not change, with an unambiguous mapping for relocated anchors;
3. its `coverageFingerprint unchanged` determination is explicit;
4. the carried-forward provenance identifies the prior report.

Uncertainty invalidates the related gate conservatively. Do not treat a matching whole-file hash as a substitute for concern-specific reasoning when metadata or external product state controls the gate.

## Revision batches

After the first chief-editor lock, the first user correction opens one `revisionBatch`. The active conversation tracks that it is open and retains its pending operations; the base checkpoint and unchanged working Markdown identify the durable content.

Rules:

1. Record every accepted correction as exact ordered `oldText` / `newText` pairs in transient `pendingCorrections`. Preserve the user's instruction alongside each pair.
2. Do not read or modify the working Markdown while collecting. Later correction messages append to the same transient batch and require no file or specialist tool calls.
3. Do not create a checkpoint, dispatch an audit, run final integration, or run a cold reader between individual corrections.
4. Close the batch on a natural equivalent of “это всё,” “готово,” “применяй,” “проверяй,” “покажи итог,” “done,” “check,” or “final review,” or automatically before a CMS draft request.
5. On closure, validate the pending anchors, compose dependent replacements, and apply the complete batch in one consolidated patch. An ambiguity or external conflict blocks before any partial write.
6. Diff the resulting working artifact against `baseCheckpointPath` and create one aggregate `changeImpactManifest`.
7. Rerun each affected gate once. Preserve each unaffected gate only through the `carried_forward` rules.
8. If meaning changed, `chief-editor-review` accepts the rerun reports and creates a new chief-editor lock. Surface-only changes retain the prior meaning lock.
9. After all reader-visible changes are ready, run one final-integration check and one fresh isolated cold-reader review.

When a context boundary occurs before closure, create only the short collecting handoff shown above with the exact pending operations. The working Markdown stays unchanged. Do not create or update a central workflow state file.

## Aggregate change impact

One closed batch creates one `changeImpactManifest`:

```yaml
changeImpactManifest:
  baseCheckpointPath: ".../chief-editor-lock.md"
  workingArtifactPath: ".../article.md"
  changedAnchors: []
  changedFields: []
  changeClasses: []
  invalidatedGates: []
  carriedForwardGates: []
  closeReason: user_requested_review | cms_draft_request | explicit_checkpoint
```

Classify the whole batch, not each turn:

| Change class | Minimum consequence |
| --- | --- |
| `production_state_only` | No reader gate changes; keep only production provenance. |
| `spelling_typography` | Punctuation, spelling, or typography alone does not invalidate an independent editorial audit. Inspect rendered meaning first; a soft-line reflow can retain editorial and final-reader results only when the complete rendered surface and every other control are unchanged. |
| `paragraph_structure` | Invalidate `audit-paragraph-structure`; add other gates if meaning or navigation changed. |
| `title_or_useful_action` | Invalidate `audit-useful-action`; include tone or E-E-A-T if the promise or claim changed. |
| `tone_voice_authorship` | Invalidate `audit-tone-honesty`; include E-E-A-T for new experiential first person. |
| `claim_evidence_product_state` | Invalidate `audit-eeat`, even when only the source or product-state input changed; include tone for changed confidence/qualification and useful action or content-library role when the claim changes the article's job. |
| `brief_scope_or_intent` | Return to Brief approval, content-library pre-brief, and every affected downstream gate. |
| `media_caption_alt_link` | Route to visual and integration gates as applicable; a support-link destination change invalidates E-E-A-T, an internal-link destination/role change invalidates content-library review, and a changed next action invalidates useful action. |
| `visible_trust_metadata` | Invalidate E-E-A-T and final integration; a changed relationship disclosure also invalidates tone honesty. Require a fresh isolated cold-reader review if the reader-visible surface changed. |
| `cms_payload_only` | Route to final integration and CMS read-back. A serializer-only safe payload change does not invalidate the cold-reader result. |

Any changed reader-visible final surface requires one final-integration check and one fresh isolated cold-reader review after affected editorial gates are ready. A production-only change that cannot affect the reader surface does not invalidate the cold-reader result.

## Checkpoint persistence

Persist a checkpoint or compact handoff only when:

- draft, chief-editor lock, or final package completes;
- a stage completes with a durable specialist output;
- work becomes waiting or blocked across turns or contexts;
- an interrupted interview must retain partial evidence;
- an open revision batch crosses a context boundary;
- an external CMS mutation is attempted or read back.

Do not persist after each collected correction or each interview answer. The active conversation holds pending corrections until closure; the single successful consolidated patch is sufficient after closure inside the same active coordinator context.

## CMS mutation receipts

CMS permission comes only from the current explicit user request. It is never inferred from a previous turn, checkpoint, handoff, or legacy state.

For every authorized CMS mutation attempt, preserve a `mutationReceipt` even when the attempt partially succeeds or read-back blocks completion. Include:

```yaml
mutationReceipt:
  requestedOperation: create_private_draft | update_private_draft
  authorizationSource: current_user_request
  targetRef: null
  mutationStatus: attempted | succeeded | partial | failed
  readBackStatus: pending | matched | blocked
  articleArtifactId: "..."
  suggestedTopicStatus: unchanged | done | blocked
```

The receipt is evidence and recovery context, not permission to retry. Publication always requires a separate explicit request and remains outside this workflow.

## Resume procedure

In a fresh context:

1. Read this skill and this contract.
2. Read the short `boundaryHandoff`, if provided.
3. Resolve only the checkpoint, working artifact, and specialist reports required by its refs or by the requested target.
4. Verify hashes, worker isolation, input identities, unresolved markers, and open batch status.
5. Derive the current stage from the artifacts rather than trusting the handoff's claimed stage.
6. Continue from the first missing or invalidated dependency.

For a collecting batch, restore the exact ordered `pendingCorrections` from the handoff and append later corrections without reading or modifying the working artifact. Compare the working artifact with the base checkpoint only when closing the batch or when external modification is suspected. Do not pay the full diff and audit cost for each resumed correction.

## Legacy migration

A legacy workflow state with version `1.0`, `1.1`, or `1.2` is accepted only as a one-time migration input.

1. Read it once and resolve its referenced reader checkpoints, specialist artifacts, open revision batch, `productionWorkers`, and Mermaid `reuseIdentity` records.
2. Validate the referenced artifacts independently of the state's readiness labels.
3. Produce the smallest `boundaryHandoff` needed to continue, using `baseCheckpointPath` and `workingArtifactPath` for an open batch.
4. Preserve valid append-only worker and mutation evidence in their own artifacts.
5. Discard stored CMS authorization; require the current explicit user request for any new mutation.

Do not update or recreate the legacy state file. Do not copy its complete decisions, artifacts, or history into a new central file. Once the boundary handoff is consumed, normal checkpoint-based coordination applies.

If a migrated legacy batch had already patched its working artifact, mark that fact in the one-time handoff and do not represent those applied changes as pending or apply them again. Close it by diffing the existing working artifact against its base checkpoint. New batches use deferred pending corrections exclusively.

## Privacy and repository boundary

Store real Article Briefs, sources, author evidence, interviews, drafts, checkpoints, reports, media, handoffs, and mutation receipts only in the private content repository or approved external system. Never place them in the public plugin repository. Keep sensitive data out of worker packages unless the assigned specialist needs it.

## Completion invariants

- A requested target is `ready` only when its required artifacts exist and match their controlling inputs.
- A final package requires ready final integration and a fresh isolated cold-reader review for the same reader-visible surface.
- A CMS draft requires the same final package, current explicit authorization, mutation read-back, and a durable receipt.
- A checkpoint never authorizes publication.
- Missing, stale, or ambiguous evidence returns the smallest `waiting` or `blocked` action instead of an invented result.
