import { definePlugin, mapContext$ } from "@adk/lens-react";
import { firstValueFrom } from "rxjs";
import { filter } from "rxjs/operators";
import type { BasePluginConfig } from "@adk/lens-react";

const LAYER_ID = "tree-cover";

interface TreeCoverPluginConfig extends BasePluginConfig {
  tilesUrl: string;
}

const treeCoverPlugin = (config: TreeCoverPluginConfig) => {
  const addLayer = async () => {
    const ctx = await firstValueFrom(
      mapContext$.pipe(filter((c) => c.mapInstance !== null))
    );
    const map = ctx.mapInstance!;

    map.addSource("tree-cover", {
      type: "raster",
      tiles: [`${config.tilesUrl}/{z}/{x}/{y}.png`],
      scheme: "tms",
      tileSize: 256,
      maxzoom: 12,
    });

    map.addLayer({
      id: LAYER_ID,
      type: "raster",
      source: "tree-cover",
      paint: {
        "raster-opacity": 0.75,
      },
      minzoom: 0,
      maxzoom: 22,
    });
  };

  addLayer();

  return {
    id: "tree-cover-plugin",
    layers: [],
    routes: [],
    destroy() {
      // cleanup if needed
    },
  };
};

export default definePlugin(treeCoverPlugin);