---
name: edit-article
description: Edit, audit, shorten, or polish an existing article or long-form draft from meaning and evidence through structure, tone, sentences, words, and rhythm. Use for manual review and automatic article pipelines in any language when a draft must remain faithful to an approved Article Brief, claim permissions, sources, product state, and assigned author voice, or when internal keyword, Brief, audit, MCP, schema, validation, or workflow language has leaked into reader copy. Do not use to invent an article from a topic or publish it.
---

# Edit an article

Turn a complete draft into an honest, useful version. Check the reader task, meaning, and evidence before structure, tone, and language. Do not polish copy that fails its promise.

## Responsibility

`edit-article`:

- compares the draft with the approved Article Brief;
- checks facts against permissions and sources;
- fixes meaning, structure, tone, sentence, word, and rhythm problems;
- returns clean reader Markdown for required independent editorial audit or a precise blocker.

It does not invent missing experience, data, quotes, or links; silently change the reader, promise, scope, or product role; turn a future feature into a current one; send content directly to CMS; or publish.

## Inputs and priority

Use:

1. a `ready` Article Brief;
2. the `audit-content-library` `pre-brief` report and differentiation contract;
3. the draft and handoff directly from `draft-article`, including media candidates;
4. a `ready` `authorVoiceHandoff` from `load-author-voice` when voice was applied or is required;
5. claim permissions: `allowed`, `qualified`, `future`, `prohibited`;
6. sources and evidence;
7. editorial policy;
8. mode: `audit`, `rewrite`, or `automatic`.

When the Brief contains a target keyword, also obtain the approved grammatically natural reader-facing key phrase. Do not assume the literal query is suitable reader wording.

If the Brief is missing, recover the smallest safe context from the text and request: reader, useful action, channel, register, and evidence. In manual mode, ask at most two critical questions. In automatic mode, ask none and follow blocker rules.

Do not read CMS for author voice. The voice profile controls voice and language only; it is not a source of facts, experience, claims, or permission to change the Brief. A Brief-approved `FIRST_PERSON` perspective permits authorial framing, navigation, and source-grounded judgment or recommendation; it does not prove personal experience.

## Production language and reader language

Separate:

- `reader-facing`: situation, action, evidence, material limitation, natural terminology, and useful next step;
- `production-only`: keyword and query metadata, volume and difficulty, owned jobs, differentiation and collision labels, corpus and audit details, Brief fields, claim IDs, gate and status names, MCP and schema methods, resolver metadata, and validation timestamps.

Keep production information for traceability outside reader Markdown. Edit the decision into reader language instead of copying internal wording. A production term is valid only when it is genuinely the article's subject or needed for the reader's action.

First person does not make a service report reader-facing. Rewrite from the reader's situation before applying an allowed author voice.

## Fixed decisions

Without explicit permission, do not change:

- the approved title and promise;
- useful action and target reader;
- search intent and scope;
- claim status and required qualification;
- current versus future product state;
- product role;
- required evidence links, actual destinations, media identifiers, or technical values.

You may remove a repeated or decorative reader link if the claim, source of truth, and traceability remain intact. Internal labels are not fixed reader wording: replace or remove them when their function survives outside reader Markdown.

Return `EDITORIAL_CONFLICT` when a required correction would change the editorial contract.

## Modes

- `audit`: diagnose and prioritize without returning a full rewrite.
- `rewrite`: return final edited reader Markdown and key decisions.
- `automatic`: run every pass, ask no questions, and return a `ready` or `blocked` package.

If unspecified, a review request means `audit`; an editing request means `rewrite`.

## Readiness

Return `ready` only when the text delivers the useful action and title promise, stays in scope, uses only allowed or correctly qualified claims, does not depend on invented evidence, preserves product state, contains no internal markers or unjustified production language, preserves the differentiation contract, and is ready for independent editorial audit.

Return `blocked` when the title promises an unsupported result; a key section requires invented experience, data, quotation, or case; the Brief and a primary source conflict on a critical fact; a necessary feature is `future` or `prohibited`; the fix requires changing the editorial contract; or a critical `[VERIFY]` remains.

