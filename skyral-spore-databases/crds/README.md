# CRD Organization

This directory contains CustomResourceDefinitions (CRDs) for the SPORE Databases chart, organized by source and purpose.

## File Structure

### CloudNativePG Core CRDs (`cnpg-*.yaml`)

CRDs from the upstream CloudNativePG operator:

- **`cnpg-backup.yaml`** (18KB) - Backup resource for PostgreSQL backups
- **`cnpg-pooler.yaml`** (629KB) - Pooler resource for connection pooling
- **`cnpg-imagecatalog.yaml`** (81KB) - ImageCatalog resource for managing container images
- **`cnpg-core.yaml`** (482KB) - Remaining core CRDs:
  - Cluster
  - ClusterImageCatalog
  - Database
  - DatabaseRole
  - FailoverQuorum
  - Publication
  - ScheduledBackup
  - Subscription

**Source:** https://github.com/cloudnative-pg/charts/blob/main/charts/cloudnative-pg/templates/crds/crds.yaml

### Barman Cloud Plugin CRDs

- **`barman-objectstore.yaml`** (~700 lines) - ObjectStore resource for backup destinations

**Source:** https://github.com/cloudnative-pg/plugin-barman-cloud

**Why bundled:** The ObjectStore CRD must be installed before Helm validates chart resources. Installing it via pre-install hook creates a chicken-and-egg problem. By bundling the CRD here, it's available during Helm's validation phase.

## Why Split?

### Size Limit Issue

The Pooler CRD (629KB) exceeded Kubernetes' annotation size limit (256KB), causing installation failures:

```text
The CustomResourceDefinition "poolers.postgresql.cnpg.io" is invalid:
metadata.annotations: Too long: may not be more than 262144 bytes
```

### Solution

Splitting CRDs into separate files resolves the size limit while maintaining full functionality. Helm automatically installs all `.yaml` files in the `crds/` directory.

### Organization Benefits

- **Clear ownership** - Easy to identify which CRDs come from which source
- **Easier updates** - Update upstream CRDs without affecting custom ones
- **Future-proof** - Ready for Skyral-specific customizations
- **Maintainability** - Clear separation of concerns

## Updating CRDs

### CloudNativePG CRDs

1. Download latest from: <https://github.com/cloudnative-pg/charts/blob/main/charts/cloudnative-pg/templates/crds/crds.yaml>
2. Remove any Helm template syntax (e.g., `{{- if .Values.crds.create }}`)
3. Split into separate files: `cnpg-backup.yaml`, `cnpg-pooler.yaml`, `cnpg-imagecatalog.yaml`, and `cnpg-core.yaml`

### Barman Cloud Plugin

The `barman-objectstore.yaml` CRD is automatically updated by `scripts/update-cloudnative-dependencies.sh`. The script:

1. Downloads the plugin manifest from GitHub
2. Extracts the ObjectStore CRD
3. Saves it to `deploy/crds/barman-objectstore.yaml`
4. Saves the remaining plugin resources to `deploy/manifests/barman-cloud-plugin.yaml`

**Manual update:**

```bash
# Update to specific version
./scripts/update-cloudnative-dependencies.sh --plugin-version v0.11.0

# Or update to latest from main
./scripts/update-cloudnative-dependencies.sh
```

## Pre-commit Configuration

CRD files are excluded from large file checks in `.pre-commit-config.yaml`:

```yaml
- id: check-added-large-files
  exclude: '^deploy/crds/.*\.yaml$'
```

This is necessary because CRDs can legitimately be large due to OpenAPI schemas.

## Barman Plugin Backups

### Backup

```bash
kubectl cnpg backup -n <namespace> <cluster-name> \
  --method=plugin \
  --plugin-name=barman-cloud.cloudnative-pg.io
```

```yaml
apiVersion: postgresql.cnpg.io/v1
kind: Backup
metadata:
  name: backup-example
spec:
  cluster:
    name: cluster-example
  method: plugin
  pluginConfiguration:
    name: barman-cloud.cloudnative-pg.io
```

### Restore

In CloudNativePG, recovery is not performed in-place on an existing cluster. Instead, it is used to bootstrap a new cluster from a physical backup.

Configure the Cluster resource to use the ObjectStore you defined. In the bootstrap section, specify the recovery source, and define an externalCluster entry that references the plugin:

```yaml
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: cluster-restore
spec:
  [...]

  superuserSecret:
    name: superuser-secret

  bootstrap:
    recovery:
      source: origin

  externalClusters:
    - name: origin
      plugin:
        name: barman-cloud.cloudnative-pg.io
        parameters:
          barmanObjectName: cluster-example-backup
          serverName: cluster-example
```
