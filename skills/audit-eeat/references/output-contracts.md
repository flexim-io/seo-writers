# Output contracts

## Contents

- [Context bar](#context-bar)
- [Claim manifest](#claim-manifest)
- [Experience profile](#experience-profile)
- [Author contribution](#author-contribution)
- [Trust surface](#trust-surface)
- [Gap report](#gap-report)
- [Author interview](#author-interview)
- [Patch set](#patch-set)
- [Regression report](#regression-report)
- [Complete automatic package](#complete-automatic-package)

Use these contracts as a logical schema. Do not add a runtime or Pydantic dependency unless the project separately requests programmatic orchestration.

## Context bar

```yaml
topicDomain: "narrow topic"
pagePurpose: "reader task"
readerDecision: "decision or action affected"
ymylLevel: NOT_YMYL | MAY_BE_YMYL | CLEAR_YMYL
harmIfWrong: "specific consequence or none"
experienceRequired: true | false
authorshipMode: NEUTRAL | NAMED_EXPERT | NAMED_PRACTITIONER | REVIEW_CASE | ORGANIZATION
narrativePerspective: FIRST_PERSON | NEUTRAL | ORGANIZATIONAL | THIRD_PERSON
authorContributionExpected: true | false
requiredEvidenceKinds: []
requiredTrustConditions: []
```

Set `requiredEvidenceKinds` by claim type rather than one universal bar for the entire article.

## Claim manifest

```yaml
- id: EE001
  sectionAnchor: "exact heading or stable location"
  span: "exact verbatim text"
  type: FACTUAL | STATISTICAL | CAUSAL | EXPERIENTIAL | ADVICE | PREDICTIVE | COMPARATIVE
  loadBearing: true | false
  riskIfWrong: NONE | MINOR | COSTLY | DANGEROUS
  duplicateOf: null
  evidenceKinds: []
  support:
    spans: []
    sourceIds: []
    artifactIds: []
  provenance: source_linked | artifact_supplied | author_answer | in_text_only | unknown
  status: MEETS_BAR | UNDERSUPPORTED | UNSUPPORTED | INTERNALLY_CONTRADICTED | OVERSTATED
  contradictedBy: null
  defensibleVersion: null
  hedgeStacking: false
  specificityTheatre: false
  action: "minimum action"
```

Calculate coverage as `claims audited / claims inventoried`. Report H2 coverage separately so section-by-section processing cannot lose the middle of a long article.

## Experience profile

```yaml
experienceVerdict: DEMONSTRATED | CLAIMED_ONLY | ABSENT | NOT_REQUIRED
expertiseDepth: SURFACE | WORKING | PRACTITIONER | SPECIALIST
positiveMarkers:
  - kind: NEGATIVE_RESULT
    span: "exact span"
    provenance: author_answer
hollowMarkers:
  - kind: FAKE_EXPERIENCE
    span: "exact span"
    action: REPHRASE | CUT | AUTHOR_ONLY
informationGain:
  status: DEMONSTRATED | CANDIDATE_ONLY | UNKNOWN
  items: []
```

Allowed positive `kind` values: `SPECIFIC_QUANTITY`, `NEGATIVE_RESULT`, `BOUNDARY_CONDITION`, `PROCESS_DETAIL`, `SENSORY_PHYSICAL`, `TEMPORAL_ANCHOR`, `CHANGED_MIND`, `COUNTER_CONSENSUS`, `ARTIFACT_REFERENCE`.

Allowed hollow `kind` values: `CREDENTIAL_DROP`, `CONSENSUS_ECHO`, `EMPTY_TRANSITION`, `UNIVERSAL_HEDGE`, `FAKE_EXPERIENCE`, `SPECIFICITY_THEATRE`, `BODY_BIO_PADDING`.

## Author contribution

```yaml
decision: REQUIRED | RECOMMENDED | NOT_NEEDED
blocking: true | false
rationale: "why this page does or does not need an author interview"
currentContribution:
  status: DEMONSTRATED | CANDIDATE_ONLY | ABSENT | UNKNOWN
  spans: []
expectedInformationGain: []
opportunities:
  - id: OPP001
    anchor: "exact reader-facing span"
    kind: ACTUAL_PROCESS | DECISION_TRAIL | FAILURE | TRADE_OFF | BOUNDARY | CHANGED_MIND | PRODUCT_USE | ARTIFACT
    readerBenefit: "what the reader could understand, decide, or do better"
    question: "one un-googleable concrete question"
    fallback: KEEP_CURRENT_TEXT
```

`REQUIRED` always has `blocking: true` and at least one critical `AUTHOR_ONLY` gap. `RECOMMENDED` always has `blocking: false`, at least one concrete opportunity, and does not change the current text's evidence status. `NOT_NEEDED` contains no artificial opportunities.

## Trust surface

```yaml
- condition: methodology
  result: PASS | FAIL | MISSING_INPUT | NOT_APPLICABLE
  evidence: "metadata field or supplied artifact"
  fix: "one imperative action or null"
  owner: STRUCTURAL
```

Do not convert `MISSING_INPUT` into `FAIL`. Rerun the condition after obtaining metadata.

## Gap report

```yaml
- id: GAP001
  sourceIds: [EE001]
  description: "what evidence or condition is missing"
  severity: BLOCKER | MAJOR | MINOR
  owner: AUTHOR_ONLY | RESEARCHABLE | STRUCTURAL | REPHRASE | CUT
  effort: MINUTES | HOURS | DAYS
  anchor: "exact original span"
  minimumAction: "one action"
  replacement: null
  fallback: "REPHRASE or CUT action"
  deferred: false
```

Sort by severity and then effort. Derive severity from `riskIfWrong`, `loadBearing`, and distance from the required bar; do not assign a numeric score.

## Author interview

```yaml
- id: Q001
  question: "one sentence in requested language"
  frameBasis: AUTHOR_LANGUAGE | SOURCE_LANGUAGE | NEUTRAL_RECONSTRUCTION
  presuppositionCheck: PASS | FAIL
  required: true | false
  fillsGapId: GAP001 | null
  fillsOpportunityId: OPP001 | null
  anchor: "exact original span"
  unlocks: "specific reader benefit"
  fallback:
    owner: REPHRASE | CUT | KEEP_CURRENT_TEXT
    action: "exact weaker wording, deletion, or unchanged-text decision"
```

Every question links to exactly one `fillsGapId` or `fillsOpportunityId`. When fewer than three active gaps or opportunities exist, do not invent questions to meet a quota. Return the actual count from one to seven. `required: false` is allowed only for an accepted `RECOMMENDED` opportunity; no answer keeps the current text unchanged.

`frameBasis` cannot point to model-invented taxonomy. When `presuppositionCheck: FAIL`, do not show the question to the author; replace it with a neutral reconstruction of the factual sequence or remove it.

## Patch set

```yaml
edits:
  - id: PATCH001
    anchor: "exact verbatim span from original"
    operation: REPLACE | INSERT_AFTER | INSERT_BEFORE | DELETE
    newText: "text or null for DELETE"
    sourceAnswerId: Q001-A1 | null
    sourceIds: []
    gapId: GAP001 | null
    opportunityId: OPP001 | null
    rationale: "one line"
followUps: []
appliedGapIds: []
appliedOpportunityIds: []
wordDelta: 0
newClaimCount: 0
```

`sourceAnswerId: null` is allowed only for a pre-approved `REPHRASE` or `CUT` that adds no new fact. Every factual or experiential insertion requires an answer, source, or artifact trace. An edit from a recommended interview uses `opportunityId`; a gap-based edit uses `gapId`, never both.

## Regression report

```yaml
newClaims:
  - span: "exact new span"
    trace:
      answerIds: []
      sourceIds: []
      gapIds: []
findings:
  - kind: HALLUCINATED_INSERTION | FABRICATED_EXPERIENCE | HOLLOW_INCREASE | PADDING | VOICE_DRIFT
    span: "exact span"
    severity: BLOCKER | MAJOR | MINOR
    note: "specific diagnosis"
dimensionVerdicts:
  - dimension: experience | expertise | authoritativeness | trust
    verdict: MEETS_BAR | BELOW_BAR | INSUFFICIENT_INPUT | NOT_REQUIRED
    remainingGap: null
gate: SHIP | ANOTHER_ROUND | NEEDS_HUMAN
```

`ANOTHER_ROUND` is allowed only for a remaining real `AUTHOR_ONLY` gap and for at most three cycles. Any fabrication or untraceable claim returns `NEEDS_HUMAN`.

## Complete automatic package

```yaml
status: ready | blocked
mode: automatic
contextBar: {}
claimCoverage: "N/N"
sectionCoverage: "N/N"
claimManifest: []
evidenceFindings: []
experienceProfile: {}
authorContribution: {}
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
  fullSectionCoverage: true | false
  criticalClaimsMeetBar: true | false
  assertedExperienceResolved: true | false
  authorContributionDecisionExplicit: true | false
  provenanceExplicit: true | false
  trustInputsHandled: true | false
  patchTraceable: true | false
  hollowMarkersDidNotIncrease: true | false
  briefPreserved: true | false
  internalIdsOutsideReaderMarkdown: true | false
  interviewFramesGrounded: true | false
  permittedAuthorialFirstPersonPreserved: true | false
nextStage: chief_editor_review | author_interview | research | edit_article | blocked
```

`RECOMMENDED` keeps `status: ready` and `nextStage: chief_editor_review`. `REQUIRED` returns `status: blocked` and `nextStage: author_interview` when the required claim cannot be weakened or removed safely without changing the contract.
