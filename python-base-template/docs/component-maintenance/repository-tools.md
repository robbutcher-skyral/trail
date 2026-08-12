# Repository Tooling

This document describes the various tools and files used by this repository.

There are no instructions to follow in this document, so if you are familiar with all these tools, you need not read further.

## README (`README.md`)

This markdown file describes the high-level details of your repository, what it contains, how to use it, and how to contribute to it.

The documentation already in this README template may prove useful to assist with onboarding others to the tools used in your repository.

## Repository Setup Script (`setup.sh`)

This script should be run by anybody that clones a repository to install and setup its tools. The script should be idempotent so that it can be run many times without causing harm to the development environment.

## MkDocs (`docs/` and `mkdocs.yaml`)

The `docs/` tree is where the detailed documentation for your repository and component should reside.

This template comes pre-populated with the structure agreed in Skyral's [documentation strategy](https://docs.google.com/document/d/12h0vvEBrjFJAZOHaQaIM8dK5ti3Q4sojbU_OPTySefY/edit).

This repository uses `mkdocs` to create a static docs site based on the contents of the `docs/` tree. We use this tool because it is compatible with both Backstage's TechDocs, Github Pages, and simple to run locally. `mkdocs.yaml` is the configuration file for the docs site.

Run `uv run --group docs mkdocs serve` to test and view the docs site locally.

Note, if your docs will end up in Backstage, you could also test with [techdocs](https://backstage.skyral.dev/docs/default/component/backstage-service/view-test-docs-locally/).

MkDocs is shipped as Python Packages, so we require a Python Dependency Manager. For this we use `uv`.

## Python Management with uv (`.python-version`, `pyproject.toml` and `uv.lock`)

We use `uv` as it offers good dependency isolation between different projects. It also manages your Python version and Python virtual environment in `.venv/`.

The `pyproject.toml` file defines the dependencies that we require, and the `setup.sh` script installs them with `uv sync --group docs`.

The `uv.lock` file specifies the concrete versions of each dependency, to ensure that the same version is used by all machines that clone this repository.

If you have not setup `uv` before then you may need to follow our [Google Artifact Registry installation guides](https://backstage.skyral.dev/docs/default/system/sdlc/build-artefact-storage/python-package-hosting/#uv) so that you can authenticate with GAR.

## Tool Version Management with asdf (`.tool-versions`)

`asdf` is our preferred tool version manager. All tool version definitions are contained within one file (`.tool-versions`) which you can check in to your project's Git repository to share with your team, ensuring everyone is using the exact same versions of tools.

See Skyral's [documentation](https://backstage.skyral.dev/docs/default/system/sdlc/asdf/) on how to use asdf. The `setup.sh` script should do all of this for you, however.

## Environment Variable Management with direnv (`.envrc`)

When your terminal (or IDE) is within this directory, and you have [direnv](https://direnv.net/) installed, `direnv` will automatically set the environment variables that are specified in the `.envrc` file. This is helpful to ensure all colloborators of this repository have the same environment variables set.

You will be prompted to run `direnv allow` in your terminal for this to function, which is safe for repositories that you trust.

## Git Hooks with `pre-commit` (`.pre-commit-config.yaml`)

`pre-commit` is a framework for managing git hooks that are run against your locally staged changes to identify simple issues before submissions for code review. The official documentation can be found in the [pre-commit documentation](https://pre-commit.com/).

`pre-commit` is a misleading name for this tool, as it supports all types of git hooks including 'pre-push', 'commit-msg', and of course 'pre-commit'.

The `pre-commit` CLI tool is managed and installed by `asdf` in this repository. This tool is installed and setup as part of the `setup.sh` script.

Prior to committing you will find it useful to either:

- run `pre-commit` in your terminal
- use the `pre-commit` VSCode extension

Don't worry if you forget, as the checks will run anyway when you attempt to commit.

`pre-commit-config.yaml` configuration file contains all of Skyral's default hooks for a repository. We go through these hooks in the following sections.

### Conventional Commits and Commitizen

This hook ensures that all commit messages are following the `conventional commits` pattern. To learn more about this paradigm and the format, see their [documentation](https://www.conventionalcommits.org/en/v1.0.0/#summary). This check is performed via the `commitizen` tool, however it is not necessary to have `commitizen` installed for this hook to work.

If you wish to use the `commitizen` CLI to help you [format your commit messages](https://commitizen-tools.github.io/commitizen/commands/commit/), you can do so by installing `cz` with `brew install commitizen` on MacOS, and running `cz commit`.

### Markdown Linting and Link Checking (`.markdownlint.yaml`, `markdownlintignore`, and `.markdown-link-check.json`)

The markdown pre-commit hooks uses these files to configure linting and link checking rules.

The linting has some auto-fix capabilities as part of linting, but won't automatically stage its changes.

The link checking capabilities are rather limited, but still sometimes useful. It checks that links return a 200 status code. Often this will just be a sign-in page for Skyral internal links (e.g. with Backstage), so can give you a false sense of security.

## Pull Request Approvers (`CODEOWNERS`)

This file is understood by Github to help automatically determine who is required for pull request reviews. See the comments in `CODEOWNERS` for more details.

## Pull Request Descriptions (`.github/pull_request_template.md`)

A file at the root of this repository that is understood by Github to automatically populate each new Pull Request description with the contents of the file.

## Github Actions (`.github/workflows/`)

The files in `.github/workflows` define the Github Actions workflows. Two bare-bones workflows are specified, `premerge` and `postmerge`.

- `premerge` is configured to run each time that a pull request is raised or modified. It is the best place to test the contents of a pull request meet the definition of done for your team.
- `postmerge` is configured to run each time that a pull request is merged. It is the best place to ensure that the merge didn't cause any unforeseen issues and to perform Continuous Delivery activities, where relevant.
