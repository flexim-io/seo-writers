# Quickstart

SEO Writers is distributed as one beta plugin for Codex and Claude Code. Both packages use the same 15 skills, including `run-seo-writing-workflow` for coordinating or resuming the complete pipeline and the optional `render-mermaid-infographic` production worker.

## Requirements

- Codex with plugin support or Claude Code with plugin support
- GitHub access to this repository
- a separate private content repository for article production
- a proposed article topic

Optional local Mermaid production additionally requires Node.js 22 or newer and a compatible installed Chrome or Chromium. These are not requirements for the text workflow.

Flexim is recommended, not required. Start with the topic and data you already have. In interactive modes, each skill requests the missing portable input it actually needs. In `automatic` mode, it asks no questions and returns a precise blocker instead of inventing data.

Run the workflow from a checkout or worktree of the private content repository, not from the SEO Writers clone. Keep all real briefs, sources, exports, author data, drafts, media, and saved state in that repository. See [Content repositories](content-repositories.md) for the boundary.

## Install in Codex

Add this repository as a marketplace, then install the plugin:

```bash
codex plugin marketplace add flexim-io/seo-writers --ref main
codex plugin add seo-writers@flexim
```

Start a new Codex task after installation. Plugin skills use the `seo-writers:` namespace.

## Install in Claude Code

Add the same repository as a Claude Code marketplace, then install the plugin:

```bash
claude plugin marketplace add flexim-io/seo-writers@main
claude plugin install seo-writers@flexim
```

Start a new Claude Code session after installation. If the install summary asks for it, run `/reload-plugins`. Plugin skills use commands such as `/seo-writers:audit-content-library`.

## Upgrade from SEO Writing OS 0.4.1

`SEO Writers` replaces the old `SEO Writing OS` package and plugin ID. Existing installations do not switch names automatically.

For Codex, remove the old package and marketplace entry before adding the renamed repository:

```bash
codex plugin remove seo-writing-os@flexim
codex plugin marketplace remove flexim
codex plugin marketplace add flexim-io/seo-writers --ref main
codex plugin add seo-writers@flexim
```

For Claude Code:

```bash
claude plugin uninstall seo-writing-os@flexim
claude plugin marketplace remove flexim
claude plugin marketplace add flexim-io/seo-writers@main
claude plugin install seo-writers@flexim
```

Start a new task or session after the migration. If you need to resume an old workflow, copy its state from `.seo-writing-os/sessions/` to `.seo-writers/sessions/` in the private content repository before resuming. Keep a backup until the resumed workflow loads successfully.

## Link the skills to one repository

Use repository-scoped links when testing or contributing without installing the plugin.

Clone SEO Writers, open the repository where you write articles, and run the following from that article repository's root. Replace the placeholder with the absolute path to your SEO Writers clone.

```bash
mkdir -p .agents/skills
seo_writers_dir="/absolute/path/to/seo-writers"

for skill_dir in "$seo_writers_dir"/skills/*; do
  if [ -f "$skill_dir/SKILL.md" ]; then
    ln -s "$skill_dir" ".agents/skills/$(basename "$skill_dir")"
  fi
done
```

Codex scans `.agents/skills` from the current directory to the repository root and supports symlinked skill directories. Existing destinations are not overwritten by this command.

## Prepare the first input

For a first run without Flexim, a proposed topic or article idea is enough to begin. The orchestrator will use the available inputs and request only missing information that materially changes the next stage.

To complete the full workflow, expect to provide:

1. A complete CMS export when `audit-content-library` needs to reach `ready`. It must contain every published article in scope and all active drafts separately. Each record needs a stable ID, status, full Markdown, title, URL or slug, relevant dates, export provenance, export time, and evidence that pagination or batching is complete.
2. Primary sources, product facts, data, interviews, or other evidence required for the claims you want to make.
3. An author profile only when a named author's voice is required. It must contain the complete voice profile, the exact author identity, provenance, source reference, and freshness dates. A bio or a few published articles are not a substitute.

These files are called portable inputs because they can move between tools and environments without requiring direct access to the original private system. Do not put private CMS data or real author profiles in this public repository.

## Run the workflow

Start a new task with the proposed topic. Add a complete CMS export when it is already available; otherwise let the orchestrator tell you exactly what it needs. In Codex, use:

