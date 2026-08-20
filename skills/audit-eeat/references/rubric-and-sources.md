# Rubric and primary sources

## Contents

- [Source status](#source-status)
- [What Google states](#what-google-states)
- [What not to attribute to Google](#what-not-to-attribute-to-google)
- [YMYL calibration](#ymyl-calibration)
- [Evidence rubric](#evidence-rubric)
- [Experience markers](#experience-markers)
- [Interview calibration](#interview-calibration)
- [Trust surface](#trust-surface)

## Source status

Verified against primary sources on 2026-08-11:

1. [Google Search Quality Rater Guidelines](https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf), version `General Guidelines September 11, 2025`, 182 pages.
2. [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), official Search Central documentation.
3. [Guidance on using generative AI content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content), official Search Central documentation.
4. [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies), official reference for spam practices.
5. [Google's guide to optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), official Search Central guidance on valuable, non-commodity content and unique first-hand perspective.

Reopen current versions before relying on dates, section numbers, or policy status because these documents change.

### Version-story check

- The current QRG title page confirms `September 11, 2025` and `182 pages`.
- Its change log says September 2025 updated YMYL definitions, added examples, and made minor changes.
- The change log assigns alignment of Lowest and Low sections with Web Spam Policies to January 2025.
- The current QRG includes `Expired Domain Abuse`, `Site Reputation Abuse`, and `Scaled Content Abuse` in sections 4.6.3–4.6.5, plus examples of AI-generated fake author profiles and low- or no-value AI content.
- Do not call all of these changes one “September AI update”; the official change log does not support that label.
- Do not use unverified claims such as a `June 2026 update`, `Synthetic Authority`, or invented sections 5.2, 5.4, or 6.1 without a new primary document.

## What Google states

- E-E-A-T refers to Experience, Expertise, Authoritativeness, and Trust; Trust is the most important member of the family.
- A page does not need to demonstrate every dimension equally. First-hand experience may matter more for one subject and formal expertise or an institutional source for another.
- Trust expectations are higher for subjects that can materially affect health, financial stability, safety, or societal well-being.
- Search quality raters help evaluate system quality, but their ratings do not directly change individual page rankings.
- E-E-A-T is not one specific ranking factor.
- Accurate bylines and author information are helpful when a reader would reasonably want to know the creator.
- Creation-method and AI or automation disclosures are helpful when a reader would reasonably ask how the content was produced.
- Automation or AI does not make content spam by itself. Manipulative intent, low effort, low originality, and missing added value are the concern.
- First-hand perspective can create distinctive reader value when a page would otherwise only summarize available material. This is an opportunity for specific content, not a universal interview requirement.

## What not to attribute to Google

Do not claim that Google requires:

- a fixed E-E-A-T score or threshold;
- a fixed number of sources, examples, author credentials, or years of experience;
- a YMYL disclaimer for every risky subject;
- AI disclosure on every page;
- a ranking, traffic, CTR, or conversion guarantee after these fixes;
- first person or precise numbers as automatic proof of real experience;
- every informational page to become a personal case study.

## YMYL calibration

Use these as internal labels, not official Google enums:

- `NOT_YMYL`: a small error normally causes no material harm to a person or society.
- `MAY_BE_YMYL`: harm depends on context, claim strength, reader action, or distribution scale.
- `CLEAR_YMYL`: incorrect information can directly and materially affect health, financial stability, safety, voting and elections, public institutions, or societal welfare.

Classify the concrete reader decision, not only the topic label. A recipe and a medical dosage may appear on one site but require different evidence bars.

For `CLEAR_YMYL`:

- require stronger provenance for load-bearing factual, causal, and advice claims;
- distinguish lived experience from qualified professional guidance;
- do not let a personal anecdote replace expert consensus when an error is dangerous;
- verify safety limits, uncertainty, and escalation boundaries;
- do not use a boilerplate disclaimer instead of a precise content fix.

## Evidence rubric

Do not turn evidence kinds into a linear score. One claim may use several kinds.

| Evidence kind | What is present | Limitation |
| --- | --- | --- |
| `NONE` | The claim appears without support | It does not earn confident wording |
| `VAGUE_APPEAL` | “Studies show” or “experts say” without a referent | Support cannot be checked |
| `NAMED_SOURCE_UNAVAILABLE` | A source is named but its contents are not supplied | Proves citation presence, not entailment |
| `SECONDARY_SOURCE_SUPPLIED` | A checkable secondary source is supplied | May support context but not every primary claim |
| `PRIMARY_SOURCE_SUPPLIED` | A primary, official, or original source is supplied | Verify that it actually entails the claim |
| `REASONED` | The text shows mechanism, derivation, or argument | Logic does not replace empirical evidence when required |
| `ARTIFACT_SUPPLIED` | A real screenshot, log, dataset, code sample, invoice, photo, or other artifact is supplied | Verify scope and interpretation |
| `FIRST_HAND_ASSERTED` | The author claims personal experience without a concrete instance | Signals authority without demonstrating it |
| `FIRST_HAND_DEMONSTRATED` | A concrete instance, observation, configuration, boundary, failure, or measurement is shown | Still requires a separate provenance status |

### Claim status

- `MEETS_BAR`: evidence fits the claim's risk, purpose, and strength.
- `UNDERSUPPORTED`: some evidence exists but is weaker than required.
- `UNSUPPORTED`: no support exists.
- `INTERNALLY_CONTRADICTED`: another supplied claim conflicts with it.
- `OVERSTATED`: evidence supports only a weaker formulation.

### Provenance status

- `source_linked`: linked to a supplied source ID.
- `artifact_supplied`: linked to a real supplied artifact ID.
- `author_answer`: detail traces verbatim to an answer ID.
- `in_text_only`: detail appears only in reader Markdown.
- `unknown`: origin cannot be established.

## Experience markers

### Positive markers

- a precise quantity, cost, duration, version, or setting from a concrete instance;
- a negative result and explanation;
- a boundary condition where the advice stops working;
- process detail required to reproduce the action;
- a time anchor and change in circumstances;
- a changed-mind account with a reason;
- reasoned disagreement with standard advice;
- a reference to a real artifact.

A positive marker does not prove truth automatically. Check provenance and specificity theatre.

### Hollow markers

- credential drop without demonstration;
- consensus echo without added value;
- empty transition;
- universal hedge that asserts nothing;
- fake-experience framing around generic advice;
- precise-sounding number without a source, artifact, or author-answer trail;
- author bio inserted into body copy instead of evidence beside the claim.

### Expertise depth

- `SURFACE`: definitions and generic advice are summarized.
- `WORKING`: operational explanation and usable steps are correct.
- `PRACTITIONER`: concrete trade-offs, failures, boundaries, and process details appear.
- `SPECIALIST`: deep diagnosis, difficult exceptions, original method or data, or high domain-specific precision appears.

Do not require `PRACTITIONER` or `SPECIALIST` for every page. The bar depends on purpose.

## Interview calibration

Evaluate two separate reasons to interview.

### Evidence necessity

Use `REQUIRED` when author-only evidence is necessary for a load-bearing claim, promised first-hand experience, review or case result, or reader decision, and an honest fallback would break the approved contract. This gap blocks readiness.

### Author contribution opportunity

Use `RECOMMENDED` when the current text is evidence-safe but the named author or practitioner angle adds no distinctive reader value yet. Look for exact spans that could gain:

- a real decision and reason;
- a failed approach or rejection;
- a trade-off between valid options;
- the boundary where advice stops working;
- actual product use with an honest limitation;
- a changed mind;
- a verifiable artifact or process detail.

Do not recommend an interview for title, tenure, a generic quote, emotional color, or decorative story. Do not ask authors to supply public facts that belong to research. Declining a recommended interview must not lower the current evidence verdict.

### Decision examples

| Situation | Decision | Reason |
| --- | --- | --- |
| A first-person review claims actual use without an instance or artifact | `REQUIRED` | Reader trust depends on asserted experience |
| Named-founder advice is evidence-safe but generic and exact process or trade-off anchors exist | `RECOMMENDED` | An interview can add non-commodity contribution without repairing a false claim |
| A neutral reference page is source-grounded and authorship is not part of its promise | `NOT_NEEDED` | An interview would not change the reader decision |
| A practitioner article already shows traceable failures, boundaries, and artifacts | `NOT_NEEDED` | Relevant contribution is already demonstrated |

## Trust surface

Check a condition only when applicable:

| Condition | When it matters | Sufficient evidence |
| --- | --- | --- |
| Creator clarity | The reader expects to know who is responsible | Accurate byline or clear organizational responsibility |
| Relevant author context | Standing changes trust | Bio identifies the relevant domain without inflated credentials |
| Identity or standing verification | High-risk advice, review, case, or original research | Verifiable profile, institution, records, or artifacts |
| Date honesty | Freshness changes the decision | Publish or update date reflects a real substantive revision |
| Source integrity | A claim depends on external support | An accessible source actually supports the claim |
| Methodology | Original tests, rankings, statistics, or comparisons | Scope, sample, method, limitations, and measurement context |
| Conflict disclosure | Author or publisher benefits from the decision | Disclosure appears before it affects the choice |
| Contactability | Accountability or support is needed | A real route to the responsible person or organization |
| Creation context | Automation materially affects interpretation | Human responsibility and a clear method explanation |
| Safety boundary | An error could cause material harm | Limits, uncertainty, and a route to qualified help |

Return an absent metadata field as `MISSING_INPUT`; never infer it from body copy.
