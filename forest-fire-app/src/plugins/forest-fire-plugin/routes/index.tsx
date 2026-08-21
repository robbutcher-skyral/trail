import type { FC } from "react";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { ApButton, ApSlider } from "@adk/amphi";
import { lensManager } from "@adk/lens-react";
import { useEffect } from "react";
import { useSimulationMetadata, useFireData, useFireLayer } from "../hooks";

const PlaybackControlsContainer = styled("div")`
  padding: 16px;
`;

interface FireSimulationOverviewProps {
  dataUrl: string;
}

const FireLayer: FC<{ fireData: { latitude: string; longitude: string; value: number }[] }> = ({
  fireData,
}) => {
  useFireLayer(fireData);
  return null;
};

export const FireSimulationOverview: FC<FireSimulationOverviewProps> = ({ dataUrl }) => {
  const [currentIteration, setCurrentIteration] = useState<number>(0);
  const [fireLayerEnabled, setFireLayerEnabled] = useState<boolean>(true);

  const metadata = useSimulationMetadata(dataUrl);
  const fireData = useFireData(dataUrl, currentIteration);

  useEffect(() => {
    lensManager.screen.splitView();
  }, []);

  if (!metadata) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading simulation metadata...</Typography>
      </Box>
    );
  }

  return (
    <PlaybackControlsContainer>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Fire Simulation Playback
      </Typography>
      <ApButton onClick={() => setFireLayerEnabled(!fireLayerEnabled)}>
        Toggle Fire Layer
      </ApButton>
      <ApSlider
        min={0}
        max={metadata.number_of_iterations - 1}
        defaultValue={currentIteration}
        step={metadata.step_between_results}
        onChange={(_e, d) => setCurrentIteration(d as number)}
      />
      <Typography variant="caption">
        Iteration: {currentIteration} / {metadata.number_of_iterations - 1}
      </Typography>
      {fireLayerEnabled && <FireLayer fireData={fireData} />}
    </PlaybackControlsContainer>
  );
};