```text
Use $seo-writers:run-seo-writing-workflow in run mode.

Proposed topic: [your topic]
Corpus source: [path to the complete CMS export, or state that Flexim is unavailable]
Requested target: final_package

Run every safe stage, preserve resumable state, and stop at the first real
approval or missing-input boundary. Do not publish or mutate CMS.
```

In Claude Code, invoke `/seo-writers:run-seo-writing-workflow` with the same input.

The coordinator first runs `audit-content-library` in `pre-brief` mode. When it presents a proposed Article Brief, approve it explicitly before drafting. The Brief defines the reader and situation, useful action, promise and non-goals, search intent and scope, natural reader-facing key phrase when applicable, evidence and claim permissions, product role, authorship mode, permitted first person, and output requirements.

If you only want the portfolio or topic decision, set `Requested target: portfolio_decision`. The workflow returns the content-library decision and stops: it does not propose a working title or prepare an Article Brief. A title you explicitly supply is preserved as `fixed`; if it cannot be delivered honestly, the workflow returns `EDITORIAL_CONFLICT` with the smallest amendment instead of replacing it.

The state is returned inline and may also be saved under `.seo-writers/sessions/<workflowId>/workflow-state.json` in the private content repository's working tree. To continue later, invoke the same skill in `resume` mode with that state or path. The state belongs in the private content repository, not in the installed plugin or this public repository.

Then continue in this order:

```text
audit-content-library (pre-brief)
→ Article Brief approval
→ load-author-voice (only when needed)
→ draft-article
→ edit-article
→ independent editorial audits
→ chief-editor-review
→ visual-storytelling
→ final-integration-check
→ cold-reader-review
→ cms-draft-handoff (Flexim drafts only, with explicit permission)
```

The independent audit includes `audit-useful-action`, `audit-paragraph-structure`, `audit-tone-honesty`, `audit-eeat`, and a second `audit-content-library` pass in `pre-chief-editor` mode. The orchestrator dispatches them into clean isolated contexts when the host supports that. Otherwise it returns five self-contained packages for external isolated execution and resumes after the reports are supplied. Other specialist-owned stages are also dispatched when the host supports workers; the coordinator keeps intake, Article Brief approval, state, validation, and routing.

After the first complete pass, a correction does not automatically restart the whole workflow. The coordinator records its changed anchors, semantic effect, and affected concerns, then reruns only gates with changed controls. It carries another gate forward only with explicit provenance and a proven unchanged coverage fingerprint. Any reader-visible final change always repeats final integration and a fresh cold-reader review.

When an author is explicitly assigned, the linkage is verified, and a complete voice profile is ready, the Brief may use first person for the author's framing, navigation, and source-grounded judgment. This does not establish that the author personally used a product, observed a result, made a decision, or lived through an event; those claims still need evidence.

You can still invoke a specialist skill directly when you need only one stage or want to inspect its contract independently.

## Optional local Mermaid rendering

`visual-storytelling` decides whether a diagram is useful and prepares its media-map item, production brief, evidence permissions, privacy constraints, caption, and `alt`. Only then may the coordinator dispatch `render-mermaid-infographic`. A process mention or `[MEDIA: ...]` marker alone does not trigger it.

Start with a write-free preflight from the private content repository:

```text
Use $seo-writers:render-mermaid-infographic in preflight mode.

Private repository root: [absolute path]
Existing private output root: [absolute path inside that repository]
Mermaid source or approved structured specification: [path or content]
Production context: [path to the complete private context JSON]
```

For Claude Code, invoke `/seo-writers:render-mermaid-infographic` with the same package. One invocation handles one `visualId` and one `article`, `desktop`, or `mobile` canvas. SVG and PNG are both required; mobile is a separate composition when needed.

Preflight does not render, install, create a cache, or write output. If the pinned dependency cache is missing, it returns `SETUP_REQUIRED` and the exact setup command. Inspect that command and authorize it explicitly before execution. Safe setup always includes:

```bash
PUPPETEER_SKIP_DOWNLOAD=true node <installed-launcher> setup
```

The launcher resolves `<installed-launcher>` from the physical plugin payload and returns the exact host path; do not guess a Codex or Claude cache directory. Setup copies the bundled runtime into the platform user cache and runs the exact lockfile with `npm ci --omit=dev`. It does not download Chrome. `automatic` mode never performs setup.

After a ready preflight, request `render` mode with the same source, context, private root, and existing output root. The renderer works locally and returns preserved `.mmd`, SVG, PNG, HTML preview, JSON QA, hashes, and a `mermaidInfographicHandoff`. The asset remains `needs-production` until `visual-storytelling` performs human semantic review against the locked brief. Technical success is not editorial approval.

