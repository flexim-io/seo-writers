---
name: visual-storytelling
description: Plan, brief, audit, and integrate the visual narrative of a chief-editor-approved article or long-form draft. Use after editorial validation when locked text needs meaningful screenshots, diagrams, charts, tables, illustrations, photos, video, code examples, captions, alt text, or production briefs. Turn an approved Article Brief, decision log, and reader Markdown into a minimal evidence-safe media plan, select narrative compositions from the bundled template library, and separate template logic from brand styling. Do not reopen editorial strategy, add decorative images by quota, or fabricate proof.
---

# Visual storytelling

Make media part of the article's argument. Decide which thought is better shown than described, choose an honest format, place it exactly, and prepare the production brief, caption, and `alt` text.

A visual is not a way to break up copy. It must reveal the main idea, prove a claim, explain a system, support comparison, orient the reader in a process, or preserve an important conclusion.

Run only after independent editorial audit and `chief-editor-review`:

`Article Brief → draft-article → edit-article → independent editorial audit → chief-editor-review → visual-storytelling → media production and integration → final-integration-check`

When visual analysis exposes a structural or factual problem, return to `chief-editor-review` instead of hiding it with an image or changing locked text silently.

## Responsibility

`visual-storytelling`:

- finds semantic moments where media is more useful than another paragraph;
- selects the smallest useful set of visuals;
- separates proof, explanation, and illustration;
- applies the same claim permissions to visual statements as to copy;
- creates precise briefs for screenshots, diagrams, charts, illustrations, photos, or video;
- integrates verified assets into locked text with captions and `alt`;
- hands reader Markdown and the media manifest to `final-integration-check`.

It does not add images by word count, generate evidence, invent data or interfaces, decorate weak structure, silently change claims or product role, rewrite locked reader Markdown without a chief-editor decision, or publish.

## Inputs and priority

Use:

1. a `ready` Article Brief;
2. a `ready` chief-editor decision log that confirms meaning, structure, and evidence are locked;
3. locked reader Markdown after accepted changes and gate reruns;
4. media candidates and anchors from `draft-article` and `edit-article`;
5. claim permissions and sources;
6. available screenshots, data, code, photos, video, and brand assets;
7. production constraints for style, format, size, data lifetime, and privacy;
8. mode: `plan`, `integrate`, `audit`, or `automatic`.

Priority: explicit user correction, approved Brief, chief-editor lock, verified primary source or real asset, editorial and brand system, locked reader Markdown, model assumption.

## Template library

For `plan`, `audit`, and `automatic`, read [references/template-library.md](references/template-library.md) completely before choosing a composition for a designed or generated diagram or illustration. Do not force a template onto a real screenshot, Markdown table, or code block when its native form answers the question better.

The library defines semantic geometry such as sequence, comparison, branching, convergence, qualification, anatomy, and feedback. A Figma frame or brand system defines visual language such as tokens, typography, components, and spacing. Never choose narrative structure only because a stylistically matching frame already exists.

## Modes

- `plan`: build visual logic, media map, and production briefs without creating assets.
- `integrate`: verify finished assets, place them in copy, and write captions and `alt`.
- `audit`: evaluate current media for purpose, truth, placement, accessibility, and style.
- `automatic`: ask no questions; plan and integrate available verified assets; return `ready` or `blocked`.

If unspecified, “where do we need images?” means `plan`; “insert these images” means `integrate`; “check the visuals” means `audit`.

## Visual roles

Give each visual one primary role.

| Role | Job | Suitable formats |
| --- | --- | --- |
| `hook` | Communicate core idea and tone before reading | featured illustration, photo, metaphor |
| `proof` | Support a fact, experience, or product state | real screenshot, photo, document, real-data chart |
| `explain` | Show structure, causality, or process | diagram, flow, timeline, annotated screenshot |
| `compare` | Reveal differences or support a choice | table, bar chart, matrix, before and after |
| `orient` | Show position, order, or next action | map, step tracker, navigation diagram |
| `demonstrate` | Provide a reproducible example | code, input and output, short video, frame sequence |
| `summarize` | Combine several checks or decisions | checklist, cards, decision tree |
| `pace` | Create a pause and support mood | secondary illustration or photo |

