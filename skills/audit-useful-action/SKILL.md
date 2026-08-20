---
name: audit-useful-action
description: Define the text's useful action in the reader's world and verify that the title, opening, sections, examples, product block, and conclusion lead to the promised change. Use as a required independent gate after edit-article, or when choosing an angle, checking an Article Brief, or making a focused commercial-copy revision. Do not replace full editing, paragraph or evidence audits, or change the editorial contract without explicit approval.
---

# Audit the useful action

## Purpose

Answer: “What becomes better for this reader after the text?” State the answer in the reader's world as a testable promise that controls the title, structure, evidence, examples, and next action.

A useful action is not a topic or reason to publish. It is an observable change: the reader understands a situation better, makes a decision, completes an action, avoids an error, becomes more capable, or receives an intentionally promised emotional effect.

## Boundaries

- Audit one macro level: the promised reader change and each semantic unit's contribution to it.
- Do not rebuild the article when formulation or focused repair is enough.
- Do not perform full `edit-article` work on style, syntax, or rhythm outside the diagnosed problem.
- Do not replace `audit-paragraph-structure` or audit facts beyond the useful-action dependency.
- Never invent evidence or change the approved reader, situation, promise, scope, or product role.
- Never publish or hand content to CMS without a separate request.

If a stronger useful action requires a contract change, return `EDITORIAL_CONFLICT` and propose the smallest Article Brief amendment.

## Inputs and priority

Use:

1. explicit user correction;
2. approved Article Brief;
3. verified primary source or real asset;
4. editorial policy and brand system;
5. text and working notes;
6. model assumption.

Minimum inputs are the text or source material, known reader and situation, and the Article Brief when one exists. Useful additions include search intent and scope, claim permissions and sources, product role, and target next action.

## Modes

- `formulate`: define the useful action before drafting or revision; when several are plausible, show how each changes title and structure.
- `audit`: inspect completed copy without editing; return a useful-action map and focused recommendations.
- `rewrite`: repair only units marked `rewrite` or `remove`, then rerun the complete audit.
- `automatic`: ask no questions; make only safe inferences; return `ready` or `blocked`; remove optional weak claims instead of inventing support.

## Working formula

Use one sentence:

> For **[specific reader]** in **[trigger or constraint]**, help them **[understand, decide, do, choose, avoid, or feel a specific change]** through **[material, method, or artifact]**, without promising **[important boundary]**.

Also record reader, situation, current obstacle, change, artifact or decision, next action, and non-goal. Do not require a numeric metric when success is recognizable through a decision, artifact, or action.

## Separate action from publishing motive

Weak formulations live in the author's or company's world: tell what happened, demonstrate expertise, advertise a product, announce a release or discount, list features, or express an opinion.

Move them into the reader's world:

1. Who can use this?
2. In which specific situation?
3. What can that person understand, decide, do, choose, avoid, or feel?
4. How can they recognize the change?
5. Which evidence, method, or tool makes it possible?

Repeat “How does this help the reader?” until the answer no longer describes the author's interest or the product's existence.

## Process

### 1. Fix the contract

Extract reader, situation, promise, subject, scope, product role, claims, and target next action from the Article Brief. Mark any recovery without a Brief as a working hypothesis.

### 2. Define the reader-world change

Complete the formula. Confirm that the action belongs to the reader, is more specific than “learn,” matches situation and intent, is achievable through one text, and does not turn possibility into guarantee.

### 3. Check promise surfaces

Verify that the title names the problem, change, or path; the opening explains who needs it and when; the result matches the Brief; and the reader can see which decision, action, or artifact they will gain.

### 4. Inventory semantic units

Audit separately:

1. title;
2. opening;
3. every section;
4. every independent example;
5. product block;
6. conclusion and CTA.

Give each unit one primary contribution:

- `action`: enables an action;
- `decision`: helps select or reject an option;
- `evidence`: supports or verifies a conclusion;
- `constraint`: exposes a limitation or error;
- `orientation`: provides a necessary map;
- `emotion`: delivers the promised emotional value;
- `transition`: connects necessary stages.

Topical relevance is insufficient. A unit must change action, decision, understanding, or confidence, or be a necessary transition.

### 5. Apply the skeptic test

For each weak unit ask what changes after it, why that matters in this situation, which choice or action it enables, and what material makes that possible. Clarify a necessary dependent unit; rewrite or remove a unit with no answer.

### 6. Inspect special zones

- An example must provide a transferable reasoning pattern, decision, or applicability boundary—not showcase the author or product.
- A product block must begin with the reader's difficulty or decision, explain where the product helps, and state when another tool is better. A feature, release, price, or discount is not the useful action.
- A conclusion must return to the promised change and next action, not merely summarize or promote the author.

### 7. Assign status

- `pass`: necessary contribution without excess promise;
- `rewrite`: contribution is needed but author-centered, abstract, or hidden;
- `remove`: no reader change and no necessary transition;
- `blocked`: contribution requires critical evidence or a Brief change.

### 8. Rerun coverage

After any rewrite, audit every unit again. The gate is incomplete until title, opening, every section, every example, product block, and conclusion have final statuses.

## Readiness gates

Return `ready` only when reader and situation are defined; the useful action lives in the reader's world; success is recognizable; title and opening promise it honestly; every unit contributes; examples transfer action or reasoning; the product block stays within applicability boundaries; the conclusion returns to change and next action; claims remain permitted and supported; and the Article Brief was not changed silently.

## Output

Return status `ready`, `blocked`, or `EDITORIAL_CONFLICT`; useful-action statement; reader-world versus author-world diagnosis; complete coverage counts; strong units; every `rewrite`, `remove`, or `blocked` unit; and next action.

Use stable IDs `UA01`, `UA02`, and so on in the full map:

| ID | Unit | Reader situation | Reader change | Contribution | Artifact or decision | Status | Action |
| --- | --- | --- | --- | --- | --- | --- | --- |

For `automatic`, return:

```yaml
status: ready | blocked
usefulAction: "..."
readerWorld: true | false
coverage:
  title: "1/1"
  lead: "1/1"
  sections: "N/N"
  examples: "N/N"
  productBlocks: "N/N"
  conclusion: "1/1"
rewritten: []
removed: []
blockers: []
warnings: []
nextStage: draft_article | edit_article | chief_editor_review | blocked
```

Never leak audit IDs or internal comments into publish-ready Markdown.

## Do not

- Treat a topic, query, product feature, discount, or publishing motive as useful action by itself.
- Add a synthetic “benefit” sentence to every paragraph.
- Promise an outcome the text cannot deliver.
- Mechanically remove necessary context, transitions, or qualifications.
- Substitute status or emotional value when the Brief promises a practical result.
- Hide a Brief conflict behind smoother wording.
