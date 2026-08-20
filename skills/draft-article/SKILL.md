---
name: draft-article
description: Write or structure a useful article from an approved Article Brief, source material, notes, or interviews. Use for outlines, drafts, guides, cases, expert columns, and automatic article generation when a reader task and evidence must become an evidence-linked draft. Before a full named-author draft, decide whether real author contribution is required, recommended, or not needed; preserve permitted authorial first person while limiting experiential first-person claims to supplied evidence. Keep keyword, audit, Brief, MCP, schema, and other production-only metadata outside reader copy unless the subject genuinely requires it. Do not use to edit a final draft or publish.
---

# Draft an article

Move an approved Article Brief to an honest, useful draft. Build around the reader's action and available evidence. Never replace missing proof with smooth generic copy.

## Responsibility

`draft-article`:

- verifies that the Article Brief is ready;
- runs author-contribution preflight before a full draft;
- builds structure around the reader's useful action;
- writes only from allowed claims and supplied evidence;
- exposes gaps and hands the result directly to `edit-article`.

It does not silently change the promise, audience, product role, or scope; turn assumptions into facts; perform final editing; create a CMS record; or publish.

## Inputs and priority

Use the fullest available package:

1. a `ready` `audit-content-library` `pre-brief` report and differentiation contract;
2. the approved Article Brief, including the owned job, exclusion zones, and internal-link handoffs;
3. a `ready` `authorVoiceHandoff` from `load-author-voice` when assigned-author voice is required;
4. an author evidence bundle containing real interviews, answers, artifacts, decisions, observations, failures, boundaries, or actual use;
5. evidence such as data, code, screenshots, and examples;
6. sources and claim permissions;
7. editorial policy;
8. mode: `structure`, `draft`, or `automatic`.

The Brief may use another format, but it must identify language and format, reader and situation, useful action, promise and non-goals, search intent and scope, target keyword and approved natural reader-facing key phrase when applicable, intended form, claim permissions, evidence, product role, `authorshipMode`, `narrativePerspective`, expected author contribution, permitted first person, and output requirements.

Resolve conflicts in this order:

1. explicit user correction;
2. approved Article Brief;
3. verified primary source;
4. editorial policy and the permitted scope of `authorVoiceHandoff`;
5. notes and model assumptions.

Do not read CMS for an author profile. A voice profile controls voice and composition only; it is not evidence, a claim source, or permission to claim personal actions, use, results, failures, or lived experience.

## Production language and reader language

Treat as `production-only` anything that controls production but does not help the reader: keyword and query metadata, volume and difficulty, owned jobs, differentiation and collision labels, corpus and audit IDs or statuses, Brief and handoff fields, claim IDs, gate names, MCP methods, schema and collection names, raw enums, resolver metadata, validation timestamps, and narration of the current production process.

Keep this material in the Brief, research record, or handoff. Reader Markdown may contain only the useful result: a natural phrase, reader question, verified behavior, meaningful limitation, or relevant next action. A production term is allowed only when it is genuinely part of the article's subject.

If a required reader artifact uses an internal label, preserve its function but rewrite the label in ordinary reader language. Return `EDITORIAL_CONFLICT` only when the exact disputed wording is mandatory and the reader-facing result cannot be determined safely.

## Modes

- `structure`: return Brief readiness, structure, and missing evidence; do not write the full article.
- `draft`: return structure, full draft, and editor handoff.
- `automatic`: ask no questions and return a structured `ready` or `blocked` package.

If unspecified, a plan request means `structure`; a writing request means `draft`.

## Process

### 1. Normalize the Brief

Reduce the task to one working sentence:

> Help **[reader in a specific situation]** complete **[useful action]** through **[form and evidence]** without promising **[non-goals and prohibited outcomes]**.

Extract decisions that control the article. Do not rewrite the Brief as prose.

### 2. Run author-contribution preflight

Before structure and full drafting, determine:

- `authorshipMode`;
- `narrativePerspective: FIRST_PERSON | NEUTRAL | ORGANIZATIONAL | THIRD_PERSON`;
- `authorContributionExpected`;
- `authorEvidenceStatus: DEMONSTRATED | AVAILABLE_NOT_INTEGRATED | ABSENT | NOT_REQUIRED`;
- separate `firstPersonPermissions` for authorial framing, article navigation, source-grounded definitions, source-grounded judgments, source-grounded recommendations, process claims, observed results, and lived experience;
- `decision: REQUIRED | RECOMMENDED | NOT_NEEDED`;
- up to three contribution opportunities with reader benefit and a safe fallback.

An author name, title, bio, or voice profile is not author evidence. First person is not evidence by itself. A verified assigned author with a ready `authorVoiceHandoff` may nevertheless use `FIRST_PERSON` for authorial framing, navigation, and source-grounded judgment or recommendation when the Brief permits it.

Use:

