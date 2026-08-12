/**
 * Example components for your plugin. Replace with your own UI:
 * - XxxCard: item row/card (e.g. list row, map popup content)
 * - SummaryCard: map overlay summary (e.g. counts, filters)
 * - XxxAboveMapBanner: optional banner above/below map
 */
import type { FC } from "react";
import { Card, CardContent, Paper, Box, Typography } from "@mui/material";
import type { ForestFireItem } from "../types";
import { MOCK_FORESTFIRES } from "../data";

export interface ForestFireCardProps {
  item: ForestFireItem;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/** Example: minimal item card. Replace with your item UI (fields, actions, styling). */
export const ForestFireCard: FC<ForestFireCardProps> = ({
  item,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => (
  <Card onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <CardContent>
      <Typography variant="subtitle2">{item.label}</Typography>
    </CardContent>
  </Card>
);

/** Example: map overlay summary. Replace with your plugin summary (counts, filters, etc.). */
export const SummaryCard: FC = () => (
  <Paper sx={{ p: 1 }}>
    <Typography variant="caption">{MOCK_FORESTFIRES.length} items</Typography>
  </Paper>
);

/** Example: banner above/below map. Replace content or remove from plugin if not needed. */
export const ForestFireAboveMapBanner: FC = () => (
  <Box sx={{ p: 0.5 }}>
    <Typography variant="caption">ForestFire · {MOCK_FORESTFIRES.length} items</Typography>
  </Box>
);
