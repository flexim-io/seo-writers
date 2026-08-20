# SEO Writers

An open beta editorial operating system for planning, drafting, editing, auditing, illustrating, and handing off evidence-safe SEO articles.

SEO in this project means satisfying search intent and helping a reader complete a real task. It does not mean keyword-density targets, artificial length, or sections added without reader value.

## What is included

The repository packages 15 reusable editorial skills as one beta plugin for both Codex and Claude Code. Both hosts use the same canonical skill sources, and neither requires [Flexim](https://flexim.io/) to run the text workflow. `run-seo-writing-workflow` coordinates or resumes the full pipeline while each specialist skill keeps its own contract.

Codex reads `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json`. Claude Code reads `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`. Both packages point to the same `skills/` directory and install the sibling `runtime/` payload, so the host metadata stays separate without duplicating runtime skills.

The current pipeline is:

`topic or idea → audit-content-library (pre-brief) → Article Brief → load-author-voice (when an author voice is required) → draft-article author-contribution preflight → draft-article → edit-article → independent editorial audit → chief-editor-review → visual-storytelling → media production and integration → final-integration-check → cold-reader-review → cms-draft-handoff`

The independent editorial audit contains five separate gates:

- `audit-useful-action`
- `audit-paragraph-structure`
- `audit-tone-honesty`
- `audit-eeat`
- `audit-content-library` in `pre-chief-editor` mode

## Repository boundary

This public repository develops and distributes SEO Writers. It is not where real articles are produced.

Install the plugin for use from a separate private content repository. Keep real briefs, CMS exports, sources, author profiles, interviews, drafts, audit reports, workflow state, media, and finished articles there. One private repository may serve one brand or editorial operation.

The public repository contains only installable runtime sources and user-facing documentation. Development validation, synthetic fixtures, release tooling, and private working material live outside it. Sanitized examples may be added here only when they are intentionally public and provenance-safe.

See [Content repositories](docs/content-repositories.md) for the complete boundary. Flexim remains an optional external service, not another repository and not a requirement for running the text workflow.

## Skills

| Skill | Responsibility |
| --- | --- |
| `run-seo-writing-workflow` | Coordinate or resume the complete workflow, preserve title authority, dispatch specialist workers, reuse unaffected checks after an explicit impact analysis, and stop at real approval or authorization boundaries. |
| `audit-content-library` | Compare a proposed or completed article with published posts and active drafts, then define or verify its distinct portfolio role. |
| `load-author-voice` | Resolve the assigned author and load a complete voice profile from Flexim or a validated portable input. |
| `draft-article` | Turn an approved Article Brief and allowed evidence into an article structure and evidence-safe draft. |
| `edit-article` | Edit an existing draft from reader task and factual integrity through structure, tone, sentences, words, and rhythm. |
| `audit-useful-action` | Check whether the title, introduction, sections, examples, product block, and conclusion advance one useful reader action. |
| `audit-paragraph-structure` | Audit every paragraph, list, and table with complete coverage and rewrite only failing units. |
| `audit-tone-honesty` | Detect production language, false intimacy, pressure, unsupported confidence, and product dishonesty. |
| `audit-eeat` | Audit atomic claims, evidence, provenance, demonstrated experience, and author-contribution gaps. |
| `chief-editor-review` | Resolve independent reports, apply accepted changes, rerun affected gates, and lock article meaning. |
| `visual-storytelling` | Plan and integrate the smallest useful set of evidence-safe visuals after the text is locked. |
| `render-mermaid-infographic` | Optionally preflight or render one approved Mermaid-compatible diagram locally, run technical QA, and return verified assets for human semantic review and visual integration. |
| `final-integration-check` | Verify the final text, media, metadata, trust surface, and draft-only CMS payload. |
| `cold-reader-review` | Independently judge the final reader-visible article with no production context before final handoff. |
| `cms-draft-handoff` | Create or update an explicitly authorized private Flexim draft and verify it by full read-back. |

Canonical skill sources live under `skills/<skill>/`; the optional local Mermaid renderer lives under `runtime/mermaid-infographic/`. Both hosts install the same sources without duplicating skills. Article artifacts belong in the separate private content repository, never in the plugin repository.

## Optional local Mermaid rendering

`render-mermaid-infographic` is an optional media-production worker, not a mandatory pipeline stage. `visual-storytelling` first decides whether a diagram is useful and prepares a complete evidence-safe brief. The renderer then handles one approved `visualId + canvas` locally and returns SVG, PNG, preserved Mermaid source, preview, QA, hashes, and provenance. `visual-storytelling` still performs human semantic review and integration.

Text production does not require the renderer. Mermaid production requires Node.js 22 or newer, a compatible local Chrome or Chromium, and one explicitly authorized dependency-cache setup. Preflight and automatic mode never install dependencies or download a browser. The setup command uses the bundled lockfile with `PUPPETEER_SKIP_DOWNLOAD=true npm ci --omit=dev`, and generated article assets stay inside the private content repository. No online renderer, CMS mutation, or publication fallback is used.

See [Quickstart: optional local Mermaid rendering](docs/quickstart.md#optional-local-mermaid-rendering) for setup and limitations.

## Flexim and portability

[Flexim](https://flexim.io/) is the recommended private environment for live content-library checks, author profiles, and the final CMS draft handoff. That integration is intentionally useful, but it is not a blocker for the open workflow:

- `audit-content-library` can use a complete CMS export instead of live read-only Flexim access.
- `load-author-voice` can validate a complete portable author profile or an existing transient handoff.
- all drafting, editing, independent audit, chief-editor, and visual-planning stages operate on supplied files and structured handoffs.
- `cms-draft-handoff` is simply skipped when the article is going to another CMS.

When Flexim is unavailable, start with the data you have. In interactive modes, the active skill requests only the missing portable input that materially affects its result. In `automatic` mode, it asks no questions and returns a precise blocker instead of inventing data.

No skill publishes content automatically.

## Getting started

Follow the [Quickstart](docs/quickstart.md) to install the plugin in Codex or Claude Code and run it from a separate private content repository, prepare a portable first-run input, and start the pipeline without requiring Flexim.

In short:

1. Open a checkout or worktree of the separate private content repository for the brand or editorial operation. Do not start article work in this plugin repository.
2. Add the `flexim-io/seo-writers` marketplace and install `seo-writers@flexim` in Codex or Claude Code.
3. Start `run-seo-writing-workflow` with an idea or topic, the data you already have, and an optional requested target. Use `portfolio_decision` when you only want a topic or portfolio choice.
4. Let the coordinator run `audit-content-library` in `pre-brief` mode using either read-only Flexim access or a complete CMS export, then explicitly approve the proposed Article Brief.
5. Resume from the saved state after any requested evidence, author answer, isolated audit, or media-production pause. A compatible Mermaid brief may use the optional local renderer; missing renderer setup blocks only that visual. After the first complete pass, the coordinator records a change-impact plan and reruns only affected gates; ambiguous changes escalate conservatively. Keep reader Markdown separate from production reports and handoffs.
6. Use `cms-draft-handoff` only after an explicit request to create or update a private Flexim draft, ready final integration, and a ready independent cold-reader review.

You can still invoke any stage directly. Each `SKILL.md` defines its inputs, modes, readiness gates, output contract, and boundaries; the orchestrator routes those contracts rather than replacing them with one opaque prompt.

## Optional background execution

The normal way to use `run-seo-writing-workflow` is in the foreground. If a longer run is more convenient, Codex or Claude Code can keep the same workflow running through host-provided background features. This does not add a new orchestrator mode or change its contract: the skill uses the same `run` and `resume` modes, the same saved state, and the same approval boundaries.

- In Codex, start the workflow with [Goal mode](https://learn.chatgpt.com/docs/long-running-work). [Scheduled tasks](https://learn.chatgpt.com/docs/automations) are optional for recurring checks or resumptions, but local-project tasks still need the computer on and the desktop app running.
- In Claude Code, start a detached session with `claude --bg`, move an existing session to the background with `/bg`, and monitor it with `claude agents`. See the official [background session](https://code.claude.com/docs/en/agent-view) documentation. The session-scoped `/loop` command is optional for polling; it runs only while Claude Code is running and idle. See [scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks).

A background host can continue safe stages without keeping a terminal attached, but it cannot approve an Article Brief, invent missing input, authorize a CMS mutation, or publish on the user's behalf. It must wait or return a precise blocker at those boundaries. A machine-independent hosted runner could be added separately in the future, but it is not required by the open workflow and is not included in this repository.

The [Quickstart](docs/quickstart.md#optional-background-execution) includes copy-paste examples and the local-runtime limitations for both hosts.

## Contributing

Issues and pull requests are welcome. Keep reusable skill work under `skills/` and bundled production code under `runtime/`, never commit real article or author data, and treat both host manifests as views of one shared plugin. See [CONTRIBUTING.md](CONTRIBUTING.md) for the public contribution boundary.

## Beta status

This repository is an open beta:

- `run-seo-writing-workflow` provides shared coordination and resumable state; foreground execution is the default, optional background execution comes from the host, and this repository does not include an always-on hosted service;
- independent audits require isolated contexts supplied by the host or external dispatch; same-context reviews are never presented as independent;
- the final cold-reader review is also a fresh isolated context that sees only reader-visible material, not the Brief, sources, state, or audit reports;
- a verified assigned author may write in first person for authorial framing and source-grounded judgment, but personal experience still requires evidence;
- the shared skills are packaged for Codex and Claude Code, but the plugin has not been submitted to either official public marketplace;
- Flexim integration is recommended but portable inputs keep text production usable without it;
- local Mermaid production is optional, requires Node.js 22 plus local Chrome, uses a pinned external dependency cache, and still requires human semantic review before integration;
- publishing remains a separate, explicitly authorized action and is not implemented by these skills;
- contracts may still evolve while the skills are validated on real articles.

Contributions should preserve the boundaries between skills, keep claims evidence-safe, and avoid coupling the open workflow to one private system.

## License

SEO Writers is licensed under the [Apache License 2.0](LICENSE).
