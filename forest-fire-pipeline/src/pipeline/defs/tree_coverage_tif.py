import dagster as dg
from pathlib import Path
from upath import UPath
from skyral.record_store_utils.dagster import RecordStoreResource, with_metadata_records

class TreeCoverageConfig(dg.Config):
    # src_url: str = (Path(__file__).resolve().parent.parent / "treecover2010_60N_010W.tif").as_uri()
    src_url: str = "https://glad.umd.edu/Potapov/TCC_2010/treecover2010_60N_010W.tif"
    # destination_url: str = (Path(__file__).resolve().parent.parent / "treecover2010_60N_010W_new.tif").as_uri()
    destination_url: str = "s3://skyral-foundations/forest-fire/tree-coverage.tif"

@dg.asset
@with_metadata_records(
    job_id="job-tree-coverage",
    job_metadata={
        "description": "Download tree coverage data and upload to SPORE Storage",
    }
)
def tree_coverage_loader(
    _: dg.AssetExecutionContext,
    config: TreeCoverageConfig,
    record_store: RecordStoreResource
) -> str:
    
    src = UPath(config.src_url)

    if not src.exists():
        raise FileNotFoundError(f"Tree coverage TIFF not found: {src}")

    dst = UPath(config.destination_url)
    dst.parent.mkdir(parents=True, exist_ok=True)

    with src.open("rb") as fsrc, dst.open("wb") as fdst:
        fdst.write(fsrc.read())

    record_store.add_run_metadata(
        {
            "src_url": config.src_url,
        }
    )
    record_store.add_dataset_metadata(
        {
            "totalCount": 1,
        },
    )
    
    return config.destination_url
