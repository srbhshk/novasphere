// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — AreaChart
// Area chart with gradient fill, XAxis and tooltip; smooth monotone curve.

"use client";

import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { GlassCard } from "@novasphere/ui-glass";
import { tokens } from "@novasphere/tokens";
import type { AreaDataPoint } from "../chart.types";
import { ChartSkeleton } from "../ChartSkeleton";
import { ChartEmpty } from "../ChartEmpty";

const AREA_HEIGHT_DEFAULT = 200;
const GRADIENT_ID = "areachart-gradient";

export type AreaChartProps = {
  /** Data points (label + value). */
  data: AreaDataPoint[];
  /** Optional chart title/label. */
  label?: string;
  /** Area/line color; defaults to token accent. */
  color?: string;
  /** When true, shows skeleton placeholder. */
  loading?: boolean;
  /** When true, shows "No data" state. */
  empty?: boolean;
};

export default function AreaChart({
  data,
  label,
  color = tokens.color.accent,
  loading = false,
  empty = false,
}: AreaChartProps): JSX.Element {
  if (loading) {
    return (
      <GlassCard variant="medium">
        <ChartSkeleton height={AREA_HEIGHT_DEFAULT} />
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
      {label != null && (
        <div className="px-3 pt-3 text-sm font-medium [color:var(--ns-color-text)]">
          {label}
        </div>
      )}
      <ResponsiveContainer width="100%" height={AREA_HEIGHT_DEFAULT}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
        >
          <defs>
            <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={colorForGradient}
                stopOpacity={0.5}
              />
              <stop
                offset="100%"
                stopColor={colorForGradient}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--ns-color-border)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--ns-color-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--ns-color-border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--ns-color-muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => String(v)}
          />
          <Tooltip
            contentStyle={{
              background: "var(--ns-color-surface)",
              border: "1px solid var(--ns-color-border)",
              borderRadius: "var(--ns-radius-sm)",
              color: "var(--ns-color-text)",
            }}
            labelStyle={{ color: "var(--ns-color-muted)" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${GRADIENT_ID})`}
            isAnimationActive
            animationDuration={400}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
