import {
  FeaturesConfig,
  MapConfig,
  ReactConfig,
  getLensEnvVar,
} from "@adk/lens-react";

import forestFire from "./src/plugins/forest-fire-plugin";
import treeCover from "./src/plugins/tree-cover-plugin";

const REACT_CONFIG = {
  LOGO: getLensEnvVar("LOGO", ""),
  TITLE: getLensEnvVar("TITLE", "Forest Fire Digital Twin"),
  DEBUG: true,
} satisfies ReactConfig;

const MAP_CONFIG = {
  SERVER_URL: getLensEnvVar("MAP_SERVER_URL", "http://localhost:7890"),
  BASEMAP_NAME: getLensEnvVar("BASEMAP_NAME", ""),
  BUILDINGS_MAP_NAME: getLensEnvVar("BUILDINGS_MAP_NAME", ""),
  // Set the map bounds for your region
  MIN_LATITUDE: getLensEnvVar("MIN_LATITUDE", "-90"),
  MAX_LATITUDE: getLensEnvVar("MAX_LATITUDE", "90"),
  MIN_LONGITUDE: getLensEnvVar("MIN_LONGITUDE", "-180"),
  MAX_LONGITUDE: getLensEnvVar("MAX_LONGITUDE", "180"),
  TILE_SERVER_URL: getLensEnvVar("TILE_SERVER_URL", "http://localhost:3000"),
  TILE_SOURCE_NAME: getLensEnvVar("TILE_SOURCE_NAME", "merseyside"),
  BOUNDING_BOX: [
    getLensEnvVar("MIN_LONGITUDE", "-1.6"),
    getLensEnvVar("MIN_LATITUDE", "50.5"),
    getLensEnvVar("MAX_LONGITUDE", "-1.0"),
    getLensEnvVar("MAX_LATITUDE", "50.85"),
  ],
  // Set the zoom range for your map
  MIN_ZOOM: getLensEnvVar("MIN_ZOOM", "2"),
  MAX_ZOOM: getLensEnvVar("MAX_ZOOM", "20"),
  BASEMAPS: ["osm-positron"],
} satisfies MapConfig;

const FEATURES = [
  {
    id: "forest-fire",
    name: "Forest Fire",
    routePrefix: "/forest-fire",
    plugins: [
      forestFire({
        name: "Forest Fire",
        version: "1.0.0",
        dataUrl: "http://localhost:9000/skyral-foundations/forest-fire",
      }),
      treeCover({
        name: "Tree Cover",
        version: "1.0.0",
        tilesUrl: "http://localhost:9000/skyral-foundations/forest-fire/tiles",
      }),
    ],
  },
] satisfies FeaturesConfig;

export default {
  REACT_CONFIG,
  MAP_CONFIG,
  FEATURES,
};
