# Stage 1: Download kubectl — runs on build platform to avoid QEMU emulation
# renovate: datasource=docker depName=registry.access.redhat.com/ubi9/ubi-minimal versioning=docker
FROM --platform=$BUILDPLATFORM europe-west2-docker.pkg.dev/skyr-artefacts/redhat-registry/ubi9-minimal:9.7 AS downloader

ARG TARGETOS
ARG TARGETARCH

# curl-minimal is pre-installed in ubi9-minimal — do NOT install full curl (conflicts)
RUN set -ex; \
    KUBECTL_VERSION=$(curl -L -s https://dl.k8s.io/release/stable.txt); \
    curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/${TARGETOS}/${TARGETARCH}/kubectl"; \
    curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/${TARGETOS}/${TARGETARCH}/kubectl.sha256"; \
    echo "$(cat kubectl.sha256)  kubectl" | sha256sum -c; \
    chmod +x kubectl

# Stage 2: Runtime — kubectl + script only, no curl or build tools (CM-7)
# renovate: datasource=docker depName=registry.access.redhat.com/ubi9/ubi-minimal versioning=docker
FROM europe-west2-docker.pkg.dev/skyr-artefacts/redhat-registry/ubi9-minimal:9.7

# bash: required for postgres-scaler.sh (pipefail)
# shadow-utils: required for useradd/groupadd
RUN microdnf install -y bash shadow-utils && \
    groupadd -g 1001 appgroup && \
    useradd -u 1001 -g appgroup -s /sbin/nologin appuser && \
    microdnf clean all

COPY --from=downloader /kubectl /bin/kubectl
ADD postgres-scaler.sh /bin/

USER 1001
ENTRYPOINT ["postgres-scaler.sh"]
