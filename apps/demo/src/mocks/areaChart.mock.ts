// SPDX-License-Identifier: MIT
// apps/demo — mock area chart data for 7D / 30D / 90D.

import type { AreaDataPoint } from "@novasphere/ui-charts";

function generatePoints(days: number, baseValue: number): AreaDataPoint[] {
  const points: AreaDataPoint[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * dayMs);
    const label = d.getDate() + "/" + (d.getMonth() + 1);
    const variance = Math.sin(i * 0.3) * baseValue * 0.15 + (i / days) * baseValue * 0.1;
    points.push({ label, value: Math.round(baseValue + variance) });
  }
  return points;
}

export const AREA_CHART_7D = generatePoints(7, 420);
export const AREA_CHART_30D = generatePoints(30, 380);
export const AREA_CHART_90D = generatePoints(90, 350);

export type AreaChartRange = "7D" | "30D" | "90D";

export const AREA_CHART_DATA: Record<AreaChartRange, AreaDataPoint[]> = {
  "7D": AREA_CHART_7D,
  "30D": AREA_CHART_30D,
  "90D": AREA_CHART_90D,
};
