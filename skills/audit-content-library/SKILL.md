---
name: audit-content-library
description: Audit the current library of published content before an Article Brief is fixed and again before chief-editor review. Use for every new or materially revised article when read-only Flexim access or a complete CMS export must reveal semantic overlap, cannibalization risk, gaps, stale or competing drafts, update or consolidation opportunities, and internal links. Return an evidence-linked overlap report and differentiation contract. Do not mutate articles, CMS, or the editorial contract.
---

# Audit the content library

## Purpose

Determine which independent reader job a proposed article should own in the current content portfolio, then prove that the completed text kept that role. Compare reader situations, intent, useful action, scope, evidence, and product role—not keywords alone.

Run twice for every article:

1. `pre-brief`, before the Article Brief is approved;
2. `pre-chief-editor`, after `edit-article` and before `chief-editor-review`.

## Responsibility

`audit-content-library`:

- inventories every published post and active draft separately;
- finds nearest content by reader, situation, intent, useful action, scope, evidence, and product role;
- reads the complete Markdown of every plausible neighbor;
- distinguishes wording similarity from competition for the same reader job;
- recommends new content, differentiation, update, consolidation, internal linking, or deferral;
- creates a differentiation contract for the Article Brief;
- keeps corpus terms, IDs, overlap labels, and contract fields `production-only`, while writing separate plain-language reader handoffs;
- checks the edited article against that contract and a fresh corpus snapshot;
- returns exact entry IDs and anchors as evidence.

It does not mutate or publish records, change the Article Brief or article promise, treat an old post as current primary evidence for a product claim, infer search demand without supplied data, replace the other editorial gates, expose production labels as reader wording, or recommend consolidation from a shared keyword alone.

## Inputs and priority

Use in this order:

1. explicit user corrections;
2. current published CMS corpus and active drafts;
3. proposed topic, Suggested Topic, or approved Article Brief;
4. edited reader Markdown for `pre-chief-editor`;
5. verified search or performance data when supplied;
6. editorial policy, taxonomy, and internal-link rules;
7. model assumptions.

Titles, descriptions, and SEO metadata are shortlist signals only. Decide overlap from complete Markdown.

## Modes

- `pre-brief`: locate the proposed article in the portfolio; return a decision, differentiation contract, exclusion zones, and internal-link plan.
- `pre-chief-editor`: compare the actual edited article with published neighbors, active drafts, and the differentiation contract; return exact drift and the smallest editor action without rewriting.
- `automatic`: ask no questions; infer phase from whether reader Markdown is supplied; return `ready` or `blocked` without inventing a missing corpus.

## Corpus sources

Flexim is recommended but not mandatory.

### Read-only Flexim

1. Call `list_content_types` and identify the actual post collection.
2. Call `get_content_type` and verify title or name, slug, status, content, description, SEO metadata, dates, and relations.
3. Query every published record using pagination until complete.
4. Query active drafts separately.
5. Record ID, title, slug or URL, status, description, metadata, dates, and a short preview for every entry.
6. Build a plausible-neighbor shortlist.
7. Fetch the complete entry for every shortlisted item. A query preview is never sufficient.
8. Record collection, filters, check time, counts, page coverage, IDs, and `updatedAt` values in `corpusSnapshot`.

Allowed operations are read-only schema, query, listing, and full-entry reads. Never call create, update, delete, upload, publish, or topic-status mutations.

### Complete CMS export

When Flexim is unavailable, accept a complete export only if it contains:

- every published record in scope and active drafts separately;
- stable record identity, status, full Markdown, title, URL or slug, and relevant dates;
- collection and export provenance;
- export time and evidence that pagination or batching is complete.

Return `blocked` if full content, statuses, or coverage cannot be established. A partial folder of articles is not a complete corpus merely because it is local.

## Comparison model

For the candidate and every close neighbor, normalize:

- reader and situation;
- search intent and question;
- useful action or outcome;
- scope and exclusions;
- structure and promised form;
- evidence and information gain;
- product role;
- next step and internal-link role;
- freshness and current product state.

Classify overlap:

- `lexical`: similar language, distinct reader job;
- `topical`: shared subject, distinct useful action;
- `partial-job`: one article covers a meaningful subset of the same action;
- `same-job`: same reader, situation, action, and promise;
- `duplicate`: substantially the same job, scope, evidence, and form.

Do not call normal topical adjacency cannibalization. Search cannibalization risk requires meaningful competition for the same intent and outcome, not just related terms.

## `pre-brief` process

### 1. State the proposed owned job

Write one internal sentence:

> For **[reader in situation]**, help them **[complete action]** within **[scope]** using **[distinct evidence or form]**.

Treat it as a hypothesis until compared with the corpus.

### 2. Shortlist and read neighbors

Use titles, descriptions, metadata, taxonomy, and previews only to shortlist. Read complete Markdown for every plausible collision and for pages that could provide or receive an internal link.

### 3. Build the overlap map

