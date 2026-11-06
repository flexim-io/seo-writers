---
name: render-mermaid-infographic
description: Render or preflight one approved Mermaid infographic locally after visual-storytelling has supplied a complete compatible media brief. Use for an explicit Mermaid production request or as an optional media-production worker; never use it to decide that an article needs a diagram, install dependencies silently, integrate assets, access CMS, or publish.
---

# Render Mermaid Infographic

## Purpose

Turn one approved Mermaid-compatible production brief into a locally rendered SVG and PNG candidate with preserved `.mmd` source, technical QA, provenance, and a machine-readable handoff.

This is an optional production worker inside the existing `media_integration` phase. One invocation handles exactly one `visualId`, one canvas, and one source. Treat a mobile composition as a separate invocation.

## Responsibility boundary

`visual-storytelling` owns whether a visual is useful, the reader question, semantic composition, evidence boundary, production brief, caption, `alt`, human review, and integration.

This skill owns:

- Mermaid compatibility and production-allowlist checks;
- preparation or validation of one exact `.mmd` source;
- local environment preflight and explicitly authorized dependency setup;
- security, syntax, density, SVG, PNG, and technical QA;
- asset paths, hashes, renderer provenance, and `mermaidInfographicHandoff`.

Do not invoke this skill merely because an article mentions a process, contains a `[MEDIA: ...]` marker, or enters its visual phase. Do not reopen locked editorial strategy, change claims, replace required proof with a diagram, integrate media, mutate CMS, or publish.

## Inputs and priorities

Require:

- `mode`: `preflight`, `render`, or `automatic`;
- the real root of the private content repository;
- an existing writable output root inside that repository;
- one complete `visual-storytelling` media-map item and production brief;
- a locked reader snapshot ID and exact anchor;
- source-of-truth references and claim permissions;
- privacy review and redaction constraints;
- one canvas: `article`, `desktop`, or `mobile`;
- exact reader-facing caption and `alt`;
- either one existing `.mmd` file or an approved structured specification with exact nodes, relations, labels, syntax family, semantic classes, and qualifications.

Use this priority order:

1. Explicit user correction.
2. Locked `visual-storytelling` production brief and media-map item.
3. Verified primary source and claim permissions.
4. Locked reader Markdown and approved caption/`alt`.
5. Model assumption.

Never invent an entity, number, causal relation, process order, product state, or personal experience. Missing visible meaning is `BRIEF_INCOMPLETE` or `EVIDENCE_CONFLICT`, not permission to fill a gap.

### Compatible media item

The item must use:

```yaml
id: visual-03
placement: "section and exact post-paragraph anchor"
readerQuestion: "What relationship should the reader understand?"
role: explain | compare | orient | summarize | hook
format: diagram
content: "exact visible content and relationships"
sourceOfTruth: [source-or-claim-id]
authenticity: evidence | illustration | mockup | demo
required: true | false
caption: "reader-facing takeaway"
alt: "semantic equivalent"
production: design
status: needs-production
templateDecision: { selectedTemplate: "...", relationship: "...", reason: "..." }
acceptanceCriteria: ["observable acceptance condition"]
privacyConstraints: []
```

Return `NOT_MERMAID_COMPATIBLE` for `demonstrate`, `pace`, or sole `proof` roles unless `visual-storytelling` explicitly changes the format contract. A source-grounded diagram can explain evidence but cannot replace the source required to prove a claim.

### Mermaid source

Use literal self-contained frontmatter:

```yaml
---
visual:
  id: visual-03
  syntax: flowchart
  preset: flexim-flow
  canvas: article
  outputs: [svg, png]
  title: "Exact reader-facing title"
  alt: "Literal semantic equivalent"
  caption: "Literal reader-facing takeaway"
  experimental: false
---
```

`alt` and `caption` are literal strings, not paths or private references. Production accepts only non-experimental syntax/preset pairs in the bundled `config/production-syntaxes.json`. Do not overwrite supplied source. The renderer preserves a derived source inside the authorized output root.

## Modes

### `preflight`

Check the brief, source, paths, runtime, Node.js, dependency cache, Chrome, security, syntax, density, evidence, and privacy without rendering, installing, or writing any file. A ready result has `renderStatus: not-run`, null artifacts, `humanReviewRequired: true`, and `nextStage: media_production`.

### `render`

Render exactly one approved source after preflight. If dependencies are missing, return `SETUP_REQUIRED` and the exact safe setup command. Run that command only after explicit user authorization.