- `REQUIRED` when the promised practitioner, review, or case perspective depends on a real answer, artifact, observation, boundary, or decision trail and a neutral fallback would change the Brief;
- `RECOMMENDED` when an evidence-safe neutral version is possible, but named authorship, practical advice, or a material product relationship creates a reasonable expectation of distinctive contribution that would improve reader understanding or action;
- `NOT_NEEDED` when the article is intentionally neutral or organizational, contribution would not affect the useful action, or supplied evidence is sufficient.

For `RECOMMENDED`, identify the planned section, missing specificity, and a local fallback. Keep permitted authorial first person unchanged; use `KEEP_CURRENT_TEXT`, `REPHRASE`, or `CUT` only for the exact span that would otherwise assert unsupported experience. In automatic mode, retain the approved authorial perspective and never invent experiential `I`.

When a framework exists only as a model hypothesis, label it internally as a hypothesis. Never ask an author a question that assumes the framework is real. Recover the factual episode in ordinary language first.

For `REQUIRED` or an accepted `RECOMMENDED`, prepare at most three pre-draft questions:

- refer to a `briefAnchor` and `plannedSection`, not a nonexistent reader span;
- ask first for one real episode, observable action, input, output, boundary, or criterion of done;
- record `frameBasis: AUTHOR_LANGUAGE | SOURCE_LANGUAGE | NEUTRAL_RECONSTRUCTION` and `presuppositionCheck: PASS`;
- state which experiential first-person permission the answer can unlock and which local fallback remains.

Ask one question at a time. Save answers as a separate author evidence handoff, rerun preflight, then build the structure. Independent `audit-eeat` will repeat the decision after editing against exact reader-facing spans.

### 3. Check readiness

Return `ready` only when the reader and situation are specific, the useful action is observable, the title promise can be delivered honestly, the form matches intent, key facts have sources and permissions, no invented experience or result is required, future features are not required as current, product role is clear, the differentiation contract is preserved, and production-only inputs can stay outside reader language.

Return `blocked` when the reader or purpose is unknown, the title requires an unsupported result, a key step depends on an unavailable or future feature, the promise requires invented evidence, or sources conflict on a critical claim.

Remove or weaken optional unsupported claims and list the change in warnings.

### 4. Separate production-only inputs

Create a short internal map before outlining:

| Input | Production purpose | Reader need | Action |
| --- | --- | --- | --- |
| Query or keyword | Find and validate the topic | Natural name of the problem, if useful | Rephrase or omit |
| Corpus finding | Distinguish page roles | Plain boundary and useful next link | Explain normally |
| MCP or schema check | Verify a product claim | Verified behavior and material limitation | Keep method in handoff |
| Brief, gate, or status | Manage production | Practical question, check, or decision | Rename for the reader |

Do not open with phrases such as “the query X,” “checked on this date,” “the schema stores,” or “the audit found” unless the reader came to learn about that object. First person does not bypass this boundary.

### 5. Place the primary key phrase

If the Brief contains a target keyword, approve one grammatically natural reader-facing key phrase first. Literal query order is not required.

- Use it in H1 and exactly one H2.
- Add at most two natural body uses.
- Count 2–4 occurrences in the entire reader scope, including H1 and H2.
- Exclude URLs, metadata, service sections, alt text, code blocks, and handoffs.
- Do not apply the same quota to secondary keywords.

If a natural H1 or H2 would change the approved promise, return `EDITORIAL_CONFLICT` and propose the smallest key-phrase change.

### 6. Build the evidence map

For every planned section record its reader task, one testable claim, supporting experience or source, permission (`allowed`, `qualified`, or `prohibited`), boundary, and any media that explains or proves the point better than prose.

Never use `prohibited`. Keep the required qualification next to every `qualified` claim.

### 7. Choose form and structure

Make form serve the task: instructions guide action; stories show a person, event, and change; overviews explain a system and its boundaries; comparisons support a choice; collections provide independent options; cases prove a result with specific evidence.

Every section must advance the useful action, provide required evidence, expose a limitation or decision, or bridge one action to the next. Remove any section that merely repeats a keyword, restates the title, or adds generic background.

Headings must reveal the article's reasoning without body copy. For step-by-step content, use a consistent action-bearing form such as `Step 1 (35 mins): Choose a topic worth writing about`, not a time range without an action.

### 8. Draft

Write in the Brief's language.

- Open with the situation, conflict, evidence, or direct answer.
- Use permitted first person for framing, navigation, and source-grounded judgment or recommendation when `narrativePerspective` allows it.
- Require supplied author evidence for first-person process claims, actual product use, observed results, failures, decision trails, and lived experience.
- Put the main action before broad context.
- Give each paragraph one governing thought.
- Replace evaluations with demonstration.
- Put limitations beside the advice they qualify.
- Use keywords only for meaning and keep key-phrase placement natural.
- Give the product one concrete job instead of making it the article's hero.
- Preserve source links and qualifications.
- Add a reader-facing link only to support a claim, open a primary source, or continue the useful action. Never write to a link quota.
- Suggest media only when it shortens explanation or adds proof.

