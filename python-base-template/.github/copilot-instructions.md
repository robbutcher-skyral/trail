# GitHub Copilot — Code Review Instructions

These instructions tell Copilot how to review pull requests in this
repository. They complement (do not duplicate) [`AGENTS.md`](../AGENTS.md)
and [`CLAUDE.md`](../CLAUDE.md). If guidance here conflicts with
`AGENTS.md`, `AGENTS.md` wins and this file should be updated.

## Repository context

<!-- BOOTSTRAP: 2-3 sentences. What this repo produces, what language, what
     deployment target. -->

## Review philosophy

1. **High confidence only.** Comment when ≥80% sure an issue is real
   *and* material. If you cannot point to a concrete negative
   consequence, do not comment.
2. **Terse.** One sentence per comment when feasible: state the problem,
   then the fix. Avoid `consider`, `you might want to`, `perhaps`.
3. **Silence is fine.** A PR with no Copilot comments is a valid
   outcome. Do not look for things to say.
4. **Do not restate CI failures.** If a check has already failed
   (pre-commit, tests, build), the author can see it.

## Priority areas

<!-- BOOTSTRAP: list the 3-7 issues a human reviewer would actually catch
     in this repo, ordered by impact. Examples a bootstrap might add:
     "Public API breakage", "Migration safety", "Auth/secret handling",
     "Trivy / supply-chain", "Performance regressions". Anchor each to a
     concrete consequence. -->

## What CI already catches — do not restate

- pre-commit hooks (formatting, linting, markdownlint, yamllint, etc.).
- Test suite failures.
- Build failures.

<!-- BOOTSTRAP: add repo-specific gates (Trivy, mkdocs --strict,
     release-please, schema validation, etc.). -->

## What to skip

- Style and formatting — pre-commit handles this.
- Variable / argument renames unless an existing name breaks a documented
  convention.
- "Consider extracting…" / DRY suggestions across files unless the
  duplication is a real maintenance burden.
- "This could be more efficient" without a measured impact.
- Speculative compatibility concerns — the build and test suite will
  surface real ones.

## Comment format

1. **Problem** — one sentence naming the file and the specific issue.
2. **Why** (only if non-obvious) — the consequence
   (correctness / security / supply-chain / CI).
3. **Fix** — a concrete change, ideally as a single-line code suggestion.

If you cannot fill in step 3, you do not have enough confidence to post
the comment.

## When to stay silent

Stay silent if **any** of these apply:

- Confidence below the 80% threshold.
- Style-only or formatting-only feedback.
- The issue is already failing in CI.
- The change conforms to a pattern documented in `AGENTS.md`.
- The author has a comment in the diff explaining a deliberate judgement
  call.
- You would be guessing at intent.

## Reference paths

<!-- BOOTSTRAP: list 3-6 paths the reviewer should ground itself against
     (AGENTS.md, key configs, ADR location, schema files). -->

- [`AGENTS.md`](../AGENTS.md) — full contributor guide and rationale.
- [`README.md`](../README.md) — repository overview.
