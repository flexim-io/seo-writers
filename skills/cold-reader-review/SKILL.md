---
name: cold-reader-review
description: Review a finished article as a fresh reader with no production context. Use after final-integration-check and before a final package or private CMS draft when a clean agent must judge title promise, comprehension, coherence, useful action, visible product honesty, media, and leaked internal language. See only reader-visible surfaces; do not fact-check, edit, read repositories or CMS, inspect an Article Brief, or publish.
---

# Review an article as a cold reader

## Purpose

Decide whether a person who has never seen the production workflow can understand and use the finished article. This is a final reader-comprehension gate, not an evidence audit or another editorial rewrite.

## Responsibility

`cold-reader-review`:

- reads only the final reader-visible surface in a fresh isolated context;
- checks the title promise, reader situation, coherence, useful action, language, visible product honesty, media, and reader-facing links;
- reports only reader-visible defects with exact anchors and the smallest upstream owner;
- returns `ready` or `blocked` without changing reader Markdown.

It does not fact-check claims, evaluate SEO keywords, compare the Article Brief, inspect corpus overlap, infer hidden intent, edit the article, read a repository or CMS, call external services, authorize a draft, or publish.

## Allowed input

Receive only:

1. final title and reader Markdown, or a rendered reader page;
2. visible author and publisher surface, including byline and disclosures actually shown to readers;
3. inline media, captions, `alt` text, and reader-facing links;
4. visible callouts, tables, code, and other reader-visible elements;
5. mode: `review` or `automatic`.

Do not receive the Article Brief, target query, keyword metrics, corpus audit, sources, claim permissions, author profile, workflow state, prior drafts, audit reports, decision ledger, internal IDs, expected verdict, or proposed fixes.

Do not read the repository, CMS, Linear, browser history, hidden handoffs, or external systems. The coordinator must provide a self-contained surface package. If any forbidden production context is present, return `blocked` and identify the package leak without using the context to judge the article.

## Modes

- `review`: inspect the supplied reader surface and return a concise external report.
- `automatic`: ask no questions; return `ready` or `blocked` from the visible surface only.

## Process

### 1. Confirm isolation

Confirm that the package contains only allowed reader-visible material. Do not infer missing facts from what a Brief, source, or audit might have said.

### 2. Read as an unfamiliar person

Read the title, then the article top to bottom. Treat visible author, publisher, media, captions, `alt`, and links as part of the same reader experience.

### 3. Test the visible result

Check whether:

- the likely reader and situation are understandable from the text;
- the opening and body deliver the title's promise;
- each section follows from the prior one and the conclusion gives a usable next action, choice, or honest limit;
- examples, explanations, and terms are sufficient for a reader who lacks production context;
- product framing is honest on its face, including visible limits and commercial relationship where material;
- media and links clarify rather than interrupt or conceal a gap;
- internal process language, markers, IDs, or unexplained production terms have not leaked into the article.

Do not verify facts, sources, product status, author biography, or claims that are not visible and checkable inside the supplied surface. Report only that a reader cannot understand, apply, or trust a visible statement; never invent a factual correction.

### 4. Route the smallest repair

- title, promise, argument, section, example, or reader-action defect → `chief_editor_review`;
- media, caption, `alt`, visual placement, or asset-comprehension defect → `visual_storytelling` or `final_integration_check`;
- leaked internal marker or visible packaging defect → `final_integration_check` unless meaning must change.

After any reader-visible repair, require final integration and a new fresh cold-reader review. A prior report cannot be reused for a changed reader surface.

## Readiness

Return `ready` only when isolation is intact and the visible package lets the intended reader understand the situation, receive the title promise, follow the reasoning, take the promised useful action, understand product framing and media, and read without production knowledge.

Return `blocked` when forbidden context leaked into the reviewer package or a reader-visible defect materially prevents comprehension, promise delivery, coherent action, honest visible framing, or media understanding.

Minor preference alone is not a blocker. Do not manufacture a finding because the review is required.

## Output

```yaml
status: ready | blocked
mode: review | automatic
surfaceCoverage:
  title: true | false
  readerMarkdown: true | false
  visibleAuthorPublisher: true | false
  mediaAndAlt: true | false
  readerLinks: true | false
isolation:
  cleanContext: true | false
  forbiddenContextDetected: []
findings:
  - anchor: "exact reader-facing span or visible element"
    kind: title_promise | comprehension | coherence | useful_action | language | product_honesty | media | production_leakage
    readerFailure: "what an unfamiliar reader cannot understand, decide, or do"
    severity: BLOCKER | MAJOR | MINOR
    minimumAction: "smallest repair"
    owner: chief_editor_review | visual_storytelling | final_integration_check
qa:
  readerSituationInferable: true | false
  titlePromiseDelivered: true | false
  coherentWithoutProductionContext: true | false
  usefulActionClear: true | false
  productHonestOnFace: true | false
  mediaSupportsComprehension: true | false
  internalLanguageAbsent: true | false
  factsNotVerified: true
warnings: []
blockers: []
nextStage: final_package | chief_editor_review | visual_storytelling | final_integration_check | blocked
```

Keep the report outside reader Markdown. The coordinator records the reviewed final-surface snapshot after receiving the report; do not request or expose that internal identifier here.

## Do not

- Read the Article Brief, sources, audits, state, or earlier drafts.
- Do not read the repository, CMS, Linear, or external services.
- Do not verify facts or search for evidence.
- Do not edit text, create media, mutate a CMS record, or publish.
- Do not call a factual claim false merely because the visible package does not prove it.