### `automatic`

Ask no questions and never install anything. Render only when every input and cached dependency already exists. Otherwise return a precise `blocked` handoff. `automatic` is not a weaker readiness level.

If the request says “render this Mermaid file,” default to `render`. If it asks whether rendering can run, default to `preflight`.

## Process

### 1. Establish the physical runtime

Resolve symlinks and locate the runtime from the physical directory containing this `SKILL.md`:

```text
../../runtime/mermaid-infographic/src/launcher.mjs
```

Do not derive the runtime from the article working directory, a development checkout, or a guessed Codex or Claude cache path.

### 2. Check the production package

Verify that:

- the item matches the compatible media schema;
- `sourceOfTruth`, `templateDecision`, and `acceptanceCriteria` are complete;
- every visible label and relation is within its claim permission;
- qualifications remain visible where required;
- privacy review passed;
- caption and `alt` match the approved media item exactly;
- the chosen composition fits one approved syntax/preset pair.

Use SVG and PNG exactly. Do not silently shrink a dense desktop source into mobile; create a separate mobile composition or return a blocker.

### 3. Prepare private paths and context

Keep the source, JSON context, work files, and every artifact inside the real private repository. The output root must already exist before `preflight`.

The context JSON must contain at least:

```json
{
  "mediaMap": {},
  "productionBrief": {
    "objective": "...",
    "composition": "...",
    "inImageCopy": ["..."],
    "sourceOfTruth": ["claim-or-source-id"],
    "forbiddenContent": [],
    "responsiveConstraints": ["..."],
    "caption": "...",
    "alt": "...",
    "acceptanceCriteria": ["..."],
    "privacyConstraints": [],
    "templateDecision": {}
  },
  "lockedReader": { "snapshotId": "...", "anchor": "..." },
  "claimPermissions": [],
  "privacyReview": { "status": "passed" },
  "privacyConstraints": []
}
```

For an existing source, pass its private path. For an approved structured specification, translate only the supplied entities and relations into a complete frontmatter-bearing Mermaid source and feed it through standard input with `--source -`; this lets `preflight` remain write-free. Never put private source text in a command-line argument.

### 4. Run read-only preflight

Use the dependency-free launcher:

```text
node <launcher> preflight --workspace-root <private-repository> --output-root <existing-private-output-root> --source <private-source.mmd> --context <private-context.json>
```

Preflight must not create the cache, refresh a marker, probe by writing, install packages, download a browser, launch a remote renderer, or write outputs. It checks Node.js `>=22`, a compatible local Chrome/Chromium, the external dependency-cache marker, realpath containment, the public allowlist, and the production package.

### 5. Handle setup explicitly

When preflight returns `SETUP_REQUIRED`:

- show the returned exact setup command;
- explain that it copies the pinned runtime into a user cache and installs the locked production dependencies;
- obtain explicit authorization before executing it;
- never execute it in `automatic` mode.

Use the returned host-specific launcher command with `PUPPETEER_SKIP_DOWNLOAD=true`. Setup requires self-contained npm code beside the trusted Node.js executable. For another trusted layout, append `--npm-cli /trusted/npm/bin/npm-cli.js` to the command shown for authorization, using the platform's path syntax. Do not search `PATH` for npm or substitute a bare `npm install` command.

The launcher copies npm code and package metadata temporarily, excluding original npmrc files and unrelated files at the npm installation root, and creates empty builtin/user/global npm config files. A project `.npmrc` in the bundled runtime is rejected. It invokes the copied npm CLI directly through trusted Node.js with an explicit runtime prefix, installs the locked production dependencies with install hooks, audit requests, and update checks disabled, and verifies them before completing setup. Downloads retain locked public npm URLs and integrity hashes; floating versions, registry host replacement, and browser downloads are not allowed. The external cache contains runtime dependencies only, never article source or artifacts. Setup requires direct access to the public registry.

The copied npm process receives Node filesystem read grants only for its fresh npm/runtime directories and the exact trusted Node executable, and write grants only for the fresh directories. It receives no child-process grant or global module lookup fallback. On Node.js versions whose permission model also controls network access, it receives only the network grant needed for the locked downloads. npm bin links are disabled because the Mermaid CLI runs through its direct Node entrypoint.

