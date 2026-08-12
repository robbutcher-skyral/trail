import {
  createRouteRef,
  definePlugin,
  routeManager,
  type BasePluginInstance,
  type StaticRouteRef,
} from "@adk/lens-react";

import { ForestFireOverview } from "./routes";

const PLUGIN_ID = "forest-fire-plugin";

const overview = createRouteRef<StaticRouteRef>("ForestFirePlugin", "overview");

export function forestFirePlugin(): BasePluginInstance {
  routeManager.registerRoute(overview, {
    path: "/overview",
    component: () => <ForestFireOverview />,
    navbar: { label: "Forest Fire" },
  });

  return {
    id: PLUGIN_ID,
    layers: [],
    routes: [overview.path],
    destroy() {
      routeManager.removeRoute(overview.path);
    },
  };
}

export default definePlugin(forestFirePlugin);
