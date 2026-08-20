---
name: audit-tone-honesty
description: Audit and selectively rewrite tone in editorial, technical, marketing, and commercial copy by separating false performance, honest speech, and justified play. Use as a required independent gate after edit-article, or to check invented author voice, production-language leakage, hidden motives, false intimacy, pressure, flattery, shame, unsupported confidence, fabricated stories, honest limits, care, and demonstration. Permit play only inside a clear frame with independent value. Do not replace full editing, fact-checking, E-E-A-T audit, or the Article Brief.
---

# Audit tone honesty

## Purpose

Make the imagined voice in the reader's head match the real speaker, situation, motive, evidence, and relationship.

Distinguish:

- `false`: the voice performs an identity, closeness, emotion, confidence, or disinterest that context does not support;
- `honest`: the speaker talks from a real position, exposes material motive and limits, respects the reader, and demonstrates claims;
- `play`: the speaker performs intentionally inside a frame the reader understands and provides independent emotional value.

False tone is not a list of banned words. Context determines whether the same phrase is honest or false.

## Boundaries

- Act as a separate trust gate after task, evidence, and macrostructure are fixed.
- Repair only spans where voice changes trust or the relationship; do not perform full `edit-article` work.
- Do not redefine the useful action or rebuild paragraph structure without a tone reason.
- Notice false authority or experience signaling, but leave full claim inventory, provenance, gap routing, and interview decisions to `audit-eeat`.
- Never treat calm wording as evidence, invent identity or motive, or change Brief, product role, qualifications, or feature state.
- Never publish or hand content to CMS without a separate request.

Return `EDITORIAL_CONFLICT` when honest wording requires a contract change.

## Inputs and priority

Collect the speaker or organization, channel and format, reader and competence, actual relationship, commercial or personal stake, intended emotion and action, Article Brief, claims, sources, product state, approved `authorVoiceHandoff` when used, and complete text including title, captions, CTA, and relevant disclosures.

Priority: explicit user correction, approved Brief, verified primary source and real channel context, editorial policy and permitted voice handoff, current text, model assumption.

Never infer an unknown biography or motive. Do not read CMS for voice during this independent audit. The supplied voice handoff is not evidence.

## Modes

- `set-tone`: define the tone contract before writing.
- `audit`: inspect the full text and return an external manifest without changing reader Markdown.
- `rewrite`: repair only `rewrite`, `remove`, or `disclose` units, then rerun the complete audit.
- `automatic`: ask no questions; return `ready` or `blocked` without creating a plausible legend for unknown context.

## Tone contract

Record:

- `speaker`: who may say the text;
- `narrativePerspective`: `FIRST_PERSON`, `NEUTRAL`, `ORGANIZATIONAL`, or `THIRD_PERSON` as approved by the Brief;
- `readerRelation`: stranger, customer, subscriber, colleague, community member, or another real relationship;
- `frame`: instruction, technical guide, column, letter, advertisement, show, or another genre;
- `intendedEmotion`: the specific response sought;
- `commercialStake`: what the speaker gains from the reader's decision;
- `evidencePosture`: what is known, interpreted, judged, or unknown;
- `careObligation`: material risk, downside, and poor-fit cases to expose;
- `playMode: none | light | full`;
- `forbiddenMoves`: Brief- and policy-specific restrictions.

Do not simulate an emotion that the evidence and frame cannot support honestly.

## Eleven gates

1. **Identity:** the voice belongs to the real speaker or a clearly declared role. A verified assigned author may use Brief-approved first person for authorial framing, navigation, and source-grounded judgment or recommendation. No invented experience, testimonial, quote, ordinary-user mask, or imitation.
2. **Motive:** material commercial or personal interest is visible before it changes the reader's decision. Avoid ritual disclosure when context already makes the stake clear.
3. **Equality:** treat the reader as capable. No shame, condescension, contempt, novice-shaming, belonging manipulation, or unsupported flattery.
4. **Confidence:** wording strength matches evidence. Separate observation, interpretation, judgment, prediction, and guarantee.
5. **Care:** disclose material difficulty, risk, support cost, and poor-fit cases even when they weaken the sale. Help the reader decide, not merely approach the product.
6. **Natural register:** use words the real speaker would use in this situation. Do not disguise press copy as conversation or formal copy as dialogue.
7. **Emotional pressure:** no artificial urgency, threat, fear, pain, envy, status promise, or guaranteed success without a real basis. State real deadlines or risks with their cause.
8. **Authority and social proof:** expertise requires relevant experience, source, or demonstration. A title, name, statistic, testimonial, or “everyone knows” is not an argument.
9. **Play:** humor, character, hyperbole, and irony fit channel expectations, preserve usefulness, and provide value beyond familiarity.
10. **Product honesty:** introduce the product at a real reader need; show capability, limit, alternative, and human decision ownership proportionally. No unsupported miracle transition.
11. **Production voice:** solve the reader's task rather than narrating production. Keep query metrics, Brief fields, corpus or audit findings, collision labels, gates, MCP or schema methods, raw statuses, and validation timestamps outside reader copy unless the article genuinely teaches them.

A verified product behavior may belong in copy; the internal method used to verify it usually does not. First person does not fix production voice or prove personal product use.

## Diagnostic signals

Look for invented stories or customers; advertising disguised as independent advice; forced emotion, capitals, exclamation, or intensifiers; pain, fear, urgency, shame, or status manipulation; effortless-money or guaranteed-result promises; unearned familiarity; authority in place of evidence; miraculous before-and-after product narratives; fake dialogue; raw production vocabulary; unconditional advice despite exceptions; and compliments that substitute for a criterion or tool.

