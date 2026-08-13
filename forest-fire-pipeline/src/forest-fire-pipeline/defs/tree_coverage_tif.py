import dagster as dg
from pathlib import Path
from upath import UPath

class TreeCoverageConfig(dg.Config):
    src_url: str = (Path(__file__).resolve().parent.parent / "treecover2010_60N_010W.tif").as_uri()
    destination_url: str = (Path(__file__).resolve().parent.parent / "treecover2010_60N_010W_new.tif").as_uri()

@dg.asset
def tree_coverage_loader(
    config: TreeCoverageConfig,
) -> str:
    
    tif_upath = UPath(config.src_url)

    if not tif_upath.exists():
        raise FileNotFoundError(f"Tree coverage TIFF not found: {tif_upath}")

    src = UPath(config.src_url)
    dst = UPath(config.destination_url)

    dst.parent.mkdir(parents=True, exist_ok=True)
    with src.open("rb") as fsrc, dst.open("wb") as fdst:
        fdst.write(fsrc.read())

    return config.destination_url
