# {Project name} -- AI Agent Instructions

Universal source of truth for AI assistants working in this repository.
Tool-specific configuration lives in spoke files that reference this document:
[`CLAUDE.md`](CLAUDE.md) for Claude Code and
[`.github/copilot-instructions.md`](.github/copilot-instructions.md) for GitHub Copilot.

This file ships from
[`skyral-group/base-template`](https://github.com/skyral-group/base-template).
On first use, run the bootstrap prompt at
[`docs/ai/bootstrap-prompt.md`](docs/ai/bootstrap-prompt.md) to fill in
every `<!-- BOOTSTRAP: ... -->` marker below with repository-specific
content, then delete this paragraph.

---

## Project overview

<!-- BOOTSTRAP: 2-3 sentences. What does this repo produce? Who uses it?
     What is the primary output (API, library, CLI tool, documentation,
     infrastructure config)? -->

---

## Tech stack

<!-- BOOTSTRAP: edit the rows below to match this repo. Remove rows that
     do not apply. Add rows for anything else that matters. -->

| Aspect | Detail |
|--------|--------|
| Language | {e.g. TypeScript 5.4, Go 1.22, Python 3.13} |
| Framework | {e.g. Next.js 14, FastAPI, Gin} |
| Package manager | uv (Python) / pnpm / go modules |
| Build / docs | mkdocs-material with `techdocs-core` |
| Linting | pre-commit + language-specific (ruff, golangci-lint, ESLint) |
| Testing | {e.g. pytest, go test, Vitest} |
| CI/CD | GitHub Actions |
| Tooling pinning | `asdf` via `.tool-versions`; `direnv` via `.envrc` |
| Registry | Skyral Google Artifact Registry (`europe-west2-docker.pkg.dev`) |

---

## Architecture

<!-- BOOTSTRAP: directory tree (top 2 levels usually) plus 1-3 paragraphs on
     key architectural decisions. Mention bounded contexts if they exist. -->

```text
src/                    # Application source
docs/                   # Documentation (mkdocs)
deploy/                 # Deployment configuration
tests/                  # Tests
```

---

## Conventions

### File and directory naming

<!-- BOOTSTRAP: kebab-case? PascalCase? How are test files named? -->

### Commit messages

Conventional Commits with a Jira issue ID prefix, per
`.github/pull_request_template.md`. Example: `EVE-123 feat: add feature x`.
Equivalent shapes are valid: `EVE-123 fix: ...`, `EVE-123 chore: ...`,
`EVE-123 docs(scope): ...`. Renovate / Dependabot may use scoped types
(`fix(deps): ...`) without a Jira prefix.

### Branch naming

`<jira-id>-<short-description>` in lowercase kebab-case
(e.g. `eve-123-add-feature-x`). Renovate uses `renovate/...`.

### Code style

Auto-formatted via `pre-commit`. Do not bypass hooks (`--no-verify`) to
land changes; fix the underlying issue.

### PR conventions

- Open as **draft** until ready for review.
- Title follows the commit-message convention above.
- Body uses the repo's `.github/pull_request_template.md`
  (What / How / Why).
- Squash-merge by default.

---

## Non-negotiable rules

### NEVER

1. **NEVER bypass pre-commit hooks** (`--no-verify`, `-c commit.gpgsign=false`).
   The hooks are the contract; bypassing them lands broken commits and
   masks real problems.
2. **NEVER commit secrets, tokens, service-account keys, or `.env`
   files**. Use Workload Identity for CI and `gcloud auth` for local
   development.
3. **NEVER add a blanket `.claude/` ignore to `.gitignore`**. Project
   skills, commands, and settings live there and ship with the repo. The
   `.gitignore` already narrows ignores to `.claude/settings.local.json`
   and `.claude/worktrees/`.

### ALWAYS

1. **ALWAYS read this file (`AGENTS.md`) before starting work**. The
   spoke files (`CLAUDE.md`, `.github/copilot-instructions.md`) point
   here for a reason.
2. **ALWAYS pull `asdf` versions before running commands**. `setup.sh`
   handles this. Tooling drift is the most common source of "works on my
   machine".
3. **ALWAYS prefer Skyral central packages** (Google Artifact Registry,
   `skyral-group/agent-skills` skills, `skyral-group/hardened-images`
   for container bases) over public alternatives. See the `tooling-guide`
   skill for the canonical sources.

### WHEN IN DOUBT

1. **WHEN IN DOUBT, ask rather than assume about domain language**.
   Section *Domain knowledge* below names the bounded context and
   ubiquitous-language terms; if a term is missing, ask before inventing
   one.
2. **WHEN IN DOUBT, follow the existing pattern in this repo**. If the
   pattern is wrong, fix it as a focused change, do not rewrite around it.
3. **WHEN IN DOUBT, prefer one combined PR over many small ones** unless
   the changes are truly independent. Skyral's swarm convention is "one
   PR, one purpose" — splitting a single purpose into multiple PRs
   creates rebase churn.

---

## Domain knowledge

<!-- BOOTSTRAP: name the bounded context this repo serves and list 5-15
     ubiquitous-language terms with one-line definitions. The bootstrap
     prompt will infer a first draft; the engineer must confirm or
     correct it before committing. -->

- **{Bounded context}** — {one-line description of the domain this repo
  owns}
- **{Term}** — {definition and why it matters}

---

## Testing

<!-- BOOTSTRAP: how to run the test suite, which framework, where files
     live, coverage expectations. -->

```bash
# Run all tests
{command}

# Run a specific test
{command}
```

---

## Dependencies

Dependencies update via Renovate (preferred) or Dependabot. Manual
additions follow the language tool (`uv add`, `pnpm add`, `go get`).
Private packages resolve from Skyral's Google Artifact Registry — see
the [`skyral-gar`](https://github.com/skyral-group/agent-skills/tree/main/skills/skyral-gar)
skill for authentication.

<!-- BOOTSTRAP: add any repo-specific dependency constraints (e.g.
     "no new runtime deps without ADR", "pin transitive X to Y"). -->

---

## Common patterns

### Adding a new {feature/module/component}

<!-- BOOTSTRAP: 3-5 numbered steps a contributor follows. The goal is to
     prevent AI assistants from inventing their own workflow. -->

### Fixing a bug

1. Reproduce locally with a failing test.
2. Use the
   [`systematic-debugging`](https://github.com/obra/superpowers) skill
   from the `superpowers` plugin to isolate root cause.
3. Land the failing test first, then the fix, then close out.

---

## Quick reference

| Task | Command |
|------|---------|
| Set up dev environment | `./setup.sh` |
| Run pre-commit on all files | `pre-commit run --all-files` |
| Build docs locally | `uv run mkdocs serve` |
| Run tests | `<bootstrap>` |
| Open a PR | `gh pr create --draft` |

---

## Workflow stack (Skyral baseline)

This repository participates in Skyral's agentic AI baselines (see the
[Agentic AI TechDoc in `ee-sdlc`](https://backstage.skyral.dev/docs/default/system/sdlc)).
The expected workflow is:

- **Big work** (story, epic, new bounded context, multi-module change,
  public-API change) → use [GitHub spec-kit](https://github.com/github/spec-kit):
  `/speckit.constitution` (referencing this file rather than duplicating
  it) → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` →
  `/speckit.implement`.
- **Small work** (single-file fix, refactor, spike, config change) →
  superpowers `brainstorming` + `writing-plans` skills.
- **Always-on discipline** (regardless of which workflow drove the spec):
  `systematic-debugging`, `test-driven-development`,
  `requesting-code-review`, `receiving-code-review`,
  `verification-before-completion`, `using-git-worktrees`.

Decision rule: **big work = spec-kit, small work = brainstorming**.
