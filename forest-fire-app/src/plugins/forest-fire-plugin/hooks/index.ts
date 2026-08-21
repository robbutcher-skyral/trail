import { mapContext$ } from "@adk/lens-react";
import { useEffect, useState } from "react";
import {
  useMapContext,
  useDeckGridCellLayer,
  type DeckLayerProps,
} from "@adk/amphi-maps";
import type { GridCellLayerProps } from "@deck.gl/layers";
import type { FireData, SimulationMetadata } from "../types";

export function useSimulationMetadata(dataUrl: string) {
  const [metadata, setMetadata] = useState<SimulationMetadata | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      const response = await fetch(`${dataUrl}/model-output/metadata.json`);
      const data = await response.json();
      setMetadata(data);
    };
    fetchMetadata();
  }, [dataUrl]);

  return metadata;
}

export function useFireData(dataUrl: string, iteration: number) {
  const [fireData, setFireData] = useState<FireData[]>([]);
  const { mapInstance } = useMapContext(mapContext$);

  useEffect(() => {
    const fetchFireData = async () => {
      const response = await fetch(`${dataUrl}/model-output/${iteration}.json`);
      const data = await response.json();
      setFireData(data);
    };
    fetchFireData();
  }, [dataUrl, iteration, mapInstance]);

  return fireData;
}

export function useFireLayer(fireData: FireData[]) {
  const props: DeckLayerProps<GridCellLayerProps<FireData>> = {
    data: fireData,
    extruded: false,
    getPosition: (d) => [Number(d.longitude), Number(d.latitude)],
    cellSize: 30,
    getFillColor: (d) => (d.value === 1 ? [245, 144, 66] : [0, 0, 0, 0]),
  };

  useDeckGridCellLayer(mapContext$, props);
}