import type { BasePluginConfig } from "@adk/lens-react";

export interface ForestFirePluginConfig extends BasePluginConfig {
  /** Base URL for fetching simulation data from SPORE Storage. */
  dataUrl: string;
}