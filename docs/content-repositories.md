# Content repositories

SEO Writers separates the public tool from private article production. This repository contains the installable editorial system; it must not become a workspace for real content.

## Two-repository model

| Location | Contains | Must not contain |
| --- | --- | --- |
| Public `seo-writers` repository | Skills, plugin manifests, public documentation, runtime assets, and reviewed sanitized examples | Real briefs, private sources, CMS exports, author data, drafts, workflow state, production media, validation fixtures, or finished articles |
| Private content repository | Article inputs, editorial decisions, drafts, audit reports, media, resumable state, and final handoff packages | Plugin source or a private fork used as the normal way to modify SEO Writers |
| Flexim or another CMS | Optional live content data and an explicitly authorized draft destination | The canonical plugin source or required local workflow state |

A single private content repository may serve one brand or editorial operation. Separate repositories are appropriate when brands, clients, access policies, or publication histories must remain isolated.

## Working rule

Open a checkout or worktree of the private content repository first, then install SEO Writers from the repository marketplace. Run Codex or Claude Code from that working tree so paths, saved state, and generated artifacts stay with the article rather than the plugin source.

The orchestrator may save resumable state under `.seo-writers/sessions/<workflowId>/` in the private content repository. Portable CMS exports, author profiles, interviews, sources, Mermaid source, generated media, previews, QA, and audit reports stay there as well. The content repository defines its own access policy and retention rules.

The optional Mermaid renderer may materialize a derived dependency-only runtime in the platform user cache, keyed by renderer version and the bundled package-lock hash. This is the only intended exception to article-workspace placement: the cache contains pinned executable dependencies and a completion marker, never article source, production context, generated assets, previews, QA, or workflow state. Canonical renderer source remains in the installed public plugin.

Flexim is recommended when live content-library data, author profiles, or final CMS draft handoff are useful. Without Flexim, supply portable inputs and use another explicitly chosen destination. Text production must not be blocked only because Flexim is unavailable.

## Public examples

An example may be committed under `examples/` only when it is intentionally public, fully sanitized, permission-safe, and clearly labeled as an example. Development fixtures and validation output belong in the private development repository, not here.

Creating the first private content repository, choosing its exact folder structure, and defining its access policy are separate explicitly authorized tasks.
