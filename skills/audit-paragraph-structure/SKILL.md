---
name: audit-paragraph-structure
description: Audit and rewrite paragraph, list, and table structure in articles, documentation, essays, and technical prose. Use as a required independent gate after edit-article, or whenever every paragraph must be checked for one governing thought, scanability, informative openings, sufficient development, and clean endings, while lists remain linked, parallel, ordered, grouped, and non-repetitive. Preserve approved meaning, claims, sources, and author voice. Do not use for article strategy, new research, or publishing.
---

# Audit paragraph structure

Check the text at the level of semantic blocks so a reader can scan the material, select the relevant part, and understand each paragraph without searching adjacent blocks for its subject.

This is a narrow independent gate after `edit-article`. The Article Brief, macrostructure, and claim permissions already exist. It does not replace `draft-article`, `edit-article`, or `visual-storytelling`, and it never changes shared reader Markdown directly.

## Responsibility

`audit-paragraph-structure`:

- inventories every prose paragraph and proves complete coverage;
- checks one governing task, opening, development, and ending per paragraph;
- splits mixed thoughts and joins dependent fragments;
- audits scanability through first sentences;
- checks list linkage, parallelism, order, grouping, and repetition;
- checks tables as repeated-field structures;
- rewrites only failing units;
- returns corrected copy and an external audit manifest.

It does not change the Brief, reader, promise, intent, or product role; rebuild the full article; invent evidence; verify claims without an allowed source; add visuals; publish; or force uniform length and three-part form on every paragraph.

## Inputs and priority

Use the text, Article Brief and explicit corrections, claim permissions and sources, editorial policy and channel rules, and mode: `audit`, `rewrite`, or `automatic`.

Priority: explicit user correction, approved Brief, verified source, editorial policy, current text, model assumption.

## Units

- prose paragraph: continuous prose between blank lines;
- list lead: sentence or paragraph that establishes the list's grammar and meaning;
- list item: one homogeneous unit;
- table: repeated fields checked both as a whole and by row;
- code block: reproducible material, not a paragraph; audit only its surrounding explanation;
- heading: navigation, not a paragraph; verify that the first block fulfills it.

Assign stable external IDs: `P001` for paragraphs, `L001` for lists, and `T001` for tables. Never insert IDs into reader Markdown or invent new internal markers.

## Modes

- `audit`: inspect every unit and return a manifest without rewriting.
- `rewrite`: inspect every unit, repair only failures, and return copy plus manifest.
- `automatic`: ask no questions, run the full process, and return `ready` or `blocked`.

If unspecified, “check the paragraphs” means `audit`; “check and fix” means `rewrite`.

## Paragraph gates

### 1. One governing thought

State the paragraph topic in one short sentence. Every sentence must develop it, provide evidence, expose a limit, or derive an action.

Split when the subject materially changes, an independent claim appears, an exception needs its own argument, or an aside hides a thematic break. Merge adjacent paragraphs when the second has no independent topic and only continues an unfinished sentence, argument, or enumeration.

### 2. Informative opening

Imagine the reader sees only the first sentence. Prefer an opening that names the paragraph's subject and decision. Pronouns and conjunctions are not mechanically forbidden, but repair `this`, `that`, `it`, `however`, or `but` when the reader must search backward to find the topic. A transition may open the paragraph when it also names the new subject.

### 3. Development

After the topic, provide only the support the reader needs: mechanism, evidence, example, condition, limitation, or consequence. Remove a restated thesis. Move a useful sentence that belongs to another paragraph.

### 4. Ending

For a complex technical or abstract paragraph, test:

`topic or claim → development → conclusion or action`

The final sentence should answer “what follows?” without repeating the opening. Do not add a ceremonial ending to a complete one- or two-sentence paragraph.

### 5. Visual weight and rhythm

Use no word-count limit. Judge weight relative to neighboring blocks, idea complexity, and medium. Split a heavy paragraph only at a real thought boundary. Do not create random short fragments or make every paragraph equal.

### 6. Section fit

