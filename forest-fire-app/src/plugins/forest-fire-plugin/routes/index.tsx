import type { FC } from "react";
import { useEffect } from "react";
import { lensManager } from "@adk/lens-react";
import { Typography } from "@mui/material";

export const ForestFireOverview: FC = () => {
  useEffect(() => {
    lensManager.screen.splitView();
  }, []);

  return (
    <Typography variant="h6" sx={{ p: 2 }}>
      Forest Fire
    </Typography>
  );
};
