# First-use AI Bootstrap Prompt

Use this once, after creating a new repository from
[`skyral-group/base-template`](https://github.com/skyral-group/base-template).
It populates the AI agent instruction files
([`AGENTS.md`](../../AGENTS.md), [`CLAUDE.md`](../../CLAUDE.md),
[`.github/copilot-instructions.md`](../../.github/copilot-instructions.md))
with content specific to this repository.

## How to run it

1. Open the repo in Claude Code (or any agent that can read the file
   tree). [Claude Code](https://www.anthropic.com/claude-code) is the
   recommended choice; the prompt is agent-agnostic but assumes Claude's
   tool surface (Read, Edit, Bash).
2. Paste the prompt below verbatim.
3. Review every change the agent proposes. Do not let it auto-commit.
   Especially scrutinise the **Domain knowledge** section in `AGENTS.md`
   — bounded contexts and ubiquitous language are decisions, not guesses.
4. Commit on a draft PR for human review:
   `EVE-XXXX docs: bootstrap AI agent instructions`.

## The prompt

> You are bootstrapping AI agent instructions for a Skyral repository
> created from `skyral-group/base-template`. Your job: replace every
> `<!-- BOOTSTRAP: ... -->` marker in `AGENTS.md`, `CLAUDE.md`, and
> `.github/copilot-instructions.md` with content grounded in this
> repository.
>
> **Step 1 — explore.** Read `README.md`, `pyproject.toml` /
> `package.json` / `go.mod` (whichever exists), `.tool-versions`,
> `mkdocs.yaml`, `docs/index.md`, the top-level source directory, and
> `.github/workflows/`. Skim — do not summarise. Build a picture of:
> what the repo produces, who consumes it, what language and frameworks,
> what tests exist, what CI gates already run.
>
> **Step 2 — propose, do not commit.** For each `BOOTSTRAP` marker:
>
> - **AGENTS.md → Project overview**: write 2–3 sentences grounded in
>   `README.md`. Do not invent capabilities the code does not show.
> - **AGENTS.md → Tech stack**: edit the table to reflect the actual
>   versions you read. Remove rows that do not apply.
> - **AGENTS.md → Architecture**: produce a real directory tree (top 2
>   levels) plus 1–3 paragraphs on layering and data flow. If the repo
>   has multiple bounded contexts, name them.
> - **AGENTS.md → Conventions/File naming**: if there is a clear
>   convention in the existing code, name it; otherwise write
>   `<follow language defaults>`.
> - **AGENTS.md → Domain knowledge**: this is the hardest part. Propose
>   a single `# Bounded context: <name>` line based on what the repo
>   does. Then list 5–15 candidate ubiquitous-language terms — favour
>   terms used in `README.md`, `docs/`, and module names. Mark each
>   `(proposed — please confirm)`. Do not invent a domain the code does
>   not support.
> - **AGENTS.md → Testing, Dependencies, Common patterns**: fill in
>   from observed reality. If absent, say so explicitly with a TODO
>   pointing at a follow-up issue.
> - **CLAUDE.md → Project skills and commands**: list any
>   `.claude/skills/` or `.claude/commands/` already in the repo. Leave
>   the section empty if none — do not invent.
> - **`.github/copilot-instructions.md` → Repository context**: copy the
>   AGENTS.md project overview, trimmed to ≤80 words. Do not duplicate
>   from elsewhere.
> - **`.github/copilot-instructions.md` → Priority areas**: pick 3–7
>   things a *human reviewer* would catch in this repo. Anchor each to a
>   concrete consequence. Reasonable starting points by repo type:
>   service repos → public API breakage, auth/secret handling, migration
>   safety; library repos → semver discipline, breaking exports;
>   container repos → base-image discipline, Trivy gates;
>   infrastructure repos → blast radius, drift between Terraform and
>   live state. Drop categories that do not apply.
> - **`.github/copilot-instructions.md` → What CI already catches**:
>   read `.github/workflows/` and list real check names. Do not write
>   "tests" if there are no tests.
> - **`.github/copilot-instructions.md` → Reference paths**: 3–6
>   real paths in this repo that anchor a review (configs, schemas,
>   ADRs).
>
> **Step 3 — char-budget the Copilot file.** GitHub Copilot Code Review
> truncates `.github/copilot-instructions.md` past ~4000 characters.
> Run `wc -c .github/copilot-instructions.md`; if over 3500, trim the
> Priority Areas and Reference Paths sections until under 3500 (leaving
> 500 chars headroom). Do not strip the Review Philosophy or What-To-Skip
> sections — those are the discipline overlay.
>
> **Step 4 — present a diff for human review.** Do not commit. Show the
> proposed edits in the conversation, grouped by file, and stop. The
> engineer running this prompt will confirm or correct each section
> before you write to disk.
>
> **Step 5 — after approval.** Once the engineer signs off, write the
> files, run `pre-commit run --all-files`, and stage the changes for a
> draft PR. Use the commit message format
> `<JIRA-ID> docs: bootstrap AI agent instructions`.
>
> **Constraints — read carefully:**
>
> - Do not duplicate content between `AGENTS.md` and `CLAUDE.md` /
>   `.github/copilot-instructions.md`. The hub is the single source of
>   truth.
> - `CLAUDE.md` should stay under 80 lines after your edits.
> - `.github/copilot-instructions.md` should stay under 4000 characters.
> - Preserve the structure and headings of the templates. Only edit the
>   `<!-- BOOTSTRAP: ... -->` markers and the placeholder content beneath
>   them. Remove the markers themselves once the content is filled in.
> - Do not invent Jira IDs, ADR numbers, or domain terms.
> - If a section genuinely cannot be filled in (e.g. there are no tests
>   yet), say so with `<!-- TODO: ... -->` and a one-line reason.

## After running the prompt

- Verify `wc -c .github/copilot-instructions.md` reports under 4000.
- Verify `CLAUDE.md` is under 80 lines.
- Run `pre-commit run --all-files` and resolve any failures.
- Open a **draft** PR titled `<JIRA-ID> docs: bootstrap AI agent instructions`.
- Tag a domain expert (not just an engineer) on the
  `# Domain knowledge` section. Bounded contexts and ubiquitous language
  are product decisions; engineering review alone is insufficient.