The Mermaid CLI also runs directly through trusted Node.js. Every child process and Chrome launch receives fresh home, configuration, and temporary paths; Chrome uses invocation-specific profiles and `--no-proxy-server`. Personal npm credentials, proxy settings, and Node.js injection settings are not inherited. These configuration controls are not an operating system filesystem sandbox; Chrome still uses `--no-sandbox`.

Missing Node, Chrome, network access for first setup, or cached dependencies blocks only this optional visual. Preserve the visual plan, or return to `visual-storytelling` for a user-approved text-only or alternate-production fallback.

### 6. Render locally

After ready preflight, run:

```text
node <launcher> render --workspace-root <private-repository> --output-root <existing-private-output-root> --source <private-source.mmd> --context <private-context.json>
```

Use `automatic` instead of `render` only for the non-interactive mode. Rendering must remain local. Reject forbidden Mermaid actions/directives, remote or local URI schemes, scripts, iframes, inline SVG, event handlers, inline styles, and unknown HTML before Chrome starts.

The output candidate includes preserved `.mmd`, SVG, PNG, HTML preview, JSON QA, full artifact hashes, renderer version, package-lock hash, `briefFingerprint`, and component hashes. A QA error is `TECHNICAL_QA_FAILED`; never downgrade cached errors, overlap, overflow, unreadable scale, corrupt output, or wrong dimensions to warnings.

### 7. Require independent human semantic review

Technical success does not prove semantic accuracy or usefulness. Keep `humanReviewRequired: true` for every result.

Return the handoff to `visual-storytelling` in `integrate` mode. That skill compares the real asset with the locked production brief, caption, `alt`, evidence, hierarchy, and mobile behavior before changing the media item to `available` or integrating it.

Store each invocation as an append-only `mermaid_render_handoff` artifact with its own production-worker record inside `media_integration`. Do not replace the phase's primary `visual-storytelling integrate` `workerRef`.

## Missing data and blockers

Return `status: blocked`, one exact anchor, the smallest safe next action, and `nextStage: none` for:

| Code | Use when |
| --- | --- |
| `BRIEF_INCOMPLETE` | Required meaning, copy, evidence reference, or acceptance criterion is missing |
| `NOT_MERMAID_COMPATIBLE` | Mermaid would distort the approved composition |
| `SYNTAX_NOT_APPROVED` | The syntax/preset pair is outside the production allowlist |
| `SETUP_REQUIRED` | The complete pinned dependency cache is absent |
| `NODE_INCOMPATIBLE` | Node.js is below version 22 |
| `BROWSER_UNAVAILABLE` | Compatible local Chrome/Chromium is unavailable |
| `SOURCE_UNSAFE` | A forbidden source construct is present |
| `SYNTAX_INVALID` | Local Mermaid parsing failed |
| `EVIDENCE_CONFLICT` | Visible meaning exceeds claim permission |
| `PRIVACY_RISK` | Source or output exposes protected information |
| `PATH_ESCAPE` | A lexical or symlink-resolved path leaves the private repository |
| `TECHNICAL_QA_FAILED` | Rendering, integrity, dimensions, overlap, overflow, or legibility failed |

Never replace a blocked result with a placeholder, empty SVG, screenshot of an error, generic generated illustration, or unverified online render.

## Output and handoff

Return a short human summary plus one `mermaidInfographicHandoff` with:

- `schemaVersion: 1`, mode, status, `visualId`, and whether the item is required;
- source path or `null`, exact source SHA-256, `briefFingerprint`, and component hashes;
- syntax, preset, canvas, renderer version, package-lock SHA-256, Node, and Chrome versions;
- `renderStatus: not-run | rendered | rendered-with-warnings | failed`;
- relative private paths and SHA-256 hashes for source, SVG, PNG, preview, and QA, or null artifacts in preflight;
- reader question, role, source-of-truth references, claim IDs, caption, `alt`, and authenticity;
- security, syntax, technical QA, privacy, and evidence checks using `passed | failed | not-run`;
- `humanReviewRequired: true`, explicit warnings, structured blockers, and the correct next stage.

Reuse an earlier render only when the exact source hash, complete `briefFingerprint`, every component hash, renderer version, and package-lock hash still match. Otherwise rerun production before integration.

## Non-goals

- No mandatory Mermaid stage or diagram quota.
- No visual strategy, chief-editor work, or media integration.
- No hosted rendering service, npm publication, CMS access, or publishing.
- No invented evidence, product UI, data, or personal experience.
- No silent dependency install, browser download, baseline approval, or claim that a technically rendered asset is editorially ready.