Beta limitations:

- the local browser launch currently uses `--no-sandbox` after strict source validation;
- only reviewed non-experimental syntax/preset pairs in the bundled allowlist are accepted;
- PDF, JPEG, WebP, animation, hosted embeds, online renderers, CMS mutation, and publication are not supported by this skill;
- missing Node, Chrome, setup, or a compatible brief blocks only this optional visual, not drafting or editing.

## Optional background execution

Background execution is optional. It belongs to Codex or Claude Code, not to the SEO Writers orchestrator. Whether the host is attached or detached, invoke `run-seo-writing-workflow` in its existing `run` or `resume` mode and keep using the same workflow-state file.

All editorial and authorization boundaries remain active in the background. The coordinator may continue safe stages, but it must stop for explicit Article Brief approval, critical missing input, author answers that are required to draft safely, media production, or permission to mutate a private CMS draft. It never publishes.

### Codex

For a long multi-step run, use [Goal mode](https://learn.chatgpt.com/docs/long-running-work) in the ChatGPT desktop app, Codex CLI, or the IDE extension. Start it from the private content repository's working tree with a goal such as:

```text
/goal Use $seo-writers:run-seo-writing-workflow in run mode for
"[your topic]" and work toward final_package. Preserve resumable state.
Stop for Article Brief approval or any required missing input. Do not mutate
CMS and do not publish.
```

Use the goal controls or the same task to pause, resume, steer, or provide an approval. Resuming the SEO workflow means invoking the skill in `resume` mode with the returned state or `.seo-writers/sessions/<workflowId>/workflow-state.json`; Goal mode does not replace that state.

[Codex Scheduled tasks](https://learn.chatgpt.com/docs/automations) can run recurring checks in the background, but they are not required for the editorial workflow and should not be used to bypass a human gate. A scheduled task that needs the private content repository's local working tree runs only while the computer is on and the desktop app is running. Web-only scheduled tasks cannot work directly in a folder on the computer.

### Claude Code

From the article repository, start a detached session with:

```bash
claude --bg 'Use /seo-writers:run-seo-writing-workflow in run mode for
"[your topic]" and work toward final_package. Preserve resumable state.
Stop for Article Brief approval or required missing input. Do not mutate CMS
and do not publish.'
```

To detach an already running interactive session, use `/bg` and optionally add one final instruction. Manage background sessions from the shell:

```bash
claude agents
claude attach <id>
claude logs <id>
claude stop <id>
```

Claude Code may move a background session into an isolated Git worktree before it edits files. Inspect and integrate any file changes from that session according to the host's [background session documentation](https://code.claude.com/docs/en/agent-view).

The optional `/loop` command is suitable for quick polling, not as the default way to run the article pipeline. For example:

```text
/loop 15m check whether the current SEO Writers workflow can resume from
saved state; if it is waiting for approval or missing input, report that
without changing the article
```

`/loop` is session-scoped and fires only while Claude Code is running and idle. Detaching the session with `/bg` can keep that session running, but it still depends on the local environment. For scheduling that must survive independently of the session or local machine, use separate hosted infrastructure described in the official [Claude Code scheduled tasks documentation](https://code.claude.com/docs/en/scheduled-tasks).

SEO Writers does not provide an always-on hosted runner. Such a runner can be added later without changing the portable skill contracts because workflow progress already lives in explicit resumable state.

## Flexim and other CMSs

With Flexim, use read-only access for content-library and author-profile retrieval. The final `cms-draft-handoff` may create or update a private draft only after explicit user permission and a ready final-integration package. It never publishes automatically.

Without Flexim, start with the files you have and answer the skills' focused requests for missing portable data. Run the text and visual-planning stages normally, then skip `cms-draft-handoff` and prepare a separate handoff for the destination CMS.

## Beta limitations

- The orchestrator is host-neutral and runs in the foreground by default. Optional background execution depends on Codex or Claude Code, and no always-on hosted service is included.
- The repository marketplace is available, but the plugin has not been submitted to the official Codex or Claude marketplace.
- Portable example files are not included; interactive skills request the required data instead.
- Independent audit execution depends on host-provided isolated contexts or external dispatch packages.
- Optional Mermaid production requires separately prepared local Node.js and Chrome dependencies and always requires human semantic review before integration.
- Publishing is outside the workflow and always requires a separate explicit action.