Directness, imperative voice, strong emotion, conversational language, and money are not false by themselves. Judge function and foundation.

## Honest repair tools

- Verify, narrow, qualify, distinguish judgment from observation, or remove a claim when the speaker is compensating for weak evidence.
- Expose material motive, payment, relationship, prior involvement, or conflict before it affects trust; do not turn disclosure into confession.
- Demonstrate care through a useful boundary, risk check, stop condition, or alternative—not “we care.”
- Replace evaluation with a verifiable example, real interface, source, trade-off, rejection condition, or reproducible method.
- Speak to an equal by preserving necessary complexity, explaining only what matters, offering criteria, and allowing refusal.

## Play modes

- `none`: use when precision dominates, error risk is high, relationship is weak, or entertainment does not support the task.
- `light`: allow a rare metaphor, rhythmic contrast, or gentle irony that clarifies without changing factual status.
- `full`: allow character, plot, hyperbole, or show only when the reader understands and accepts the frame, useful information remains accessible, the play has independent value, the form can be sustained, and commercial action is separate and visible.

Familiarity without independent value is not play.

## Process

### 1. Fix the editorial and tone contracts

Record reader, situation, useful action, promise, claims, product role, restrictions, and the tone contract.

### 2. Inventory the complete surface

Audit title, every prose paragraph, lists, tables, quotes, code comments, standalone examples and stories, product block, CTA, disclosure, and conclusion. Assign stable external IDs `TN001`, `TN002`, and so on; never insert them into reader Markdown.

### 3. Run an imagined-voice cold pass

Read reader Markdown without the Brief or reports. For every unit, identify the apparent speaker, relationship, intended emotion, contract fit, hidden alternate speaker such as press office or SEO operator, and whether the sentence is useful without knowing the production workflow.

Then compare claims and restrictions with the Brief. The Brief controls meaning but does not justify service vocabulary in reader copy.

### 4. Apply the eleven gates

Mark only relevant risks. Do not penalize permitted non-experiential first person merely because it says `I`; audit whether the apparent speaker, relationship, and evidence posture fit the approved perspective. Do not penalize a short technical paragraph because disclosure or play lives elsewhere and context already covers it.

### 5. Inspect high-risk zones

Check the opening for a flattering alliance against a common enemy; stories for reality or clear hypotheticals; expert references for a specific supported conclusion; product coverage for stake, limits, and alternatives; and conclusion or CTA for pressure, false urgency, or status promises.

### 6. Assign status

- `pass`: voice fits the contract;
- `rewrite`: required meaning sounds false, coercive, flattering, or unnatural;
- `disclose`: material motive or relationship must become visible;
- `remove`: the unit exists only for manipulation or valueless play;
- `verify`: voice strength depends on an unsupported claim, story, or authority;
- `blocked`: honest repair requires unknown critical evidence or a Brief change.

### 7. Repair minimally

Preserve facts, links, technical terms, useful action, and author character. Prefer qualification, demonstration, and a clear boundary to generic neutrality.

### 8. Rerun the full audit

Read everything again after repair. Removing pressure in one span must not move false tone into another or destroy rhythm.

## Readiness gates

Return `ready` only when speaker, relationship, frame, and emotion are defined; coverage is complete; no false identity, experience, closeness, or independence remains; confidence matches evidence; material motive is visible; the reader is treated as an equal; product limits and alternatives remain; play mode is justified; claims and Brief are preserved; audit IDs are absent; and every remaining production term has a genuine reader function.

## Output

Return status `ready`, `blocked`, or `EDITORIAL_CONFLICT`; tone contract; `false / honest / play` profile; coverage; trust strengths; every `rewrite`, `disclose`, `remove`, `verify`, or `blocked` unit; and next action.

Use the full manifest:

| ID | Anchor | First words or unit | Imagined voice | Trust function or risk | Result | Action |
| --- | --- | --- | --- | --- | --- | --- |

For `automatic`, return:

```yaml
status: ready | blocked
toneContract:
  speaker: "..."
  readerRelation: "..."
  frame: "..."
  intendedEmotion: "..."
  commercialStake: "..."
  evidencePosture: "..."
  playMode: none | light | full
coverage:
  prose: "N/N"
  lists: "N/N"
  tables: "N/N"
  examples: "N/N"
  productBlocks: "N/N"
toneManifest: []
changes: []
warnings: []
blockers: []
qa:
  motiveVisible: true | false
  readerTreatedAsEqual: true | false
  confidenceQualified: true | false
  careDemonstrated: true | false
  playJustified: true | false
  claimsPreserved: true | false
  internalIdsRemoved: true | false
  productionVoiceAbsent: true | false
  permittedAuthorialFirstPersonPreserved: true | false
  coldReaderPass: true | false
nextStage: chief_editor_review | edit_article | blocked
```

## Do not

- Make honest copy dry by default or treat evidence-backed confidence as false.
- Remove humor and character mechanically.
- Add disclosure to every self-reference.
- Treat first person as proof of author experience or reject it solely because it is permitted authorial voice.
- Allow production language merely because an auditor understands it.
- Perform equality through slang, familiarity, or deliberate errors.
- Turn care into another marketing claim.
- Correct pressure with shame about marketing.
- Require play in technical or high-risk copy.
