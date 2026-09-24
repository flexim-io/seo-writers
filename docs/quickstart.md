# Quickstart

SEO Writers is distributed as one beta plugin for Codex and Claude Code. Both packages use the same 15 skills, including `run-seo-writing-workflow` for coordinating or resuming the complete pipeline and the optional `render-mermaid-infographic` production worker.

## Requirements

- Codex with plugin support or Claude Code with plugin support
- GitHub access to this repository
- a separate private content repository for article production
- a proposed article topic

Optional local Mermaid production additionally requires Node.js 22 or newer and a compatible installed Chrome or Chromium. These are not requirements for the text workflow.

Flexim is recommended, not required. Start with the topic and data you already have. In interactive modes, each skill requests the missing portable input it actually needs. In `automatic` mode, it asks no questions and returns a precise blocker instead of inventing data.

Run the workflow from a checkout or worktree of the private content repository, not from the SEO Writers clone. Keep all real briefs, sources, exports, author data, drafts, media, checkpoints, and boundary handoffs in that repository. See [Content repositories](content-repositories.md) for the boundary.

## Install in Codex

Add this repository as a marketplace, then install the plugin:

```bash
codex plugin marketplace add flexim-io/seo-writers --ref main
codex plugin add seo-writers@flexim
```

Start a new Codex task after installation. Plugin skills use the `seo-writers:` namespace.

## Install in Claude Code

**Inside a Claude Code session**, run each slash command separately:

```text
/plugin marketplace add flexim-io/seo-writers
/plugin install seo-writers@flexim
```

Choose **User scope** if you want the plugin available across your projects.

**From your terminal**, use these commands instead:

```bash
claude plugin marketplace add flexim-io/seo-writers@main
claude plugin install seo-writers@flexim
```

Start a new Claude Code session after installation. If the install summary asks for it, run `/reload-plugins`. Plugin skills use commands such as `/seo-writers:audit-content-library`.

### If installation does not work