Allowed temporary markers:

- `[VERIFY: claim-id]` for a specific claim that still needs source verification;
- `[EVIDENCE NEEDED: description]` for missing real evidence;
- `[MEDIA: purpose, format, alt]` for an actionable media request.

Every marker must state the next action.

### 9. Self-review

Confirm that every section advances the useful action; the title promise is delivered; no fact or experience is invented; preflight preceded drafting; permitted authorial first person is preserved; every experiential first-person span has evidence; prohibited claims are absent; qualifications are adjacent; product coverage is proportional; headings scan; the differentiation contract remains intact; production language is isolated; key phrase placement is natural and totals 2–4; every reader link has a real purpose; and all markers appear in the handoff.

Perform a local reader-language self-review. Rewrite or remove anything that requires knowledge of the internal pipeline; the independent `cold-reader-review` gate occurs only after final integration.

Do not duplicate the full `edit-article` pass or start `visual-storytelling` before `chief-editor-review`.

## Automatic mode

Ask no questions.

1. If critical information is missing, return `blocked` without plausible filler.
2. If preflight is `REQUIRED`, return an empty `draftMarkdown` and `nextStage: author_interview`.
3. If `RECOMMENDED`, preserve permitted authorial first person, use local safe fallbacks for unsupported experiential spans, and retain opportunities and a warning.
4. Remove or weaken optional unsupported claims and list them.
5. Exclude future features presented as current.
6. Return `EDITORIAL_CONFLICT` instead of silently changing a mismatched title or reader contract.
7. Keep internal labels outside reader copy.
8. Never publish.

## Output

For `structure`, return status, normalized working Brief, preflight, section structure with evidence needs, and only material missing inputs.

For `draft`, return status, full reader Markdown, and a handoff to `edit-article` containing used and qualified claims, excluded claims, the transient author voice metadata, preflight and first-person permissions, used author evidence, unused opportunities, translated or excluded production inputs, unresolved markers, media candidates, warnings, and blockers.

For `automatic`, return:

```yaml
status: ready | blocked
draftMarkdown: |
  ...
usedClaims: []
qualifiedClaims: []
excludedClaims: []
authorContributionPreflight:
  authorshipMode: NEUTRAL | NAMED_EXPERT | NAMED_PRACTITIONER | REVIEW_CASE | ORGANIZATION
  narrativePerspective: FIRST_PERSON | NEUTRAL | ORGANIZATIONAL | THIRD_PERSON
  authorContributionExpected: true | false
  authorEvidenceStatus: DEMONSTRATED | AVAILABLE_NOT_INTEGRATED | ABSENT | NOT_REQUIRED
  decision: REQUIRED | RECOMMENDED | NOT_NEEDED
  firstPersonPermissions: []
  opportunities: []
  preDraftAuthorQuestions:
    - id: PDQ001
      briefAnchor: "..."
      plannedSection: "..."
      question: "..."
      frameBasis: AUTHOR_LANGUAGE | SOURCE_LANGUAGE | NEUTRAL_RECONSTRUCTION
      presuppositionCheck: PASS | FAIL
      unlocksFirstPersonPermission: "..."
      fallback: KEEP_CURRENT_TEXT | REPHRASE | CUT | AMEND_BRIEF
  fallback: KEEP_CURRENT_TEXT | REPHRASE | CUT | none
productionOnlyInputs: []
unresolvedMarkers: []
warnings: []
blockers: []
qa:
  keywordUsedOnlyForReaderMeaning: true | false
  primaryKeyPhraseInH1: true | false
  primaryKeyPhraseInOneH2: true | false
  primaryKeyPhraseOccurrences: 0
  primaryKeyPhraseNatural: true | false
  productionLanguageIsolated: true | false
  coldReaderPass: true | false
  authorContributionDecisionExplicit: true | false
  permittedAuthorialFirstPersonPreserved: true | false
  firstPersonEvidenceBounded: true | false
nextStage: edit_article | author_interview | none
```

When `blocked`, leave `draftMarkdown` empty if writing would require invention or violate the Brief. Every completed draft goes to `edit-article`; media work waits until after `chief-editor-review`.

## Do not

- Write for everyone or open with a generic definition.
- Invent facts, figures, quotes, links, cases, or personal experience.
- Treat a named author or voice profile as experiential evidence.
- Turn a planned result into a guarantee or a future feature into a current one.
- Treat marketing copy as proof.
- add product coverage where the product performs no reader job.
- Write to keyword density, fixed link density, or target length.
- Exceed four uses of the primary reader-facing key phrase or break grammar to insert it.
- Leak query, Brief, audit, corpus, MCP, schema, or status metadata into reader copy without reader need.
- Hide missing evidence behind adjectives such as “effective,” “convenient,” or “innovative.”
- End with an empty summary; give a next action, choice, or honest limit.
