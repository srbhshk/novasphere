// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — HeatmapChart
// Pure CSS Grid heatmap (7 rows × N weeks). Cell intensity from token opacity; hover tooltip.

"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { GlassCard } from "@novasphere/ui-glass";
import type { HeatmapCell } from "../chart.types";
import { ChartSkeleton } from "../ChartSkeleton";
import { ChartEmpty } from "../ChartEmpty";
import styles from "./HeatmapChart.module.css";

/** Opacity levels for intensity (0 = none, 0.9 = max). */
const OPACITY_LEVELS: readonly number[] = [0, 0.2, 0.4, 0.65, 0.9];

const DAYS = 7;
const DEFAULT_WEEKS = 12;

export type HeatmapChartProps = {
  /** Cell data: week index, day index (0–6), value for intensity. */
  data: HeatmapCell[];
  /** Number of week columns (default 12). */
  weeks?: number;
  /** When true, shows skeleton placeholder. */
  loading?: boolean;
  /** When true, shows "No data" state. */
  empty?: boolean;
};

function getOpacityLevel(value: number, maxValue: number): number {
  if (maxValue <= 0) return 0;
  const ratio = value / maxValue;
  if (ratio <= 0) return OPACITY_LEVELS[0] ?? 0;
  if (ratio <= 0.25) return OPACITY_LEVELS[1] ?? 0.2;
  if (ratio <= 0.5) return OPACITY_LEVELS[2] ?? 0.4;
  if (ratio <= 0.75) return OPACITY_LEVELS[3] ?? 0.65;
  return OPACITY_LEVELS[4] ?? 0.9;
}

export default function HeatmapChart({
  data,
  weeks = DEFAULT_WEEKS,
  loading = false,
  empty = false,
}: HeatmapChartProps): ReactElement {
  const [tooltip, setTooltip] = useState<{
    value: number;
    week: number;
    day: number;
    x: number;
    y: number;
  } | null>(null);

  if (loading) {
    return (
      <GlassCard variant="medium">
        <ChartSkeleton height={120} />
      </GlassCard>
    );
  }

  if (empty || !data.length) {
    return (
      <GlassCard variant="medium">
        <ChartEmpty />
      </GlassCard>
    );
  }

  const maxValue = Math.max(1, ...data.map((c) => c.value));
  const grid = new Map<string, number>();
  for (const cell of data) {
    const key = `${cell.week}-${cell.day}`;
    grid.set(key, (grid.get(key) ?? 0) + cell.value);
  }

  const rows = DAYS;
  const cols = weeks;

  return (
    <GlassCard variant="medium">
      <div
        className={styles.heatmapGrid}
        style={
          {
            "--heatmap-rows": rows,
            "--heatmap-cols": cols,
          } as React.CSSProperties
        }
        role="img"
        aria-label="Heatmap grid"
      >
        {Array.from({ length: rows * cols }, (_, i) => {
          const week = i % cols;
          const day = Math.floor(i / cols);
          const key = `${week}-${day}`;
          const value = grid.get(key) ?? 0;
          const opacity = getOpacityLevel(value, maxValue);
          const levelIndex = OPACITY_LEVELS.indexOf(opacity);
          return (
            <button
              key={key}
              type="button"
              className={styles.cell}
              data-level={String(levelIndex)}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  value,
                  week,
                  day,
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              aria-label={`Week ${week + 1}, day ${day + 1}: ${value}`}
            />
          );
        })}
      </div>
      {tooltip != null && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x, top: tooltip.y }}
          role="tooltip"
        >
          {tooltip.value}
        </div>
      )}
    </GlassCard>
  );
}
