---
name: audit-eeat
description: Audit an article's claim support, demonstrated first-hand experience, expertise depth, author and publisher trust surface, and author-only evidence gaps without assigning an E-E-A-T score. Use as an independent gate after edit-article, especially for named-author, review, case-study, advice, comparison, YMYL, AI-assisted, or first-person content. Distinguish a required evidence interview from a non-blocking recommended interview that would add concrete author contribution or information gain, route gaps to research, structure, rephrasing, deletion, or interview, and produce traceable patches only from supplied answers. Do not invent experience, credentials, sources, metrics, biographies, or ranking claims.
---

# Audit E-E-A-T evidence

## Purpose

Test whether the text has earned its claims and authorial confidence. Separate demonstrated experience from asserted experience, route every gap to its real owner, and decide separately whether an author answer is required for evidence or merely recommended for concrete contribution and information gain.

Run as an independent gate after `edit-article` and before `chief-editor-review`. Never change shared reader Markdown. Return an external audit or a minimal patch set that only the chief editor may apply.

Do not calculate an E-E-A-T score. Audit exact claims, spans, sources, trust conditions, and unresolved actions.

## Boundaries

- Audit Experience and Expertise visible in body copy.
- Audit Authoritativeness and Trust only from supplied page and publisher metadata, sources, and disclosures.
- Identify tacit knowledge missing from the text without supplying it for the author.
- Distinguish evidence necessity from author-contribution opportunity. Evidence-safe named-author copy may still be too generic for its promised perspective.
- Do not replace `edit-article`, `audit-tone-honesty`, or external fact-checking.
- Treat a voice handoff only as a voice-drift constraint for a proposed patch, never as evidence of biography, experience, credentials, or claims.
- Do not read CMS, search results, Linear, prior audit reports, or external services during the independent pass.
- Do not change the Article Brief, CMS, Suggested Topic, status, or publication state.

Return `EDITORIAL_CONFLICT` when honest repair requires changing the title, promise, reader, scope, product role, or mandatory claim.

## Inputs and priority

Use a clean package:

1. approved Article Brief and explicit amendments;
2. current reader Markdown after `edit-article`;
3. claim permissions and complete allowed source bundle;
4. page and publisher metadata snapshot when trust surface is in scope;
5. approved `authorVoiceHandoff` and Brief-approved narrative perspective when applied;
6. a supplied corpus or search summary only when prepared by another stage;
7. author answers only for `patch` or rerun;
8. desired interview language;
9. authorship intent: neutral reference, named-expert explanation, practitioner view, review, case, or column;
10. mode: `audit`, `interview`, `patch`, or `automatic`.

Priority: explicit user correction, approved Brief, verified primary source or real artifact, editorial policy and permitted voice handoff, reader Markdown and author answers, model assumption.

Read [references/rubric-and-sources.md](references/rubric-and-sources.md) completely when applying Google guidance or YMYL calibration. Read [references/output-contracts.md](references/output-contracts.md) completely for field and patch contracts.

## Modes

- `audit`: run S0–S6 and applicable regression checks without questions or copy changes; return claim inventory, evidence findings, experience profile, trust findings, routed gaps, and explicit interview decision.
- `interview`: use active `AUTHOR_ONLY` gaps and chief-editor-approved contribution opportunities; prepare at most seven real questions and ask one at a time in an interactive session.
- `patch`: use only supplied author answers, accepted `REPHRASE` or `CUT` decisions, and approved opportunities; return exact `REPLACE`, `INSERT_AFTER`, `INSERT_BEFORE`, or `DELETE` operations without applying them.
- `automatic`: ask no questions. `REQUIRED` returns questions, `blocked`, and `nextStage: author_interview`; `RECOMMENDED` returns `ready`, non-blocking questions, and `nextStage: chief_editor_review`.

If unspecified, an evidence or E-E-A-T check means `audit`; author questions mean `interview`; applying answers means `patch`.

## Core distinctions

### Three layers

- `L1 — body evidence`: claims, reasoning, sources, examples, demonstrated experience, and expertise in reader Markdown.
- `L2 — trust surface`: byline, bio, dates, methodology, disclosures, contactability, and publisher context outside body copy.
- `L3 — author-only knowledge`: decisions, records, failures, limits, and observations not yet in the article.