- **The plugin is missing from Discover:** add `flexim-io/seo-writers` first. SEO Writers is distributed through the `flexim` repository marketplace and is not currently listed in Anthropic's official or community catalog.
- **The `claude` command is not found:** use the slash commands inside your installed Claude Code session, or follow the official [Claude Code setup guide](https://code.claude.com/docs/en/setup) to install the CLI.
- **The plugin installed but its skills are missing:** open `/plugin` and confirm `seo-writers` is installed and enabled, then reload plugins or start a new session. Check the Errors tab if it still fails.
- **The marketplace cannot be cloned or is blocked:** keep the exact error message. Check GitHub connectivity and whether your organization's marketplace policy permits `flexim-io/seo-writers`; a catalog listing does not bypass an administrator's policy.

To inspect the installation from a terminal, run `claude plugin list` and `claude plugin details seo-writers@flexim`. If you report an installation issue, include the error, `claude --version`, and whether you used terminal commands or session slash commands. Remove credentials and private content from the report.

## Update an installed plugin

At workflow startup and after a context change, the coordinator checks the source/version of its loaded skills against available published release metadata. It reports a newer or unverified version once and continues with the known loaded package. It does not install updates or repeat the check on every editorial stage. This check becomes available only after a version containing it is loaded; an older running task cannot gain it automatically.

For an existing repository-marketplace installation in Codex:

```bash
codex plugin marketplace upgrade flexim
codex plugin add seo-writers@flexim
```

For an existing repository-marketplace installation in Claude Code:

```bash
claude plugin marketplace update flexim
claude plugin update seo-writers@flexim
```

Verify the installed version, then start a fresh task/session with the article's boundary handoff, or use a supported reload that refreshes plugin skills. Installation alone does not prove the current task has new instructions. For a manually linked local Codex plugin, follow OpenAI's [local plugin reload guidance](https://developers.openai.com/plugins/build/plugins#install-a-local-plugin-manually), including restarting the desktop app when required. A reviewed hosted catalog is a separate distribution: a GitHub release does not prove that its version is available there. Use that catalog's update path instead of these repository commands.

## Connect Flexim for an onboarding prompt

Paste the writing prompt from Flexim into your agent in the private content repository. It carries the available topics and their research. The agent compares the topics, recommends a starting point, and waits for your choice before preparing the Article Brief. You do not need a blog or a CMS to write the article.

When helping with setup, inspect the current host and its available tools and skills first. Reuse a working connection to the exact workspace and an installed SEO Writers package. Do not remove unrelated settings or replace a same-named connection pointing elsewhere. Install only missing capabilities through the host's supported commands above; if the host cannot perform installation, give the exact next step. After installation, start a fresh task or session and carry over the original prompt or boundary handoff.

Use the exact MCP endpoint and connection name supplied by Flexim. These shell variables are placeholders to replace with those values:

```bash
flexim_mcp_name='CONNECTION_NAME_FROM_FLEXIM'
flexim_mcp_endpoint='MCP_ENDPOINT_FROM_FLEXIM'
```

In Codex, add the connection only when it is missing:

```bash
codex mcp add "$flexim_mcp_name" --url "$flexim_mcp_endpoint" --oauth-resource "$flexim_mcp_endpoint"
codex mcp login "$flexim_mcp_name"
```

In Claude Code:

```bash
claude mcp add --transport http "$flexim_mcp_name" "$flexim_mcp_endpoint"
```

Open `/mcp` in an interactive Claude Code session and authenticate that connection. Browser sign-in and consent are performed by the user; the agent cannot approve them on the user's behalf. This follows Claude Code's [remote MCP authentication](https://code.claude.com/docs/en/mcp#authenticate-with-remote-mcp-servers). A configured connection is not proof of access: after sign-in, discover the actual tools and perform a read-only lookup of the selected topic in the supplied workspace. A missing or denied capability stays unavailable; do not claim setup succeeded or manufacture a replacement response.

With another agent, check its support for these skills and an authenticated Streamable HTTP MCP connection. Compatibility is not universal. If either capability is unavailable, use the supported Codex or Claude Code path, or work from complete portable research. Missing isolated workers still requires the documented external review packages; another agent does not waive editorial gates.

The workflow keeps the chosen topic's original identity, market, and complete source brief with its article artifacts. A later session resumes that selection instead of choosing again. Missing context identifiers remain unknown and never become guessed topic IDs. Writing produces a portable article package; saving in Flexim requires a separate destination decision and a verified private draft record.

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

Start a new task or session after the migration. If you need to resume an old workflow, supply its `.seo-writing-os/sessions/.../workflow-state.json` once as legacy migration input. The coordinator resolves the referenced artifacts, creates a short boundary handoff, and continues with checkpoints. Do not copy the old state into a new path or keep updating it; retain the original only as a backup until migration is verified.

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

1. A complete content inventory when `audit-content-library` needs to reach `ready`. If you already have content, supply a complete CMS export with every published article in scope and all active drafts separately. Each record needs a stable ID, status, full Markdown, title, URL or slug, relevant dates, export provenance, export time, and evidence that pagination or batching is complete. If this is your first article, explicitly confirm that the complete project scope has no published content or other active drafts, including outside Flexim. An empty-library declaration needs its scope and date, not a CMS or an empty export file.
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

Run every safe stage, preserve checkpoint artifacts, create a short handoff only
at an interruption or context boundary, and stop at the first real
approval or missing-input boundary. Do not publish or mutate CMS.
```

In Claude Code, invoke `/seo-writers:run-seo-writing-workflow` with the same input.

The coordinator first runs `audit-content-library` in `pre-brief` mode. It then clarifies your intended point, approach, available material, and limits before fixing the direction. Answers can change the argument and structure; supplied answers are reused. When it presents the resulting Article Brief, approve it explicitly before drafting. The Brief defines the reader and situation, useful action, promise and non-goals, search intent and scope, natural reader-facing key phrase when applicable, evidence and claim permissions, product role, authorship mode, permitted first person, and output requirements.

If you only want the portfolio or topic decision, set `Requested target: portfolio_decision`. The workflow returns the content-library decision and stops: it does not propose a working title or prepare an Article Brief. A title you explicitly supply is preserved as `fixed`; if it cannot be delivered honestly, the workflow returns `EDITORIAL_CONFLICT` with the smallest amendment instead of replacing it.

During one uninterrupted task, the coordinator does not create or update a workflow-state file. It uses the conversation, one working Markdown, and completed specialist artifacts. Immutable reader checkpoints are created only for the draft, chief-editor lock, and final package. If work is interrupted, blocked, deferred, or moved to another context, the coordinator writes a short boundary handoff that references the needed checkpoints and reports.

To continue later, invoke the same skill in `resume` mode with that short handoff and its referenced artifacts. The coordinator validates the artifacts and derives the current stage rather than trusting a stored stage label. Checkpoints and handoffs belong in the private content repository, not in the installed plugin or this public repository.

Then continue in this order:

```text
audit-content-library (pre-brief)
→ provisional direction and author discovery (draft-article structure)
→ Article Brief approval
→ load-author-voice (only when needed)
→ remaining evidence needs (draft-article preflight)
→ draft-article
→ edit-article
→ independent editorial audits
→ chief-editor-review
→ visual-storytelling
→ final-integration-check
→ cold-reader-review
→ cms-draft-handoff (Flexim drafts only, with explicit permission)
```

Initial direction questions happen before the model classifies remaining evidence needs as required, recommended, or unnecessary. They are not optional examples for an already chosen outline. You can supply the answers in advance or explicitly ask for source-only writing without further author participation. A pause or no reply leaves discovery pending; “write from sources now” records your scoped choice to proceed. A neutral outline proposed by the model cannot skip this step.

After discovery, a recommended interview for a remaining concrete contribution comes with your choice: do it now, skip it, or defer it. Existing answers and instructions are respected across workers, resume, and later audits. A required evidence gap still needs evidence or an approved change to the promise. The first evidence audit receives your actual early answers, so omitted material can be integrated without repeating the interview.

From 0.13.0, `automatic` also stops before a new full draft when author discovery is pending. Supply relevant author intent/material or an explicit instruction to proceed without additional participation. Automatic fallback remains available for residual optional evidence opportunities only. Existing written articles continue through review and amendments; they are not restarted merely because an older handoff lacks `authorDiscovery`.

After editing, the coordinator shows the edited draft immediately and identifies the remaining checks. You can read it while work continues; showing it adds no approval step and does not make it a final package.

The independent audit includes `audit-useful-action`, `audit-paragraph-structure`, `audit-tone-honesty`, `audit-eeat`, and a second `audit-content-library` pass in `pre-chief-editor` mode. The orchestrator dispatches them into clean isolated contexts in waves that fit the host's available slots. It obtains complete handoffs before retiring workers and retries a failed transfer only after the relevant condition changes. If fresh contexts are unavailable, it returns self-contained packages for the missing independent gates and resumes after the reports are supplied. Other specialist-owned stages are also dispatched when the host supports workers; the coordinator keeps intake, Article Brief approval, checkpoint discovery, validation, and routing.

Audit reports default to findings plus compact complete coverage. Every unit is still checked; passing units can be grouped, while evidence claims retain exact source and provenance records. Ask for expanded detail when useful. Custom audit consumers must accept `reportDetail: findings`, anchored inventories or the native evidence/corpus inventory, grouped passes, and concern-specific input provenance. An expanded successful row for every paragraph is no longer the default.

After the first complete pass and chief-editor lock, consecutive corrections form one revision batch. While you are listing changes, the working Markdown stays unchanged: the coordinator remembers the exact replacements, replies naturally, and does not run file commands, audits, or final checks. Another correction automatically continues the batch. Say the natural equivalent of “done,” “apply the changes,” “check it,” or “show me the result” to close it; requesting a CMS draft also closes it. The coordinator then applies all corrections in one consolidated patch, compares the complete result with the last checkpoint, creates one aggregate change-impact record, reruns only gates with changed controls, and carries another gate forward only with explicit provenance and a proven unchanged coverage fingerprint. A changed reader-visible surface receives final integration and a fresh cold-reader review once after the complete batch is ready.

If an interview is needed, the coordinator saves one completed interview artifact instead of rewriting the full transcript after every answer. It creates an intermediate checkpoint only when the interview is interrupted, blocked, deferred, or at material risk of context loss.

A paragraph split reruns paragraph review and any other judgment it actually affects. Unchanged claims, tone, and portfolio role can retain their earlier reviews with explicit anchor mapping and unchanged inputs. A changed claim, source, promise, link destination, or relationship disclosure reruns its dependent checks even if the reader-file hash stayed the same. Byte identity alone is not evidence that external facts are current.

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

Background execution is optional. It belongs to Codex or Claude Code, not to the SEO Writers orchestrator. Whether the host is attached or detached, invoke `run-seo-writing-workflow` in its existing `run` or `resume` mode and keep using the same checkpoints and boundary handoff.

All editorial and authorization boundaries remain active in the background. The coordinator may continue safe stages, but it must stop for explicit Article Brief approval, critical missing input, author answers that are required to draft safely, media production, or permission to mutate a private CMS draft. It never publishes.

### Codex

For a long multi-step run, use [Goal mode](https://learn.chatgpt.com/docs/long-running-work) in the ChatGPT desktop app, Codex CLI, or the IDE extension. Start it from the private content repository's working tree with a goal such as:

```text
/goal Use $seo-writers:run-seo-writing-workflow in run mode for
"[your topic]" and work toward final_package. Preserve checkpoint artifacts
and create a short handoff only at a context boundary.
Stop for Article Brief approval or any required missing input. Do not mutate
CMS and do not publish.
```

Use the goal controls or the same task to pause, resume, steer, or provide an approval. In the same task, the conversation and artifacts retain the active context. In a fresh task, invoke the skill in `resume` mode with the short boundary handoff and referenced checkpoints; Goal mode does not replace those artifacts.

[Codex Scheduled tasks](https://learn.chatgpt.com/docs/automations) can run recurring checks in the background, but they are not required for the editorial workflow and should not be used to bypass a human gate. A scheduled task that needs the private content repository's local working tree runs only while the computer is on and the desktop app is running. Web-only scheduled tasks cannot work directly in a folder on the computer.

### Claude Code

From the article repository, start a detached session with:

```bash
claude --bg 'Use /seo-writers:run-seo-writing-workflow in run mode for
"[your topic]" and work toward final_package. Preserve checkpoint artifacts
and create a short handoff only at a context boundary.
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
its checkpoints and boundary handoff; if it is waiting for approval or missing input, report that
without changing the article
```

`/loop` is session-scoped and fires only while Claude Code is running and idle. Detaching the session with `/bg` can keep that session running, but it still depends on the local environment. For scheduling that must survive independently of the session or local machine, use separate hosted infrastructure described in the official [Claude Code scheduled tasks documentation](https://code.claude.com/docs/en/scheduled-tasks).

SEO Writers does not provide an always-on hosted runner. Such a runner can be added later without changing the portable skill contracts because workflow progress already lives in explicit checkpoints, specialist artifacts, and short boundary handoffs.

## Flexim and other CMSs

You do not need to choose a CMS before writing. Once the article is ready, the agent asks where to save it, unless you have already chosen.

- If you have your own CMS, the agent prepares the finished Markdown, approved metadata, and a short transfer guide. You save these in your system yourself. This completes the workflow without a Flexim draft.
- If you choose Flexim, explicitly ask the agent to set up your blog and save this article as a private draft. It reuses the canonical blog structure through MCP, then verifies the saved article by reading it back. Missing access preserves the finished article and gives you the specific connection or permission step needed to continue.

The article being written, its linked topic being marked done, and a draft being saved are separate facts. The agent can update an authorized, verified topic after writing even when you use another CMS. A saved draft is confirmed only by its actual record. Topic and destination context survive a later session, so you can continue without choosing the topic again.

Website API connection is a separate action in Flexim after saving. Nothing is published or connected automatically.

## Beta limitations

- The orchestrator is host-neutral and runs in the foreground by default. Optional background execution depends on Codex or Claude Code, and no always-on hosted service is included.
- The repository marketplace is available, but the plugin has not been submitted to the official Codex or Claude marketplace.
- Portable example files are not included; interactive skills request the required data instead.
- Independent audit execution depends on host-provided isolated contexts or external dispatch packages.
- Optional Mermaid production requires separately prepared local Node.js and Chrome dependencies and always requires human semantic review before integration.
- Publishing is outside the workflow and always requires a separate explicit action.
