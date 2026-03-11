// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — mock data for stories and tests

import type {
  SparklineDataPoint,
  DonutSegment,
  AreaDataPoint,
  HeatmapCell,
} from "../chart.types";

export const sparklineData: SparklineDataPoint[] = [
  { value: 12 },
  { value: 19 },
  { value: 8 },
  { value: 24 },
  { value: 16 },
  { value: 22 },
  { value: 14 },
  { value: 30 },
  { value: 18 },
];

export const donutSegments: DonutSegment[] = [
  { label: "A", value: 40 },
  { label: "B", value: 30 },
  { label: "C", value: 20 },
  { label: "D", value: 10 },
];

export const areaData: AreaDataPoint[] = [
  { label: "Mon", value: 4000 },
  { label: "Tue", value: 3000 },
  { label: "Wed", value: 5000 },
  { label: "Thu", value: 2780 },
  { label: "Fri", value: 6890 },
  { label: "Sat", value: 4390 },
  { label: "Sun", value: 3490 },
];

export const heatmapData: HeatmapCell[] = (() => {
  const cells: HeatmapCell[] = [];
  for (let week = 0; week < 12; week++) {
    for (let day = 0; day < 7; day++) {
      cells.push({
        week,
        day,
        value: Math.floor(Math.random() * 10),
      });
    }
  }
  return cells;
})();
