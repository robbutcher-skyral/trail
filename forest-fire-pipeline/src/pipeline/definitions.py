import os

from dagster import Definitions, load_assets_from_package_module

from skyral.record_store_utils.dagster import RecordStoreResource

from pipeline import defs as d


# record_store = RecordStoreResource(url=os.environ["RECORD_STORE_URL"]) //TODO: bug with // in url, outside of control
record_store = RecordStoreResource(url='internal')

defs = Definitions(
    assets=load_assets_from_package_module(d),
    jobs=[
        record_store.define_asset_job(
            name="tree_coverage",
            description="Download tree coverage data and upload to SPORE Storage",
            pipeline_id="job-tree-coverage",
            pipeline_metadata={
                "kind": "pipeline",
                "name": "tree_coverage",
                "description": "Download tree coverage data and upload to SPORE Storage",
                "repository": "https://github.com/robbutcher-skyral/trail.git",
            },
        ),
    ],
    resources={
        "record_store": record_store,
    },
)