Missing L2 input is not automatically a text defect. Return `MISSING_INPUT` and a separate collection task.

### Asserted and demonstrated experience

- `FIRST_HAND_ASSERTED`: the text says the author did or saw something, but removing “in my experience” leaves no testable detail.
- `FIRST_HAND_DEMONSTRATED`: the text shows a specific instance, artifact, configuration, observation, measured value, failed attempt, boundary condition, or decision trail.

Treat Brief-permitted authorial framing, article navigation, and source-grounded judgment or recommendation as authorial voice, not as an experiential claim, unless the exact span says the author personally did, used, saw, achieved, failed, decided, or lived through something. Evaluate that experiential assertion normally when it appears.

Demonstration does not prove the event occurred. Record provenance: `source_linked`, `artifact_supplied`, `author_answer`, `in_text_only`, or `unknown`. Specific unsupported detail may be `specificityTheatre`. Credentials, tenure, title, and confident tone are not evidence by themselves.

### Required and recommended interview

- `REQUIRED`: a load-bearing claim, promised experience, or reader decision cannot remain honest without an author-only instance, record, observation, failure, boundary, or decision trail, and no safe fallback preserves the Brief.
- `RECOMMENDED`: current claims are evidence-safe, but named authorship, first-person advice, review or case framing, or a material product relationship creates a reasonable expectation of distinctive contribution; a concrete answer would improve exact spans.
- `NOT_NEEDED`: an interview would not change the useful action or any exact span, would add only bio or credentials, would ask the author for researchable facts, or the article already demonstrates sufficient relevant contribution.

`RECOMMENDED` does not imply false copy and never blocks `ready`. It is an editorial originality decision, not a way to “increase E-E-A-T.”

## Process

### S0. Calibrate the bar

Determine topic domain, page purpose, reader decision, potential harm, `ymylLevel: NOT_YMYL | MAY_BE_YMYL | CLEAR_YMYL`, minimum evidence kinds for load-bearing claims, where experience is required or irrelevant, `authorshipMode`, whether the promise expects distinctive author contribution, and applicable L2 trust conditions.

Do not require every page to demonstrate all four dimensions equally. Trust is central; evidence requirements depend on topic and purpose.

### S1. Extract atomic claims

Walk top to bottom. For every independently testable statement record stable ID `EE001` onward, exact verbatim span and section anchor, type (`FACTUAL`, `STATISTICAL`, `CAUSAL`, `EXPERIENTIAL`, `ADVICE`, `PREDICTIVE`, or `COMPARATIVE`), `loadBearing`, `riskIfWrong: NONE | MINOR | COSTLY | DANGEROUS`, and `duplicateOf` when applicable.

Split multi-claim sentences into separate records, allowing overlapping spans. Exclude pure transitions, CTAs, and production commentary. Include definitions when they carry the article's answer or are disputable. Process long articles by H2 while preserving global IDs and coverage.

### S2. Audit evidence inside the package

For every claim:

1. list evidence kinds actually present;
2. link exact support spans, source IDs, or artifact IDs;
3. assign `MEETS_BAR`, `UNDERSUPPORTED`, `UNSUPPORTED`, `INTERNALLY_CONTRADICTED`, or `OVERSTATED`;
4. give the minimum `defensibleVersion` for `OVERSTATED` without adding facts;
5. mark `hedgeStacking` and `specificityTheatre`;
6. apply the asserted-versus-demonstrated test and provenance to experiential claims.

Never use model knowledge as an undeclared source. A link proves citation presence, not source support, unless its content is supplied.

### S3. Profile experience and expertise

Inventory exact spans showing practice quantities, negative results, boundary conditions, process detail, relevant physical observations, time anchors, changed mind with reason, counter-consensus reasoning, and artifact references.

List liabilities separately: credential drop, consensus echo, empty transition, universal hedge, fake-experience framing, and precise detail with unknown provenance.

Return `expertiseDepth: SURFACE | WORKING | PRACTITIONER | SPECIALIST` and `experienceVerdict: DEMONSTRATED | CLAIMED_ONLY | ABSENT | NOT_REQUIRED`, using only the supplied package. Without a supplied corpus or search summary, return `informationGain: UNKNOWN` and candidate differentiators only.