For each neighbor record exact supporting anchors and compare reader, situation, intent, useful action, scope, evidence, product role, and next step. State what overlaps, what differs, and whether the difference is visible to a reader before choosing a recommendation.

### 4. Choose a portfolio decision

- `create-new`: the article owns a distinct job and evidence.
- `differentiate`: the article is useful but needs explicit boundaries.
- `update-existing`: an existing page already owns the job and should be improved.
- `consolidate`: multiple pages split one job without a useful distinction.
- `internal-link-only`: the need is already served; improve navigation instead.
- `defer`: evidence, demand, or portfolio value is insufficient.

Do not default to new content.

### 5. Write the differentiation contract

Define:

- `owns`: exact reader job the article owns;
- `mustCover`: essential questions and evidence;
- `mustNotDuplicate`: neighboring jobs, sections, and claims to avoid;
- `uniqueEvidence`: evidence or examples that make the article additive;
- `collisionRule`: the observable condition that would make the draft compete with a named page;
- internal-link handoffs in both production and reader language.

An internal-link handoff must name source and destination roles, placement anchor, reader reason, natural anchor direction, and whether the destination is published. Never link readers to a private draft.

### 6. Hand off to the Article Brief

Keep corpus IDs, labels, and reasoning in production fields. Transfer only the decision, owned job, boundaries, must-cover evidence, collision rule, and reader-language internal-link plan into the Brief.

## `pre-chief-editor` process

### 1. Refresh the corpus

Create a new snapshot. Include newly published posts, changed pages, and active drafts. Never reuse the old snapshot as current state without checking.

### 2. Recover the article's actual job

Read only title and reader Markdown first. Infer actual reader, situation, promise, useful action, scope, evidence, product role, and next step. Do not copy the intended job from the Brief.

### 3. Compare actual and contracted roles

Check whether the draft:

- still owns the contracted job;
- entered a neighbor's exclusion zone;
- dropped unique evidence;
- widened into a generic overview;
- repeats another page's structure or conclusion;
- creates a clear, honest link handoff;
- contains corpus or audit language that should remain production-only.

### 4. Return a verdict

- `pass`: role and boundaries hold;
- `narrow`: remove a specific overlapping span;
- `reposition`: actual job drifted and needs a chief-editor contract decision;
- `update-existing`: the draft should become an update rather than a new page;
- `verify`: corpus freshness or one exact comparison is incomplete;
- `blocked`: a critical portfolio conflict cannot be resolved within audit scope.

Give exact reader anchors and the smallest chief-editor action. Do not edit the article.

## Readiness gates

Return `ready` only when corpus coverage is complete and evidenced, published items and drafts are separate, every plausible neighbor has been read in full, comparisons use reader jobs rather than keywords alone, the portfolio decision is supported, the differentiation contract or final verdict is precise, and production language is isolated.

Return `blocked` when corpus completeness, record status, full neighboring content, or a critical identity is unavailable; when several pages are ambiguous and cannot be distinguished; or when the proposed job cannot be defined without changing an approved Brief.

Missing optional search-volume data is a warning, not a blocker. Never invent it.

## Output

Return a human report with status and phase, corpus coverage and snapshot, proposed or actual owned job, 3–7 nearest pages, overlap level and reason, portfolio decision or final verdict, differentiation contract, internal-link handoffs, warnings, blockers, and `nextStage`.

For `automatic`, return:

```yaml
status: ready | blocked
phase: pre-brief | pre-chief-editor
corpusSnapshot:
  source: flexim | cms_export
  collection: "..."
  checkedAt: "ISO-8601"
  publishedFound: 0
  publishedInventoried: 0
  draftsFound: 0
  pagesChecked: 0
  fullEntriesRead: []
candidate:
  title: "..."
  proposedOwnedJob: "..."
  actualOwnedJob: "..."
nearestPosts: []
overlapMap: []
decision: create-new | differentiate | update-existing | consolidate | internal-link-only | defer
differentiationContract:
  owns: "..."
  mustCover: []
  mustNotDuplicate: []
  uniqueEvidence: []
  collisionRule: "..."
internalLinkHandoffs: []
readerLanguageHandoffs: []
draftVerdict: pass | narrow | reposition | update-existing | verify | blocked
warnings: []
blockers: []
qa:
  corpusInventoryComplete: true | false
  draftsCheckedSeparately: true | false
  shortlistedFullTextRead: true | false
  readerJobCompared: true | false
  snapshotFresh: true | false
  articleBriefPreserved: true | false
  productionLanguageIsolated: true | false
nextStage: article_brief | chief_editor_review | update_existing | consolidation_review | blocked
```

Use empty values for phase-inapplicable fields. Never invent them.

## Do not

- Compare titles, slugs, or keywords alone.
- Treat a preview as complete text.
- Call every topical neighbor cannibalization.
- Recommend a new article by default.
- Link readers to a draft or unavailable page.
- Reuse old claims without current primary evidence.
- Copy corpus-report language into reader Markdown.
- Rewrite the article inside the audit.
- Mutate CMS even when a duplicate is obvious.
