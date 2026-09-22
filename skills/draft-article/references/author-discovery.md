# Author discovery before direction approval

Use this contract in every `structure` or full-draft call, before classifying residual evidence needs. The coordinator dispatches it through `draft-article`; it is part of existing drafting preparation, not another audit or a new skill.

## Establish the direction from author input

After topic and source analysis, keep the model's angle and section plan provisional. Establish what the author wants the reader to understand or do, their actual position or approach, relevant material, and its limits. An answer may change the central argument or remove a proposed section. Do not restrict discovery to supplying examples for a model-selected outline.

First inspect supplied user instructions, interviews, notes, and artifacts for those answers. A bio, voice profile, public sources, general Brief approval, a neutral angle chosen by the model, or the ability to write honest generic copy does not establish the author's intent. `REQUIRED`, `RECOMMENDED`, and `NOT_NEEDED` apply only after discovery; none can waive it.

When answers are missing, ask one concrete question at a time in interactive work. Start with the unresolved issue most likely to change the direction, using the actual topic and ordinary language. For example: “Что в этой проблеме вы хотите объяснить читателю прежде всего?” Recover a real episode or decision when it would ground the answer; do not presuppose that the author has a process, success, disagreement, or case to describe. Do not ask for permission to begin this initial clarification or present it as an optional improvement to an already chosen article. Respect an existing explicit instruction to omit further author participation.

Use the supplied answers to identify remaining direction-changing unknowns. Do not impose a question quota or ask again for covered material. An explicit “I have no relevant experience” is a real limit, not a reason to solicit an invented anecdote. Discovery can finish with a source-based direction when the author's intended point and the limits of their material are clear. Record residual evidence gaps for the subsequent preflight.

When a worker cannot talk to the user, return the unanswered question to the coordinator. The coordinator's `run` or interactive `resume` governs the conversation; a worker's non-interactive execution does not turn it into `automatic` or waive this gate.

## Completion and pause rules

| Situation | `authorDiscovery` | Next action |
| --- | --- | --- |
| Relevant answers are available from the conversation | `resolved`, `interview` | Rebuild the proposed direction from the answers, then run residual preflight. |
| Previously supplied material covers intent, position, relevant material, and limits | `resolved`, `provided_material` | Cite the exact supporting inputs and reuse them without another interview. |
| User explicitly chooses writing without further author participation, including a source-only instruction | `skipped`, `user_opt_out` | Preserve the exact instruction and scope; run residual preflight with honest limitations. |
| Direction-changing answers are missing or the author asks to pause | `pending`, `none` | Ask the next question or wait; no full draft or approval of a newly proposed Brief. |
| `automatic` lacks covered answers or an explicit opt-out | `pending`, `none` | Return `blocked`, empty `draftMarkdown`, and `nextStage: author_interview` with the missing input. Do not ask a live question. |

“Ask me tomorrow” pauses with `pending`; “defer the conversation and write from sources now” is a scoped explicit opt-out. Silence and elapsed time do not settle the direction. Selecting `automatic` alone is not an opt-out. `automatic_fallback` belongs only to later optional evidence opportunities and cannot complete discovery. A skipped discovery never waives a critical claim, a fixed title, or an approved Brief requirement.

Once discovery is `resolved` or `skipped`, run the existing author-contribution preflight against the resulting direction. Its `REQUIRED / RECOMMENDED / NOT_NEEDED` decision concerns remaining evidence needs. Reuse answers and user choices; do not turn the same answered issue into a new recommended interview.

## Handoff and reuse

Keep this small record in the existing structure/drafting handoff:

```yaml
authorDiscovery:
  status: pending | resolved | skipped
  basis: none | interview | provided_material | user_opt_out
  subjectKey: "assigned author or requesting user + selected topic identity"
  inputRefs: [] # exact controlling source/user inputs, with immutable identities
  evidenceRefs: [] # actual answers or supplied material, including conversation turns
  directionSummary: "" # intended point, relevant material, limits; not Brief approval
  userInstruction: null # exact opt-out or pause instruction when supplied
  unansweredQuestions: []
```

`resolved` requires non-empty `evidenceRefs` that resolve to the answers supporting the direction. `skipped` requires the exact user instruction in `userInstruction` and its provenance in `inputRefs`. A bare status or model rationale satisfies neither. `pending` leaves `authorContributionPreflight: null`; no residual decision exists yet. Store actual answers in the author evidence handoff, not just the model's summary. Retain them in the active conversation and persist one completed interview artifact, or a partial one only at an actual context boundary.

Pass `authorDiscovery` and the referenced inputs to the structure, drafting, editing, and chief-editor workers. On reuse, check the same author/topic and whether changed intent or evidence affects the recorded direction. Do not invalidate it for routine rewording, a new worker, or the Brief changes that implement its own answers. Reopen only the changed unknown, retaining settled answers and the scope of any opt-out. Resume a pending question as pending.

A legacy `authorInterviewChoice` can establish `skipped` only when its exact user instruction explicitly covers writing without additional participation. Refusing one example is not a waiver of direction discovery. An old `NOT_NEEDED` or generally approved model-written Brief does not supply missing answers. If a full draft already exists, do not restart discovery merely because this record is absent: preserve the artifact and handle actual new evidence or direction changes through the existing review and amendment path. Never backfill an interview that did not happen.

## Direction and evidence boundaries

Return a proposed direction and structure grounded in the answers. Before the first full draft, the coordinator obtains approval of the resulting Article Brief. With an already approved Brief or fixed title, an incompatible answer returns `EDITORIAL_CONFLICT` and the smallest amendment; never silently replace the contract. A material portfolio-role change returns to `audit-content-library` pre-brief before approval.

An explicit “write/proceed” instruction approving a complete Brief already shown to the user can also carry the opt-out from further author participation. Preserve both meanings and that exact Brief reference; do not demand a second approval. Do not infer approval for an unseen Brief or from “no questions” alone.

Pass raw author answers and evidence provenance to the first `audit-eeat` as well as reruns. Do not give independent auditors discovery verdicts, interview-choice decisions, or earlier reviews. The chief editor compares findings with the recorded answers and choices, so later questions address genuinely unresolved material gaps. Keep the cold reader's package reader-visible only.