Confirm that the paragraph fulfills the nearest heading and does not duplicate information already gathered elsewhere. Consolidate a scattered topic or explicitly separate distinct aspects.

## List gates

Check six properties:

1. homogeneity: every item answers one question and belongs to one category;
2. lead linkage: the lead plus any item forms one grammatical and semantic whole;
3. parallelism: items serve the same syntactic role and, where helpful, begin with the same part of speech and key term;
4. sequence: order follows action, time, priority, dependency, or another explicit logic;
5. grouping: a long list uses categories that help the reader act;
6. repetition: common wording moves to the lead or subheading unless repetition preserves clarity.

Do not turn unrelated paragraphs into a list or create decorative groups.

## Table gates

Treat a table as a list with repeated fields. Rows must compare on one axis; column headings must stand alone; values within a column should use parallel form when it aids scanning; row order must be clear or explained; every row and column must support comparison or decision; and nearby prose must not repeat the entire table.

## Process

### 1. Fix the contract

Record reader, useful action, title, scope, claims, and product role. Return `EDITORIAL_CONFLICT` when the problem requires changing them.

### 2. Build the inventory

Walk reader Markdown top to bottom. Assign every paragraph, list, and table an ID. Record the nearest heading and first 6–12 words for each paragraph.

### 3. Run a scan pass

Read only headings, first sentences, lists, and tables. Confirm that the reasoning and required actions remain findable without linear reading.

### 4. Audit every paragraph

For every `P-ID`, record topic, result (`pass`, `rewrite`, `split`, `merge`, `move`, `remove`, or `blocked`), exact reason, action, and corrected text in rewrite mode. Never combine several similar paragraphs into one audit row.

### 5. Audit every list and table

Run the relevant gates for every `L-ID` and `T-ID`, including lead, parallelism, order, grouping, and repetition.

### 6. Repair minimally

Keep passing blocks unchanged. Preserve facts, links, qualifications, technical values, and author register in every repair. Track ID changes such as `P014 → P014a + P014b` or `P021 + P022 → P021`.

### 7. Repeat the scan pass

After repairs, reread headings, first sentences, lists, and tables. Verify that topics appear early and block order is understandable.

### 8. Prove coverage

Compare found and checked counts. `ready` requires 100% coverage, with code and service handoff explicitly excluded.

## Statuses

Return `ready` only when every prose paragraph has a manifest row; every list and table has a separate audit; mixed ideas are split and dependent fragments joined; openings support scanning; changes preserve Brief and claims; and reader Markdown contains no audit IDs or internal markers.

Return `blocked` only when repair requires a contract change, invented evidence, removal of a required qualification, or an author decision between incompatible meanings. Length and style preference alone never block.

## Output

For `audit`, return status, found and checked counts, excluded units, a complete paragraph manifest, a complete list and table manifest, and critical blockers.

For `rewrite`, also return corrected reader Markdown without IDs and a change log.

Manifest forms:

| ID | Anchor | First words | Topic | Result | Reason or action |
| --- | --- | --- | --- | --- | --- |

| ID | Anchor | Type | Result | Gates and action |
| --- | --- | --- | --- | --- |

For `automatic`, return:

```yaml
status: ready | blocked
editedMarkdown: |
  ...
coverage:
  proseFound: 0
  proseChecked: 0
  listsFound: 0
  listsChecked: 0
  tablesFound: 0
  tablesChecked: 0
paragraphManifest: []
structureManifest: []
changes: []
warnings: []
blockers: []
qa:
  fullCoverage: true | false
  oneTopicPerParagraph: true | false
  scanPassClear: true | false
  listsParallel: true | false
  claimsPreserved: true | false
  internalIdsRemoved: true | false
nextStage: chief_editor_review | edit_article | blocked
```

## Do not

- Split at random for visual lightness.
- Force equal paragraph size or formal conclusions.
- Ban conjunctions or pronouns without context.
- Treat a short paragraph as incomplete by length alone.
- Mix the audit manifest into reader Markdown.
- Restyle the whole article for a local problem.
- Replace editorial judgment with a mechanical rule.
