---
name: final-integration-check
description: Verify a chief-editor-locked article package after visual planning or media integration and before a context-free final reader review or CMS mutation. Use when final reader Markdown, a media manifest, captions, alt text, author and publisher metadata, SEO fields, and a proposed CMS draft payload must be checked together for semantic lock, claim consistency, real asset availability, privacy, accessibility, responsive readability, internal markers, and draft-only publication boundaries. Return a minimal reader-surface dispatch package for cold-reader-review or a precise blocker. Do not reopen editorial strategy without cause, create assets, mutate CMS, or publish.
---

# Final integration check

## Purpose

Audit the assembled article as one reader package and prepare an exact CMS draft payload. Confirm that text, media, captions, metadata, and publication boundary preserve the chief-editor meaning lock.

This is an integration check, not another open-ended editing pass.

## Responsibility

`final-integration-check`:

- compares final reader Markdown with the chief-editor lock;
- verifies real integrated assets against the media manifest;
- aligns claims across text, image, caption, and `alt`;
- checks markers, links, privacy, accessibility, and mobile behavior;
- validates trust surface and the proposed CMS payload;
- returns a `ready` integration handoff and minimal reader-surface package for `cold-reader-review`, or a precise owner and blocker.

It does not change the reader promise, argument, section order, or claim without cause; create a missing visual; substitute illustration for proof; read or mutate CMS; create a draft; change a Suggested Topic; or publish.

## Inputs and priority

Use:

1. `ready` chief-editor decision log and `lockedMeaning`;
2. locked reader Markdown and snapshot;
3. Article Brief and claim permissions;
4. `visual-storytelling` handoff with annotated draft, media manifest, production status, and deferred visuals;
5. real local assets or verifiable URLs;
6. captions, `alt`, source-of-truth, and privacy decisions;
7. author and publisher metadata snapshot and byline intent;
8. proposed CMS draft payload, including the H1 decision;
9. mode: `text-only`, `integrated`, or `automatic`.

Priority: explicit user correction, chief-editor lock and Article Brief, verified source or real asset, claim permissions and product state, visual handoff, proposed payload, model assumption.

Return a changed media claim or payload to the correct owner. Never update the lock silently.

## Modes

- `text-only`: check a package without new visual assets. Return `ready` only when the user explicitly deferred visuals or all required visual roles are fulfilled by editable Markdown or HTML artifacts.
- `integrated`: check final Markdown with every real integrated asset.
- `automatic`: ask no questions; defer optional missing visuals, block on missing required proof, and never create assets or mutate CMS.

Infer mode from production status and integrated assets when unspecified.

## Process

### 1. Verify the lock

Compare title, useful action, reader, scope, product role, and section order with `lockedMeaning`. Compare snapshot or enumerate post-lock deltas. Allow only typo, format, and integration changes that do not alter meaning. Require a chief-editor amendment and affected reruns for a semantic delta.

Do not use final integration to improve the opening or reorder sections by preference.

### 2. Build final inventory

Count and record H1, H2, H3, prose paragraphs, lists and items, Markdown or HTML tables, blockquotes, code fences, reader links and destinations, media references, captions, `alt`, internal markers, and reader-facing key phrase placements. Keep reader scope separate from service sections and handoff.

### 3. Verify the media manifest

For every visual ID confirm:

- placement exists in final Markdown;
- the asset exists and uniquely matches the manifest;
- role, format, and authenticity match;
- source of truth is available;
- current and future product states are honest;
- caption carries the takeaway and qualification;
- `alt` provides a semantic equivalent rather than duplicating the caption;
- privacy and permissions pass;
- desktop and mobile variants or responsive behavior have been checked;
- filename, format, size, and path are suitable for handoff.

Only a real source may be `proof`. Mockups, stock, and generated illustrations never receive that status.

### 4. Handle deferred visuals

Classify:

- `required`: without it, the reader promise or evidence fails;
- `optional`: it improves explanation or pace, but text stands alone;
- `deferred_by_user`: the user explicitly postponed production.

A missing required asset blocks `ready`. An optional or user-deferred visual does not block a text-only package when reader Markdown contains no `[MEDIA: ...]` marker and its production brief remains outside copy.

### 5. Run cross-surface claim checks

Compare every claim repeated in body copy, in-image text or UI, caption, `alt`, description, and SEO metadata. Number, qualification, time state, causal direction, and commercial disclosure must agree. Return any stronger unsourced visual claim to visual integration.