Remove or weaken optional unsupported claims and record them in warnings.

## Editing passes

Work from macro to micro. After sentence-level edits, verify that compression did not damage meaning.

### 1. Reader task and promise

Compare the draft with the Brief. Confirm that the reader recognizes the situation, can complete the useful action, receives the title and opening promise, and is not given a description of the topic instead of help. Remove unpromised side articles.

Fix this level before word choice.

### 2. Evidence and claims

Check every number, date, quote, URL, product feature, causal statement, and result.

- Keep `allowed` within source limits.
- Put a `qualified` limitation beside the claim.
- Never describe `future` as available now.
- Remove `prohibited`.
- Verify an unknown claim with an allowed primary source or return a blocker.

Distinguish demo from real case, capability from guarantee, correlation from causation, product goal from released feature, and planning range from search-engine requirement. Keep internal claim IDs outside reader copy.

Audit links by function:

- keep links that support a specific claim, open a primary source, or continue the useful action;
- do not treat link count or density alone as spam;
- keep direct support near important figures, quotes, changing facts, and disputed claims;
- remove repeated links, neighboring link chains, and links without reader value;
- reduce visual link clusters by shortening anchors, removing secondary proof paragraphs, or moving detail to the research record;
- never meet a numeric link target at the expense of evidence.

### 3. Remove service language

First read only reader Markdown. For each suspicious span, determine its source, whether the object matters to the reader, and the smallest action.

| Span | Source | Reader need | Action |
| --- | --- | --- | --- |
| Literal query or keyword | Search metadata | Only if naturally meaningful | Rephrase or remove |
| Brief, gate, audit, corpus, collision | Editorial process | Only in an article about that work | Convert to a reader question or ordinary action |
| MCP method, schema, enum, check date | Verification record | Only in a technical guide about it | Keep the verified result; move the method to handoff |
| “I checked,” “we audited,” “the workflow routes” | Production voice | Only if the check itself helps the reader | Rewrite or remove |

Do not use a blacklist mechanically. `schema` may belong in an API guide and `brief` in an editorial guide. Judge the article subject and the span's function.

When leakage appears in a heading, table, or diagram, rewrite labels across the artifact. If removal changes the promise or a required fact, return `EDITORIAL_CONFLICT`; if only internal terminology changes, edit without blocking.

### 4. Structure

- Every section advances the action, proves a claim, or exposes a limitation.
- Headings reveal the article's reasoning without body copy.
- A promised step-by-step format remains consistent.
- A time range never replaces the action name.
- Remove repetition, detours, and SEO sections without a reader job.
- Keep product coverage proportional to product role.
- Move media opportunities into `mediaCandidates` without starting production.

Prefer `Step 1 (35 mins): Choose a topic worth writing about` to an actionless heading such as `Minutes 115–155`.

### 5. Primary key phrase placement

Check placement separately from meaning and density:

- H1: one natural use;
- exactly one H2: one natural use;
- body: at most two additional natural uses;
- entire reader scope: 2–4 total;
- exclude URLs, metadata, service sections, alt text, code blocks, and handoff;
- do not assign the same quota to secondary keywords.

Check naturalness before count. Preserve the approved reader-facing phrase when the literal query is ungrammatical. If H1 or H2 cannot be fixed without changing the promise, return `EDITORIAL_CONFLICT`.

### 6. Tone

Preserve the Brief's language, register, and narrative perspective. Respect constraints, avoid shame or instruction from above, do not promise easy success, and keep honest limitations visible. Preserve assigned author voice when it does not reduce precision.

Do not add `I` to a service paragraph. Reframe from the reader's situation. When the Brief approves a verified named author's `FIRST_PERSON` perspective, retain or use first person for authorial framing, navigation, and source-grounded judgment or recommendation. Require evidence for personal process, actual use, observed results, failures, decision trails, or lived experience; repair only that span instead of neutralizing the article.

### 7. Sentences