`pace` is always optional. Remove it when it merely occupies space.

## Necessity test

Before adding a visual, answer:

1. Which reader question does it answer?
2. What does it communicate faster or more convincingly than text?
3. What meaning, proof, or orientation is lost if it disappears?
4. What is the source of truth?
5. Would plain text, an editable table, or a code block solve the task better?

Add the visual only when answers 1–4 are specific and no simpler format works better. When it repeats the adjacent paragraph, remove the visual or shorten the paragraph.

## Format rules

### Screenshot

Use for a real interface, state, setting, or action result. Show only released functionality; redact personal data, keys, internal URLs, and unpublished material; never draw nonexistent controls into a real screen; label demo data; crop to the relevant region; and keep annotations from covering source values. A generated image cannot replace screenshot proof.

### Diagram

Use for process, system, sequence, hierarchy, or multi-component relationships. Show one primary relationship, label non-obvious arrows with actions, include only sourced entities, and preserve editable text and vector source when possible.

### Chart

Use only for quantitative relationship, distribution, or change over time. State source, period, units, and method; use an honest scale; never chart invented data; label synthetic data only for teaching an interface; and put the takeaway in the caption rather than a marketing slogan.

### Table

Use for exact comparison and repeated fields. Prefer editable HTML or Markdown, make column headings self-contained, do not turn a short list into a table, and avoid duplicating it in prose.

### Code or input and output

Use when readers need to reproduce an action or verify a result. Keep code copyable, identify language and version, state constraints, and remove secrets and real user data.

### Photo or video

Use for physical process, behavior, use context, or a sequence that static explanation cannot cover. Obtain permission for people and private spaces, never call a staged shot documentary proof, and provide a short description or transcript for video.

### Illustration

Use for a featured image, metaphor, emotional entry, or concise summary. Never use it as factual proof, imitate a current product screen, show a future feature as released, or add unsupported customers, metrics, or results. Keep important text editable.

## Select a composition template

For every visual with `production: design` or `generate`:

1. State `readerQuestion` and the exact relationship: sequence, comparison, branching, convergence, qualification, anatomy, feedback, or another type.
2. Select two or three candidates from the library based on that relationship, not visual similarity.
3. Compare semantic fit, evidence needs, content density, and mobile behavior.
4. Choose the best template even when its master is only `planned`. Use `custom` and describe stable layout logic when none fit.
5. List style sources separately. Reuse tokens and components, never narrative geometry unless the reader question matches.

Record:

```yaml
selectedTemplate: Qualification funnel | Evidence funnel | custom | none
templateStatus: ready | planned | custom | not-applicable
relationship: convergence + qualification + redirect
reason: "why this composition answers the reader question"
rejectedTemplates:
  - template: Linear workflow
    reason: "why its relationship distorts or weakens the idea"
adaptation: "which variable elements change without altering the core logic"
styleSources: []
```

Changing text inside an existing layout is not template selection. Reject a layout whose relationship type does not fit even when its style does.

## Process

### 1. Find the narrative spine

State the reader's starting situation, main change after reading, 3–7 article turns, proof required for the promise, and actions that need orientation. Start with the idea, not a medium.

### 2. Find visual beats

Walk top to bottom. Mark only places where readers must see the starting situation, understand a complex relationship, believe a claim, compare choices, reproduce an action, or retain a multi-step conclusion. Treat the featured image as its own beat: it promises topic and tone but need not explain the whole article.

### 3. Build the media map

For every beat record:

| Field | Content |
| --- | --- |
| `id` | Stable ID such as `visual-01` |
| `placement` | Section and exact post-paragraph anchor |
| `readerQuestion` | Question the visual answers |
| `role` | One primary visual role |
| `format` | screenshot, diagram, chart, table, code, photo, video, illustration |
| `content` | Exact visible content |
| `sourceOfTruth` | Asset, data, source IDs, or claims |
| `authenticity` | `evidence`, `illustration`, `mockup`, or `demo` |
| `required` | Whether reader promise depends on it |
| `caption` | Takeaway and source context |
| `alt` | Semantic equivalent without the image |
| `production` | existing, capture, design, generate, record |
| `status` | available, needs-production, needs-permission, blocked |
| `templateDecision` | Selection record or `none` |

