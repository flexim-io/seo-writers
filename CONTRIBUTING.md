# Contributing to SEO Writers

SEO Writers is the public runtime and distribution repository. Issues and focused pull requests are welcome.

## Public contribution boundary

- Change canonical skill contracts under `skills/<skill>/` and bundled production code under `runtime/<runtime>/`.
- Keep the Codex and Claude Code manifests aligned when package metadata changes.
- Update user-facing documentation when behavior, installation, or limitations change.
- Never commit real Article Briefs, CMS exports, sources, author profiles, interviews, drafts, workflow checkpoints, boundary handoffs, media, credentials, or finished private articles.
- Add an example only when it is intentionally public, fully sanitized, permission-safe, and clearly labeled.

Development validation, synthetic fixtures, release automation, syntax catalogs, galleries, baselines, and maintainer policy are kept in a separate private development repository. Public runtimes must not contain `node_modules`, caches, generated artifacts, private fixtures, or baseline-approval tooling. Maintainers run the private checks before merging or releasing public runtime changes.

Do not create version tags or GitHub Releases from a contribution branch. A maintainer publishes a release only after the public runtime snapshot passes the private validation suite.
