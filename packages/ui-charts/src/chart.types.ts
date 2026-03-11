// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — chart.types
// Typed data shapes for chart components. Never use raw API shapes.

/** Single point for sparkline (value-only). */
export type SparklineDataPoint = {
  value: number;
};

/** Segment for donut chart. color is optional; falls back to token. */
export type DonutSegment = {
  label: string;
  value: number;
  color?: string;
};

/** Point for area chart (label + value). */
export type AreaDataPoint = {
  label: string;
  value: number;
};

/** Cell for heatmap: week index, day index (0–6), value for intensity. */
export type HeatmapCell = {
  week: number;
  day: number;
  value: number;
};