Evaluate author contribution separately: decision trail, failure, trade-off, boundary, actual product use, changed mind, or artifact-backed process detail. First person alone does not improve the verdict.

### S4. Audit the trust surface

Use only supplied metadata. For every applicable field return `PASS`, `FAIL`, `MISSING_INPUT`, or `NOT_APPLICABLE`, with one concrete action on `FAIL`.

Check content creator clarity; topic-relevant bio when expected; verifiable identity or standing when decision-relevant; honest publish and update dates; source accessibility and quality; methodology for original tests, rankings, statistics, or comparisons; conflict disclosure before it affects a decision; contactability and publisher responsibility; human attribution and creation context when automation materially affects reader understanding; and safety or professional-review boundaries for relevant YMYL content.

Do not require boilerplate disclaimers or AI disclosure by label alone. Judge reader expectation and materiality.

### S5. Route gaps

For every gap record exact anchor, source IDs, missing evidence, severity, owner, minimum action, and fallback.

- `AUTHOR_ONLY`: the author's records, observations, failures, decisions, or boundaries;
- `RESEARCHABLE`: an external fact or source check;
- `STRUCTURAL`: byline, metadata, methodology, disclosure, or publisher surface;
- `REPHRASE`: a weaker defensible claim keeps the value;
- `CUT`: the optional claim is not worth rescuing.

Prefer `REPHRASE` when a weaker claim remains useful and `CUT` for optional unsupported text. Do not ask authors to perform research. Keep at most seven active `AUTHOR_ONLY` gaps and defer the rest. For `CLAIMED_ONLY`, create a direct gap for instance, rephrase, or removal. Do not demand experience when S0 says it is not required and the text makes no experiential claims.

### S5b. Decide on author contribution

Return `authorContribution.decision` before writing questions.

Use `REQUIRED` only for a critical `AUTHOR_ONLY` gap without a Brief-preserving `REPHRASE` or `CUT` fallback.

Use `RECOMMENDED` only when all are true:

1. named author, practitioner or review intent, first-person advice, or material product relationship exists;
2. the text passes evidence without author answers, using safe local fallbacks when needed, but contribution is absent, `CANDIDATE_ONLY`, `UNKNOWN`, or generic `WORKING` explanation; permitted authorial first person alone does not satisfy or trigger this condition;
3. at least one exact anchor can gain an unsearchable instance, decision, failure, trade-off, boundary, changed mind, actual use, or artifact;
4. the answer changes reader understanding, decision, or action rather than adding voice or biography.

Otherwise use `NOT_NEEDED` and explain why. Do not recommend interviews by quota or byline alone.

Keep contribution opportunities separate from gaps. Each uses stable ID `OPP001`, exact `anchor`, kind, reader benefit, question, and fallback `KEEP_CURRENT_TEXT`. No answer must not reduce the current evidence status.

### S6. Prepare the author interview

Ground the frame of every question. Separate source- or author-confirmed actions, stages, roles, and terms from model-synthesized hypotheses. When a frame is hypothetical, first recover what actually happened, what went in, what the person or system did, what came out, where a limit appeared, and how completion was judged. Use author language or neutral everyday terms, never audit IDs or invented taxonomy.

If the author says the question is unclear or its premise is false, discard the frame and reformulate once from an observable event.

Every question must be unsearchable, ask for one instance, record, number, failure, boundary, or changed decision, permit a short answer, avoid repeating the article, change a specific span, use `required: true | false`, link exactly one `fillsGapId` or `fillsOpportunityId`, and have a grounded `frameBasis` and passing presupposition check.

Use contract fields exactly: `anchor`, `fillsGapId`, `fillsOpportunityId`, and `OPP001`. Required questions use fallback `REPHRASE` or `CUT`; recommended questions use `KEEP_CURRENT_TEXT`. Never ask for tenure, generic trust, or a personal anecdote without a span-level purpose.

In an interactive session, ask one question at a time by severity per effort. Allow at most one follow-up for a vague answer. Accept the fallback when the author does not know.

### S7. Build a traceable patch

Every operation must include the exact original anchor, operation, new text, `sourceAnswerId`, exactly one `gapId` or `opportunityId`, and rationale.