### 6. Verify reader cleanliness

Final reader Markdown must contain no `[VERIFY: ...]`, `[EVIDENCE NEEDED: ...]`, `[MEDIA: ...]`, audit IDs, decision comments, service headings, target query as a production object, CMS schema or status instructions, or production-story narration without an independent reader purpose.

Do not perform the final cold-reader review inside this skill. Prepare its package from reader-visible material only: title, reader Markdown or rendered page, visible author and publisher surface, inline media, captions, `alt`, and reader-facing links. Exclude the Article Brief, sources, claim permissions, author profile, state, audit reports, decision log, IDs, expected verdict, and fixes. Do not reopen locked prose without an integration reason.

### 7. Verify trust surface

From supplied metadata check author relation and display name, intended byline, required bio or disclosure, commercial relationship with a recommended product, honest publish and update dates, and required publisher, contact, or methodology surfaces.

Before CMS handoff, validate the relation payload only. Do not claim rendered byline or page layout has been checked before a private preview exists. Keep it as a post-handoff human check.

### 8. Prepare the CMS draft payload

Use approved inputs only:

- collection;
- name;
- `status: draft`;
- content and `contentIncludesH1`;
- description;
- author, category, and tag relations;
- approved real media IDs;
- SEO component;
- fields that must remain unset;
- Suggested Topic ID and expected current status.

Never guess slug, canonical URL, publish date, keywords, or image IDs. Do not duplicate H1 or remove it without a verified presentation decision.

### 9. Assign blocker ownership

- semantic or contract drift → `chief_editor_review`;
- evidence or claim gap → `audit_eeat` or `research`;
- missing or wrong asset → `visual_storytelling` or media production;
- caption, `alt`, privacy, or mobile defect → `visual_storytelling`;
- payload or schema uncertainty → read-only preflight in `cms_draft_handoff`;
- preview typography or byline rendering → post-handoff `human_review`.

Never repair another layer silently.

## Readiness gates

Return `ready` only when the final package matches the meaning lock; inventory is complete and markers are absent; all required assets are real and verified or omitted under an approved text-only contract; captions, `alt`, privacy, and available-scope mobile behavior pass; claims align across surfaces; trust payload is honest; CMS payload is complete, draft-only, and contains no model guesses; a clean cold-reader dispatch package is complete; no publication occurred; and `nextStage` is `cold_reader_review`.

Return `blocked` when semantic drift, required proof, privacy, inaccessible assets, unresolved markers, or payload conflict cannot be repaired within integration scope.

## Output

```yaml
status: ready | blocked
mode: text-only | integrated | automatic
lock:
  sourceSnapshot: "..."
  finalSnapshot: "..."
  semanticMatch: true | false
inventory:
  h1: 0
  h2: 0
  h3: 0
  paragraphs: 0
  lists: 0
  tables: 0
  codeFences: 0
  links: 0
  media: 0
visuals:
  productionStatus: complete | partial | deferred_by_user | not_needed
  requiredReady: true | false
  manifest: []
  deferred: []
qa:
  claimsAligned: true | false
  markersRemoved: true | false
  linksValid: true | false
  captionsReady: true | false
  altReady: true | false
  privacySafe: true | false
  mobileCheckedInAvailableScope: true | false
  trustPayloadReady: true | false
  cmsPayloadDraftOnly: true | false
cmsDraftPayload:
  collection: "..."
  fields: {}
  contentIncludesH1: true | false
  expectedUnsetFields: []
  suggestedTopicId: null
coldReaderDispatch:
  title: "reader-visible title only"
  readerMarkdown: "reader-visible Markdown only"
  visibleAuthorPublisher: []
  mediaCaptionsAlt: []
  readerLinks: []
  forbiddenProductionInputsOmitted: true | false
postHandoffHumanChecks: []
warnings: []
blockers: []
nextStage: cold_reader_review | chief_editor_review | visual_storytelling | research | blocked
```

Return reader Markdown, media manifest, and human-readable report beside the package.

## Do not

- Perform new editorial work without a semantic or integration cause.
- Call a planned or missing asset integrated.
- Treat a generated visual as proof.
- Leave production markers in the CMS payload.
- Invent metadata or publication fields.
- Claim private-preview rendering was checked before draft creation.
- Run the independent cold-reader review in this context or leak production inputs into its dispatch package.
- Read or mutate CMS, change Suggested Topic, or publish.