- Put people and actions in grammatical control.
- Split sentences that carry too many independent ideas.
- Prefer active voice when the actor matters.
- Remove tangled participial and serial constructions.
- Put conditions and limitations beside the action.
- Preserve exact technical wording.

### 8. Words

- Replace bureaucratic abstraction with concrete action.
- Remove intensifiers without evidence.
- Explain unfamiliar jargon.
- Replace evaluation with fact, example, or demonstration.
- Keep and explain a difficult term when the reader needs it.

### 9. Rhythm

Read aloud or simulate it. Vary sentence length, combine needless fragments, split monotonous long constructions, repair paragraph transitions, and avoid telegraphic prose.

### 10. Model-shaped draft patterns

Remove patterns that make the text generic: repeated “not X but Y,” question and immediate obvious answer, identical triads, pseudo-profound conclusions, stock openings, uniform paragraphs, restated claims, excessive hedging, and invented citations. Punctuation, correctness, or clear structure alone is not evidence of model authorship.

### 11. Editorial QA

Recheck title, opening, and conclusion against the useful action; actual owned job against the differentiation contract; absence of literal-query insertion and production voice; primary key phrase placement; all claim permissions, links, and qualifications; current and future features; media candidates and anchors; internal markers; Markdown and frontmatter; and any fact introduced during editing.

Run a final cold-reader pass. `ready` is impossible if a span makes sense only after reading the Brief, an audit report, CMS schema, or handoff.

## Marker handling

- Verify `[VERIFY: claim-id]`; block if critical and unverifiable, otherwise remove the optional claim.
- Fill `[EVIDENCE NEEDED: ...]` only from real input; otherwise remove the unsupported claim or keep a warning outside reader copy.
- Remove `[MEDIA: ...]` from reader Markdown and preserve its anchor and purpose in `mediaCandidates` for `visual-storytelling` after `chief-editor-review`.
- Never replace a marker with plausible invention.

## Automatic mode

1. Ask no questions.
2. Run every pass from macro to micro.
3. Remove optional unsupported claims and list them.
4. Preserve required qualifications.
5. On a critical conflict, return `blocked`, the last safe draft, and a precise reason.
6. Do not change the Article Brief.
7. Do not publish or start the visual phase.

## Output

For `audit`, return status, a brief diagnosis, prioritized findings with exact spans and minimal fixes, and only questions that cannot be resolved without the author or a contract decision.

For `rewrite`, return status, final reader Markdown, 3–7 key editing decisions, and unresolved critical questions.

For `automatic`, return:

```yaml
status: ready | blocked
editedMarkdown: |
  ...
keyChanges: []
removedClaims: []
qualifiedClaims: []
mediaCandidates: []
unresolvedMarkers: []
warnings: []
blockers: []
qa:
  promiseDelivered: true | false
  primaryKeyPhraseInH1: true | false
  primaryKeyPhraseInOneH2: true | false
  primaryKeyPhraseOccurrences: 0
  primaryKeyPhraseNatural: true | false
  claimsCompliant: true | false
  scopeCompliant: true | false
  differentiationContractPreserved: true | false
  productStateCorrect: true | false
  internalMarkersRemoved: true | false
  productionLanguageIsolated: true | false
  coldReaderPass: true | false
  permittedAuthorialFirstPersonPreserved: true | false
  experientialFirstPersonEvidenceBounded: true | false
nextStage: independent_editorial_audit | none
```

When blocked, keep the last safe version in `editedMarkdown` if it cannot be mistaken for a ready article.

## Do not

- Change meaning for smoothness or invent evidence.
- Dry out useful detail and examples.
- Replace an author's voice with neutral corporate prose without cause.
- Remove honest limitations to strengthen a promise.
- Add product properties absent from the Brief.
- Edit toward keyword density, fixed link density, or arbitrary word count.
- Confuse the 2–4 key-phrase placement rule with a density target.
- Keep query, Brief, audit, corpus, MCP, schema, or validation language in reader copy merely for traceability.
- Treat any editorial rule as stronger than usefulness, accuracy, and natural rhythm.
