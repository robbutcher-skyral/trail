import dagster as dg
import subprocess
from pathlib import Path
from upath import UPath
from skyral.record_store_utils.dagster import RecordStoreResource, with_metadata_records

class TreeCoverageTilesConfig(dg.Config):
    colors_file: str = str(Path(__file__).resolve().parents[3] / "colors.txt")
    colour_image: str = str(Path("color-relief.tif"))
    tiles_location: str = "tiles"
    min_zoom_level: str = "0"
    max_zoom_level: str = "12"
    tile_destination_url: str = "s3://skyral-foundations/forest-fire/tiles" 

@dg.asset
@with_metadata_records(
    job_id="job-tree-coverage-tiles",
    job_metadata={
        "description": "Generate raster tiles from GeoTIFF",
    }
)
def tree_coverage_tiles(
    _: dg.AssetExecutionContext,
    config: TreeCoverageTilesConfig,
    record_store: RecordStoreResource,
    tree_coverage_loader: str,
) -> None:

    src = UPath(tree_coverage_loader)

    if not src.exists():
            raise FileNotFoundError(f"Tree coverage TIFF not found: {src}")

    coverage_file = UPath('temp/coverage.tif')
    coverage_file.parent.mkdir(parents=True, exist_ok=True)

    # Copy from storage
    with src.open("rb") as fsrc, coverage_file.open("wb") as fdst:
        fdst.write(fsrc.read())

    # Convert to color-relief using the repo's color ramp file
    subprocess.run(
        [
            "gdaldem",
            "color-relief",
            str(coverage_file),
            config.colors_file,
            config.colour_image,
        ],
        check=True,
    )

    # Generate map tiles
    tiles = Path(config.tiles_location)
    tiles.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "gdal2tiles",
            "-z",
            f"{config.min_zoom_level}-{config.max_zoom_level}",
            config.colour_image,
            f"{config.tiles_location}/"
        ],
        check=True,
    )

    # Upload tiles dir persistent store
    dest = UPath(config.tile_destination_url)
    if dest.exists():
        dest.fs.delete(dest.path, recursive=True)
    dest.fs.mkdirs(dest.path)
    dest.fs.put(f"{tiles}/*", dest.path, recursive=True)
