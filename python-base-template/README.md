# README

This git repository is a Github Template upon which other Github templates can be based, or repositories if there is no more suitable template. It contains a lot of generic base configuration, but makes no assumption about technology/language selection.

Take a look at the full list of [Skyral's Github Templates](https://github.com/orgs/skyral-group/repositories?q=template%3Atrue).

Github Templates have the following aims:

- make it easier to create new repos without a lot of boilerplate work
- improve consistency across new repos
- make it easier for new joiners to become familiar with our tools and get started working in a repo

## How to change this template

Contributions to this template repository are welcome via Pull Request.

## How to create a repository or template using this template

### Option A: If your repository or template does not yet exist in Github

Create your repository in [ee-repo-permissions](https://github.com/skyral-group/ee-repo-permissions) with this template referenced in its Terraform. You can use another repository as an example, or you can follow the documentation of the [repository terraform module](https://github.com/skyral-group/tf-github-repository-module).

Include this in your terraform:

```tf
template = {
    owner                = "skyral-group"
    repository           = "base-template"
}
```

If you are creating a template based on this one, also include this:

```tf
is_template = true
```

### Option B: If your repository already exists in Github

Take a look at the files and tools in this repository, and consider copying across everything that is useful to your own repository to ensure consistency across the organisation. Hopefully you will find some useful configurations that will help you adopt these tools or upgrade. See the section below on how to use the template for further advice.

## How to get started with this repo

Instructions:

1. Read the [repository tools](docs/component-maintenance/repository-tools.md) docs to understand the files and tools in this repository.
1. Run the [AI bootstrap prompt](docs/ai/bootstrap-prompt.md) in your AI agent (Claude Code recommended) to populate `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` with content specific to this repository. Review the proposed Domain Knowledge section with a domain expert before merging.
1. Update `CODEOWNERS` with the relevant Github team(s).
1. Update `mkdocs.yaml` with a relevant site name for your repository.
1. If you authoring a Core component, add the relevant Backstage configuration. Details are in the [Backstage Capability Registry documentation](https://backstage.skyral.dev/docs/default/component/capability-registry/).
1. Update `.github/workflows`. The workflows are relatively empty right now and should be populated with the relevant build, test, release steps that are suitable for your context.
1. Update `docs/` as per the documentation strategy.
1. Finally update this README by deleting everything from this line updwards (except "# README") and then populate everything below this line as necessary.

Summary of what can be found in this repository.

The documentation for this repo can be found in the `docs/` tree.

## Key Documentation

- [Introduction](docs/overview/introduction.md)
- [Concepts](docs/technical-overview/concepts.md)
- [Architecture](docs/technical-overview/architecture.md)

Full documentation available at the docs [Index](docs/index.md).

## Setting Up your Dev Environment

Follow these instructions:

1. Ensure `asdf` is installed ([asdf installation guide](https://asdf-vm.com/guide/getting-started.html))
1. Ensure `uv` is installed ([uv installation guide](https://docs.astral.sh/uv/getting-started/installation/))
1. Ensure `direnv` is installed ([direnv installation guide](https://direnv.net/docs/installation.html)) (optional)
1. Run `setup.sh`. You can run this as many times as you want without harm.

Read these docs:

- [Repository Tooling](docs/component-maintenance/repository-tools.md)
- [How to Build and Test](docs/component-maintenance/how-to-build-and-test.md)
