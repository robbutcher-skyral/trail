import random
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from PIL import Image
from upath import UPath
import json
import sys
import rasterio

DEV_MODE = True  # Displays visualisation with matplotlib
Image.MAX_IMAGE_PIXELS = None  # Allows large images to be read

## Model parameters
# Probability of spread to adjacent cells in an iteration
SPREAD_PROBABILITY = 0.5
# Probability of any tree cell randomly catching fire in an iteration
RANDOM_IGNITION_PROBABILITY = 0.000001

# Simulation parameters
SIMULATION_ITERATIONS = 1000
STEP_BETWEEN_RESULTS = 50

# Pixel Coords of Isle of Wight
TOP = 37010
LEFT = 34261
GRID_WIDTH = 500
GRID_HEIGHT = 500

tif_transform = None


def pixel_coords_to_lon_lat(x, y, left, top):
    lon, lat = tif_transform * (left + x, top + y)
    return (lon, lat)


def read_grid_from_tif(file_path, crop_box):
    global tif_transform

    # Open the TIFF file
    path = UPath(file_path)
    with path.open("rb") as f:  # Open in binary mode
        with rasterio.open(f) as rasterio_img:
            tif_transform = rasterio_img.transform
        img = Image.open(f)

        width, height = img.size
        print(f"Image Width: {width}")
        print(f"Image Height: {height}")
        cropped_img = img.crop(crop_box)
        grid = np.array(cropped_img)
    return grid


# Simple fire spread model
def spread_fire(grid, tree_cover_grid):
    new_grid = grid.copy()
    #
    # TODO: Implement fire spread logic
    # Be sure to use SPREAD_PROBABILITY and RANDOM_IGNITION_PROBABILITY
    #
    print('spread logic exec')
    return new_grid


def main(tree_coverage_tif_url, model_output_dir_url):
    # Create a grid to represent the environment
    grid = np.zeros((GRID_HEIGHT, GRID_WIDTH))

    # Identify bounding box in image of Isle of Wight
    top = TOP
    left = LEFT
    right = left + GRID_WIDTH
    bottom = top + GRID_HEIGHT
    crop_box = (left, top, right, bottom)

    tree_cover_grid = read_grid_from_tif(tree_coverage_tif_url, crop_box)

    # Show Tree Coverage with matplotlib
    if DEV_MODE:
        cover_colors = [(0, "grey"), (1, "green")]
        cover_custom_cmap = LinearSegmentedColormap.from_list(
            "custom_cmap", cover_colors
        )
        plt.figure("Tree Coverage")
        plt.imshow(tree_cover_grid, cmap=cover_custom_cmap, interpolation="nearest")

        spread_colors = [(0, "grey"), (1, "orange")]
        spread_custom_cmap = LinearSegmentedColormap.from_list(
            "custom_cmap", spread_colors
        )
        plt.figure("Fire Spread")

    # Create output directory
    output_dir = UPath(model_output_dir_url)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Simulation loop
    for t in range(SIMULATION_ITERATIONS):
        print(f"Iteration:: {t}")
        grid = spread_fire(grid, tree_cover_grid)

        if t % STEP_BETWEEN_RESULTS == 0:
            write_iteration_output(model_output_dir_url, grid, t)

        # Show Forest Fires with matplotlib
        if DEV_MODE:
            print("Rendering grid")
            plt.imshow(grid, cmap=spread_custom_cmap, interpolation="nearest")
            plt.show(block=False)
            plt.pause(0.01)
            if t < SIMULATION_ITERATIONS - 1:
                plt.clf()

    metadata_path = UPath(model_output_dir_url) / "metadata.json"
    with metadata_path.open("w") as f:
        f.write(
            "{"
            f'    "number_of_iterations": {SIMULATION_ITERATIONS},'
            f'    "step_between_results": {STEP_BETWEEN_RESULTS}'
            "}"
        )
        f.close()


class GridCell:
    def __init__(self, latitude: str, longitude: str, value: float):
        self.latitude = latitude
        self.longitude = longitude
        self.value = value

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)


def write_iteration_output(model_output_dir_url, grid, iteration):
    iteration_output_file = UPath(model_output_dir_url) / (str(iteration) + ".json")
    with iteration_output_file.open("w") as f:
        cells = []
        for i in range(GRID_HEIGHT):
            for j in range(GRID_WIDTH):
                (lon, lat) = pixel_coords_to_lon_lat(j, i, LEFT, TOP)
                cell = GridCell(lat, lon, grid[i, j])
                cells.append(cell)
        json.dump([cell.__dict__ for cell in cells], f)
        f.close()


if __name__ == "__main__":
    # Read in JSON from first position arg, as required by Orchestrator
    if len(sys.argv) > 1:
        try:
            params = json.loads(sys.argv[1])  # TODO pydantic json load
            print(params)
            tree_coverage_tif_url = params.get("tree_coverage_tif_url")
            model_output_dir_url = params.get("model_output_dir_url")
            main(tree_coverage_tif_url, model_output_dir_url)
        except (json.JSONDecodeError, KeyError) as exc:
            raise RuntimeError("Invalid JSON input") from exc