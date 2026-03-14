// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — SparklineChart
// Minimal line chart with gradient area fill; no axes or tooltip. Animated line draw on mount.

"use client";

import type { ReactElement } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  YAxis,
} from "recharts";
import { GlassCard } from "@novasphere/ui-glass";
import { tokens } from "@novasphere/tokens";
import type { SparklineDataPoint } from "../chart.types";
import { ChartSkeleton } from "../ChartSkeleton";
import { ChartEmpty } from "../ChartEmpty";
import styles from "./SparklineChart.module.css";

const SPARKLINE_HEIGHT_DEFAULT = 64;
const GRADIENT_ID = "sparkline-gradient";

export type SparklineChartProps = {
  /** Data points (value only). */
  data: SparklineDataPoint[];
  /** Line and gradient color; defaults to token accent. */
  color?: string;
  /** Chart height in px. */
  height?: number;
  /** When true, shows skeleton placeholder. */
  loading?: boolean;
  /** When true, shows "No data" state. */
  empty?: boolean;
};

export default function SparklineChart({
  data,
  color = tokens.color.accent,
  height = SPARKLINE_HEIGHT_DEFAULT,
  loading = false,
  empty = false,
}: SparklineChartProps): ReactElement {
  if (loading) {
    return (
      <GlassCard variant="medium">
        <ChartSkeleton height={height} />
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

  const colorForGradient =
    color.startsWith("var(") ? tokens.color.accent : color;

  return (
    <GlassCard variant="medium">
      <div className={styles.sparklineWrapper}>
        <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        >
          <defs>
            <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={colorForGradient}
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor={colorForGradient}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
            <YAxis hide domain={["auto", "auto"]} />
            <Area
            type="monotone"
            dataKey="value"
            fill={`url(#${GRADIENT_ID})`}
            stroke="none"
            isAnimationActive={false}
          />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
