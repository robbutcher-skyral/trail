/**
 * Example hooks for your plugin. Replace with your own logic:
 * - useXxxData: fetch from API/Redux instead of mock data
 * - useXxxLayer: keep or adapt for your layers
 * - useMapFocus: reuse as-is or adjust
 * - useXxxHover: keep or replace with your hover/highlight logic
 */
import { useMemo, useCallback, useSyncExternalStore } from "react";
import { BehaviorSubject } from "rxjs";
import { layerManager, mapContext$ } from "@adk/lens-react";
import { useMapContext } from "@adk/amphi-maps";
import { LAYER_IDS } from "../constants";
import { MOCK_TREECOVERS } from "../data";
import type { TreeCoverItem, TreeCoverLayerMetadata } from "../types";

/** Example: returns mock data. Replace with real data source (API, Redux, etc.). */
export function useTreeCoverData() {
  return useMemo(() => ({ items: MOCK_TREECOVERS }), []);
}

/** Example: layer visibility and metadata. Adapt if you have multiple layers. */
export function useTreeCoverLayer() {
  const { getLayer, toggleLayer, setLayerVisibility } = layerManager.useLayerManager();
  const mainLayer = getLayer(LAYER_IDS.MAIN);
  return useMemo(
    () => ({
      isVisible: mainLayer?.visible ?? false,
      toggle: () => toggleLayer(LAYER_IDS.MAIN),
      setVisible: (visible: boolean) => setLayerVisibility(LAYER_IDS.MAIN, visible),
      color: (mainLayer?.metadata as TreeCoverLayerMetadata | undefined)?.color,
    }),
    [mainLayer, toggleLayer, setLayerVisibility]
  );
}

let previousViewState: { center: [number, number]; zoom: number; pitch: number; bearing: number } | null = null;

/** Example: fly map to position and restore view. Reuse as-is or customise. */
export function useMapFocus() {
  const { mapInstance } = useMapContext(mapContext$);
  const flyTo = useCallback(
    (position: [number, number], zoom = 14) => {
      if (!mapInstance) return;
      const center = mapInstance.getCenter();
      previousViewState = {
        center: [center.lng, center.lat],
        zoom: mapInstance.getZoom(),
        pitch: mapInstance.getPitch(),
        bearing: mapInstance.getBearing(),
      };
      mapInstance.flyTo({ center: position, zoom, duration: 1000, essential: true });
    },
    [mapInstance]
  );
  const restorePreviousView = useCallback(() => {
    if (!mapInstance || !previousViewState) return;
    mapInstance.flyTo({
      center: previousViewState.center,
      zoom: previousViewState.zoom,
      pitch: previousViewState.pitch,
      bearing: previousViewState.bearing,
      duration: 800,
      essential: true,
    });
    previousViewState = null;
  }, [mapInstance]);
  return { flyTo, restorePreviousView, hasPreviousView: previousViewState !== null };
}

const hoveredId$ = new BehaviorSubject<string | null>(null);

/** Example: shared hover state for list/map sync. Replace if you need different behaviour. */
export function useTreeCoverHover() {
  const hoveredId = useSyncExternalStore(
    (cb) => {
      const sub = hoveredId$.subscribe(cb);
      return () => sub.unsubscribe();
    },
    () => hoveredId$.getValue(),
    () => hoveredId$.getValue()
  );
  const setHoveredId = useCallback((id: string | null) => hoveredId$.next(id), []);
  const isHovered = useCallback((id: string) => hoveredId === id, [hoveredId]);
  return { hoveredId, setHoveredId, isHovered };
}
