---
name: cms-draft-handoff
description: Create or update an explicitly authorized private article draft in Flexim CMS after final integration and a context-free cold-reader review are ready, then read the full record back, verify normalized Markdown, relations, metadata, and unpublished state, and only afterward mark the linked Suggested Topic done. Use when a user asks to save, upload, import, hand off, or update an article draft in Flexim CMS. Do not publish, delete, silently overwrite an ambiguous record, invent missing payload fields, or treat a successful write without read-back as complete.
---

# Hand off a private draft to CMS

## Purpose

Send an approved article package to Flexim as a private draft without publishing, then prove by full read-back that CMS preserved the intended copy, relations, and metadata. A mutation is complete only after verification; update Suggested Topic last.

## Responsibility

`cms-draft-handoff`:

- verifies explicit authorization for a private draft mutation;
- reads current schema before building the payload;
- prevents duplicates and ambiguous overwrites;
- creates a new draft or partially updates one unambiguous draft entry;
- reads the full entry after mutation and compares it;
- marks a linked Suggested Topic `done` only after successful article verification;
- returns an external report and exact CMS entry ID.

It does not publish, archive, or delete; change reader Markdown or locked meaning; invent author, category, slug, date, SEO metadata, or media IDs; upload images without a separately authorized media handoff; repair an unready package in CMS; or delete a partially created draft as rollback.

## Inputs and priority

Use:

1. explicit permission to create or update a private draft;
2. a `ready` `final-integration-check` package and `ready` `cold-reader-review` report for the same final reader-visible surface;
3. exact CMS payload with collection, name, content, status, relations, metadata, and H1 decision;
4. locked reader Markdown and snapshot;
5. expected counts for headings, links, tables, code fences, and media;
6. Suggested Topic ID and expected current status when applicable;
7. mode: `create`, `update`, or `automatic`.

Priority: explicit user correction, final-integration handoff, approved Brief and meaning lock, current Flexim schema and read-back, model assumption.

Return `EDITORIAL_CONFLICT` when payload and locked Markdown, integration package, or cold-reader surface disagree.

## Mutation authorization

“Save the draft,” “store it in CMS,” or “upload the article as a draft” authorizes only a private draft mutation and required read-back. It does not authorize publication, publish date, notifications, or media creation.

Preparing a payload earlier is not mutation permission. “Check readiness” is read-only.

## Allowed Flexim operations

Before writing, use read-only operations: `list_content_types`, `get_content_type`, `query_entries`, `get_entry`, plus `list_topics` and `get_topic_prompt` when the topic workflow requires them.

After explicit permission, use only `create_entry`, `update_entry`, and `update_topic_status` after successful article read-back.

Never call `delete_entry`. Do not call `upload_media` without a ready media handoff containing separate permission and a source-of-truth asset.

## Modes

- `create`: create a new draft only when exact duplicate count is zero.
- `update`: update an explicitly named draft or the only proven identity match; send only changed fields; never silently convert published or archived content to draft.
- `automatic`: ask no questions; return `blocked` before mutation on any conflict, ambiguity, or missing required field.

When mode is absent, infer it from an explicit entry ID and duplicate check. Similarity alone never authorizes `update`.

## Process

### 1. Fix the mutation contract

Record authorized action, collection, exact name, expected `draft` status, source snapshot, matching cold-reader surface snapshot, `contentIncludesH1`, relation IDs, description, SEO component, fields that must remain unset, Suggested Topic ID, and topic-update order.

Do not guess whether CMS renders `name` as H1. The H1 decision must come from a verified presentation contract or final-integration handoff.

### 2. Read schema

1. Call `list_content_types` when collection has not been confirmed in the current session.
2. Call `get_content_type` for the target collection immediately before mutation.
3. Verify required fields, types, select options, components, `refTo`, read-only, and computed fields.
4. Never send computed fields such as slug.
5. Fetch target relation records when the current handoff has not verified them recently.

Do not try several plausible names for an unknown field. Return `blocked` with the schema conflict.

### 3. Check duplicates and identity

Query exact name; never assume preview contains full Markdown.

- zero records: `create` is allowed;
- one draft plus explicit target ID or proven current-handoff identity: `update` is allowed;
- one published or archived record: do not overwrite; return conflict and request a distinct draft identity;
- multiple matches: return `blocked` with IDs and statuses.

Always fetch an existing target with `get_entry`. After an uncertain mutation response, query exact identity before retrying; never issue another `create_entry` blindly.

### 4. Prepare a draft-only payload

