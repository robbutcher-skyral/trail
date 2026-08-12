# Claude Code Instructions

Read [`AGENTS.md`](AGENTS.md) for all project conventions, architecture,
domain knowledge, and non-negotiable rules. This file contains only
Claude Code-specific configuration.

## Recommended plugins

| Plugin | Purpose |
|--------|---------|
| [`obra/superpowers`](https://github.com/obra/superpowers) | Brainstorming, planning, TDD, systematic-debugging, code review, worktrees, verification-before-completion |
| [`skyral-group/agent-skills`](https://github.com/skyral-group/agent-skills) | Skyral-specific skills (`tooling-guide`, `dependabot`, `go-upgrade`, `hardened-containers`, `skyral-gar`) |

Install `agent-skills` once per machine:

```bash
git clone https://github.com/skyral-group/agent-skills.git \
  && cd agent-skills && ./install.sh
```

## Project skills and commands

<!-- BOOTSTRAP: list any project-level skills or slash commands committed
     under .claude/skills/ or .claude/commands/. Leave empty if none. -->

## Editing guidance

- Project-level Claude Code config lives under `.claude/` and is
  committed (`.claude/skills/`, `.claude/commands/`,
  `.claude/settings.json`). Personal overrides
  (`.claude/settings.local.json`) and ephemeral worktrees
  (`.claude/worktrees/`) are gitignored.
- For non-trivial work, use the workflow stack documented in
  `AGENTS.md` ("big work = spec-kit, small work = brainstorming"). Do
  not invent your own workflow.