### 4. Write production briefs

Each brief must stand alone for a designer or generator. Include one objective, reader context at placement, format and responsive constraints, composition and hierarchy, exact minimal in-image copy in article language, source of truth, forbidden content, available brand rules, caption and `alt`, acceptance criterion, and the preceding `templateDecision`.

For generative assets, add a production prompt. Never ask a model to create proof, exact current UI, an unsupported data chart, or large amounts of text.

### 5. Integrate into the narrative

Place the visual immediately after the claim or instruction it supports; give the reader a reason to look before it; state one takeaway after a complex visual; avoid “image above” without semantic wording; never split a sentence, list, or logical step; align terminology and numbers across text, caption, and asset; keep stable IDs through CMS upload.

For an unfinished asset, use:

```text
[MEDIA: visual-03 | after “Step 4” opening | proof | real redacted screenshot | brief in media manifest]
```

This is production-only and must never reach publication.

### 6. Check accessibility

Write semantic `alt`, not “image of.” Include chart takeaway and key values; explain complex diagrams in nearby text; use empty `alt` for decorative images; do not rely on color alone; verify contrast and mobile text; never put a required instruction only inside an image.

### 7. Run visual QA

Confirm one job per visual, real sources for required visuals, aligned claims across text and media, honest current or future product state, no mockup or generated illustration presented as proof, labeled demo data, protected private data, distinct caption and `alt`, consistent style, template selected by reader question and relationship, separate narrative geometry and style sources, mobile readability, and every unresolved marker in the handoff.

## Claim permissions for media

In-image text, axes, UI labels, captions, and `alt` are part of the article.

- `allowed`: show only within source limits.
- `qualified`: carry the qualification into caption or nearby copy.
- `future`: never show as current UI or available workflow.
- `prohibited`: never use in assets or production prompts.
- unknown: never visualize as fact.

Return `blocked` when the visual inevitably creates a false product or result impression.

## Automatic mode

Ask no questions. Build a minimal map, record `templateDecision` for every designed visual, integrate only available verified assets, keep missing optional assets as `planned`, block on missing required proof, exclude or safely redact privacy risks, return structural placement problems to `chief_editor_review`, and never generate assets or mutate CMS without a separate execution step.

## Output

For `plan`, return status, visual logic, template decisions, media map, complete production briefs, and what should remain text, table, or code.

For `integrate`, return status, annotated draft with real assets or production markers, verified media manifest, and a handoff to `final-integration-check` with assets, claims, sources, qualifications, markers, warnings, and blockers.

For `audit`, return diagnosis, prioritized visual findings, and visuals that already perform their job.

For `automatic`, return:

```yaml
status: ready | blocked
assetStatus: complete | partial | planned
annotatedDraftMarkdown: |
  ...
mediaManifest: []
productionBriefs: []
templateDecisions: []
integratedAssets: []
excludedVisuals: []
unresolvedMarkers: []
warnings: []
blockers: []
qa:
  everyVisualHasPurpose: true | false
  claimsCompliant: true | false
  proofIsAuthentic: true | false
  accessibilityCovered: true | false
  privacySafe: true | false
  templateFitVerified: true | false
nextStage: media_production | final_integration_check | chief_editor_review | none
```

## Do not

- Use an image-per-word-count quota, random stock, or decorative repetition.
- Turn editable tables or code into images.
- Substitute illustration for proof or fabricate screenshots, metrics, testimonials, or before and after results.
- Show future functionality as current.
- Overload the featured image with the whole article.
- Put critical information only in an image or use unreadable mobile text.
- Write empty captions such as “service screenshot.”
- Generate without a source of truth, production brief, and acceptance criterion.
- Clone layout geometry merely because its brand style fits.