Use only author answers and accepted source, gap, or contribution decisions. Preserve approximation and uncertainty; do not add credentials or generalizations; put detail beside the affected claim; use fallback for thin answers; leave unrelated spans unchanged; avoid padding; preserve language, register, and formatting.

### S8. Run regression

Compare original text, proposed patch, and answers. Extract every new claim, link it to an answer or accepted decision, flag untraceable insertions as `HALLUCINATED_INSERTION`, flag unsupported first-person experience as `FABRICATED_EXPERIENCE`, recheck hollow markers, padding, voice drift, affected claims, and all dimension verdicts.

Do not repair fabrication with another automatic round. Return `blocked` and `nextStage: chief_editor_review`. Limit interview and patch cycles to three rounds.

## Readiness gates

Return `ready` only with complete claim coverage; every load-bearing and high-risk claim meets the calibrated bar; no unverified specificity theatre; no trust-dependent `CLAIMED_ONLY` experience; required L2 conditions pass or have an accepted owner; no critical `AUTHOR_ONLY`, `RESEARCHABLE`, or `STRUCTURAL` gaps; `RECOMMENDED` includes concrete opportunities and remains non-blocking; any patch is traceable; the Brief, claims, qualifications, and voice are preserved; and reader Markdown contains no audit IDs or production notes.

Return `blocked` for critical missing sources, artifacts, metadata, or author answers; a required contract change; or fabricated or untraceable patch content. Do not block on an optional claim that can be cut or weakened, or on a `RECOMMENDED` interview.

## Output

For `audit`, return a short verdict, coverage, dimension verdicts, and the full manifest from [references/output-contracts.md](references/output-contracts.md). For `interview`, return only active gaps or approved opportunities, up to seven questions, and fallbacks. For `patch`, return patch set and regression report—not a rewritten article.

For `automatic`, return:

```yaml
status: ready | blocked
mode: automatic
contextBar:
  experienceRequired: true | false
  authorshipMode: NEUTRAL | NAMED_EXPERT | NAMED_PRACTITIONER | REVIEW_CASE | ORGANIZATION
  narrativePerspective: FIRST_PERSON | NEUTRAL | ORGANIZATIONAL | THIRD_PERSON
  authorContributionExpected: true | false
claimCoverage: "N/N"
sectionCoverage: "N/N"
claimManifest: []
evidenceFindings: []
experienceProfile: {}
authorContribution:
  decision: REQUIRED | RECOMMENDED | NOT_NEEDED
  blocking: true | false
  rationale: "..."
  opportunities: []
trustSurface: []
gaps: []
authorQuestions: []
recommendedAuthorQuestions: []
patchSet:
  edits: []
  followUps: []
regressionFindings: []
dimensionVerdicts: []
warnings: []
blockers: []
qa:
  fullClaimCoverage: true | false
  criticalClaimsMeetBar: true | false
  assertedExperienceResolved: true | false
  authorContributionDecisionExplicit: true | false
  provenanceExplicit: true | false
  trustInputsHandled: true | false
  patchTraceable: true | false
  briefPreserved: true | false
  internalIdsOutsideReaderMarkdown: true | false
  interviewFramesGrounded: true | false
  permittedAuthorialFirstPersonPreserved: true | false
nextStage: chief_editor_review | author_interview | research | edit_article | blocked
```

## Do not

- Optimize an E-E-A-T score, keyword density, or ranking promise.
- Treat quality-rater guidance as a ranking formula.
- Invent authors, credentials, first-hand experience, customers, sources, metrics, dates, quotes, or artifacts.
- Treat numeric precision as provenance.
- Treat permitted authorial first person as either demonstrated experience or an automatic reason to request an interview.
- Ask the author for researchable public facts.
- Add biography for authority signaling.
- Turn every page into a case study or require experience when the reader decision does not need it.
- Use `experienceRequired: false` as an automatic reason for `NOT_NEEDED`; evaluate contribution separately.
- Recommend an interview without exact reader spans and concrete reader benefit.
- Ask about model-invented stages or categories as if they were real.
- Leak manifest, gap, or source IDs into reader Markdown.
- Publish or mutate CMS.
