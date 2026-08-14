# Confidential and only for the information of the intended recipient.
# Copyright 2024 Skyral Group Limited.

ARG BASE_IMAGE=europe-west2-docker.pkg.dev/skyr-artefacts/docker-io/python:3.12.5-slim-bookworm

# ==============================================================================
FROM ${BASE_IMAGE} AS builder

# Install uv
COPY --from=ghcr.io/astral-sh/uv:0.10.2 /uv /uvx /bin/

WORKDIR /project
COPY src ./src
COPY pyproject.toml .
COPY uv.lock .

ENV UV_INDEX_SKYRAL_PYTHON_USERNAME=oauth2accesstoken
RUN --mount=type=secret,id=gcp-token,env=UV_INDEX_SKYRAL_PYTHON_PASSWORD \
  uv sync --frozen --no-dev

# ==============================================================================
FROM ${BASE_IMAGE}

WORKDIR /project
COPY --from=builder /project/.venv ./.venv
COPY --from=builder /project/src ./src
# Leave this commented out for now
#COPY colors.txt .

# Simulate virtualenv being activated
ENV VIRTUAL_ENV=/project/.venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

EXPOSE 3030

# Leave this commented out for now
# Moving gdal2tiles on linux as gdal2tiles doesn't exist on PATH.
# It is instead called `gdal2tiles.py`, despite seemingly not being a Python file.
#RUN apt-get update -y && \
#    apt-get install -y gdal-bin && \
#    mv /usr/bin/gdal2tiles.py /usr/bin/gdal2tiles