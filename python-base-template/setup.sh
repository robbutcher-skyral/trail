#!/usr/bin/env bash

## This script will install all the necessary dependencies for this git repository and set them up for use.
## IT IS IMPORTANT THAT THIS SCRIPT IS IDEMPOTENT (i.e. can be run multiple times without causing harm).

# Will add relevant asdf plugins if they are missing and install
echo "Installing asdf plugins..."
command_to_check="asdf"
if ! command -v "$command_to_check" >/dev/null 2>&1; then
  echo "Error: '$command_to_check' command not found."
  echo "Please install '$command_to_check' and try again."
  exit 1
fi
plugins=$(cut -d' ' -f1 .tool-versions)
for plugin in $plugins; do
  echo "Adding asdf plugin: $plugin"
  asdf plugin add "$plugin"
  asdf install "$plugin"
done

# Install git hooks using pre-commit
echo "Installing git hooks..."
command_to_check="pre-commit"
if ! command -v "$command_to_check" >/dev/null 2>&1; then
  echo "Error: '$command_to_check' command not found."
  echo "This should have been installed via asdf. Check tool-versions and if necessary re-run 'asdf install' and 'asdf reshim'."
  exit 1
fi
# Idempotently replaces existing git hook scripts with pre-commit, and also installs hook environments.
pre-commit install # only installs git 'pre-commit' hooks by default
pre-commit install --hook-type commit-msg
pre-commit install --hook-type pre-push

# Install mkdocs and associated plugins
echo "Installing mkdocs and associated plugins..."
command_to_check="uv"
if ! command -v "$command_to_check" >/dev/null 2>&1; then
  echo "Error: '$command_to_check' command not found."
  echo "Installing uv is a pre-requisite."
  exit 1
fi
uv sync --group docs
if [ $? -ne 0 ]; then
    echo "If your error is related to fetching dependencies you may need to authenticate with Google Artifact Registry."
    echo "See the Backstage documentation: https://backstage.skyral.dev/docs/default/system/sdlc/build-artefact-storage/python-package-hosting/#uv"
fi

echo "Done"
