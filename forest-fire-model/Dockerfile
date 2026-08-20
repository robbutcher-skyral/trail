ARG BASE_IMAGE=europe-west2-docker.pkg.dev/skyr-artefacts/docker-io/python:3.12.5-slim-bookworm

FROM europe-west2-docker.pkg.dev/skyr-artefacts/skyral-images/skyral-core-model-orchestrator/skyral-core-model-orchestrator-agent:0.26.1 AS agent

# ==============================================================================
FROM ${BASE_IMAGE} AS builder

RUN apt-get update -y && \
    apt-get install -y g++ && \
    apt-get install -y gdal-bin && \
    apt-get install -y libgdal-dev

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

# Simulate virtualenv being activated
ENV VIRTUAL_ENV=/project/.venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copy the agent binary from the agent image layer
COPY --from=agent /app/main /agent/main

ENTRYPOINT ["/agent/main", "agent", "/bin/bash", "-c", "python src/model.py $(cat ${SKYRAL_PARAMETERS_FILE})"]
