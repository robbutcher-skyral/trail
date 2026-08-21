import {
  createRouteRef,
  definePlugin,
  layerManager,
  routeManager,
  type BasePluginInstance,
  type StaticRouteRef,
} from "@adk/lens-react";

import type { ForestFirePluginConfig } from "./config";
import { PLUGIN_ID, LAYER_IDS } from "./constants";
import { FireSimulationOverview } from "./routes";

export { PLUGIN_ID, LAYER_IDS } from "./constants";

const overview = createRouteRef<StaticRouteRef>("ForestFirePlugin", "overview");

export const routes = { overview };

export function forestFirePlugin(config: ForestFirePluginConfig): BasePluginInstance {
  routeManager.registerRoute(overview, {
    path: "/fire-simulation",
    component: () => <FireSimulationOverview dataUrl={config.dataUrl} />,
    navbar: { label: config.name },
  });

  layerManager.addLayer(LAYER_IDS.MAIN, true, {
    title: config.name,
    group: "Fire Simulation",
    color: "#f59042",
    description: "Fire spread overlay",
  });

  return {
    id: PLUGIN_ID,
    layers: [],
    routes: [overview.path],
    destroy() {
      routeManager.removeRoute(overview.path);
      layerManager.removeLayer(LAYER_IDS.MAIN);
    },
  };
}

export default definePlugin(forestFirePlugin);