- Send text fields as Markdown.
- Send only real relation IDs.
- Set `status: draft` explicitly.
- Keep publish date unset unless the approved private-record contract explicitly requires it.
- Do not guess canonical URL, featured image, OG image, keywords, or tags.
- Preserve `noIndex` and other SEO flags only from the approved payload.
- Remove service sections, audit IDs, and markers from content; never remove H1 unless `contentIncludesH1: false` is explicit.

Before mutation, verify the structural manifest and absence of `[VERIFY: ...]`, `[EVIDENCE NEEDED: ...]`, and `[MEDIA: ...]`.

### 5. Perform one mutation

In `create`, call one `create_entry`. In `update`, call one `update_entry` for the target ID with only approved changed fields. Record response ID, status, and timestamp. A shortened mutation response is not read-back.

### 6. Read the entry back

Fetch the exact entry and verify:

1. status is `draft`;
2. name and relations match;
3. full Markdown matches the source package;
4. H1 decision, H2 and H3 order, tables, and code fences are preserved;
5. link counts and destinations match;
6. media IDs, captions, and `alt` fields match when in schema;
7. description and SEO component match;
8. publication fields expected to be empty remain unset;
9. no markers or service sections remain.

### 7. Compare normalized Markdown

First normalize only line endings, trailing spaces, and outer blank lines. If copy still differs, list exact deltas.

Allow `SERIALIZER_EQUIVALENT` only for proven equivalent serialization such as `*emphasis*` versus `_emphasis_` on the same span, list-marker spacing without nesting or text changes, or one final newline.

Never call changed visible copy or punctuation, heading level or order, URL or anchor text, missing paragraphs or rows, lost code or media, altered HTML rendering, or lost qualification equivalent.

Return `EXACT`, `SERIALIZER_EQUIVALENT`, or `MISMATCH`, canonical hash, and delta inventory. Do not update Suggested Topic after `MISMATCH`.

### 8. Complete the Suggested Topic workflow

Only after every article check:

1. list topics and confirm exact topic ID and current status;
2. call `update_topic_status(..., done)`;
3. list topics again and read the exact topic as `done`.

When topic mutation or read-back fails, leave the verified draft intact. Return `blocked`, `draftCreated: true`, the incomplete step, and a safe continuation action.

### 9. Write the external handoff

Update the integration report and durable task log when part of the workflow. Never put CMS IDs, checksums, or topic status into reader Markdown.

## Readiness gates

Return `ready` only when mutation was explicitly authorized; final integration and cold-reader review are ready for the same final reader-visible surface; schema and duplicate identity were checked; exactly one target draft exists; full `get_entry` read-back passed; Markdown is `EXACT` or safely `SERIALIZER_EQUIVALENT`; relations and metadata match; publication fields are honest and status is `draft`; Suggested Topic, when applicable, reads back as `done`; and publication did not occur.

Return `blocked` before mutation on ambiguity or after mutation on incomplete verification. Always state whether an entry was created or changed.

## Output

```yaml
status: ready | blocked
mode: create | update | automatic
authorization:
  draftMutation: true | false
  publication: false
preflight:
  finalIntegrationReady: true | false
  coldReaderReady: true | false
  finalSurfaceMatchesColdReader: true | false
schema:
  collection: "..."
  checked: true | false
identity:
  duplicateCount: 0
  action: create | update | none
  targetEntryId: null
mutation:
  attempted: true | false
  succeeded: true | false
  entryId: null
readBack:
  fetched: true | false
  statusDraft: true | false
  relationsMatch: true | false
  metadataMatch: true | false
  publicationFieldsSafe: true | false
markdown:
  verdict: EXACT | SERIALIZER_EQUIVALENT | MISMATCH | NOT_CHECKED
  sourceHash: "..."
  cmsHash: "..."
  canonicalHash: "..."
  deltas: []
  structureMatches: true | false
topic:
  applicable: true | false
  topicId: null
  previousStatus: null
  updatedAfterReadBack: true | false
  finalStatus: null
warnings: []
blockers: []
nextStage: human_review | final_integration_check | blocked
```

## Do not

- Publish when asked to save a draft.
- Create a second draft after timeout without a new exact duplicate check.
- Update the first similar record or overwrite published content.
- Treat a mutation response as read-back.
- Accept semantic or structural drift as normalization.
- Mark Suggested Topic `done` before full article read-back.
- Delete a partially created draft as automatic rollback.
- Hide a mutation when a later blocker occurs.
