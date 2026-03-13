// SPDX-License-Identifier: MIT
// @novasphere/ui-charts — DonutChart
// Pie chart with inner radius; custom legend and hover scale.

"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  Tooltip,
} from "recharts";
import { GlassCard } from "@novasphere/ui-glass";
import { tokens } from "@novasphere/tokens";
import type { DonutSegment } from "../chart.types";
import { ChartSkeleton } from "../ChartSkeleton";
import { ChartEmpty } from "../ChartEmpty";
import { cn } from "../lib/utils";

const DONUT_SIZE_DEFAULT = 200;
const SEGMENT_COLORS = [
  tokens.color.accent,
  tokens.color.accent2,
  tokens.color.accent3,
  tokens.color.muted,
  tokens.color.danger,
] as const;

export type DonutChartProps = {
  /** Segments (label, value, optional color). */
  segments: DonutSegment[];
  /** Optional label in the center. */
  centerLabel?: string;
  /** Chart size (width/height) in px. */
  size?: number;
  /** When true, shows skeleton placeholder. */
  loading?: boolean;
  /** When true, shows "No data" state. */
  empty?: boolean;
};

function getSegmentColor(segment: DonutSegment, index: number): string {
  if (segment.color) return segment.color;
  return SEGMENT_COLORS[index % SEGMENT_COLORS.length] ?? tokens.color.accent;
}

const ACTIVE_SCALE = 1.05;

function renderActiveShape(props: unknown): JSX.Element {
  const p = props as {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill?: string;
  };
  const fill = p.fill ?? "var(--ns-color-accent)";
  return (
    <Sector
      cx={p.cx}
      cy={p.cy}
      innerRadius={p.innerRadius}
      outerRadius={p.outerRadius * ACTIVE_SCALE}
      startAngle={p.startAngle}
      endAngle={p.endAngle}
      fill={fill}
      style={{ transition: "all 0.2s var(--ns-ease-smooth)" }}
    />
  );
}

export default function DonutChart({
  segments,
  centerLabel,
  size = DONUT_SIZE_DEFAULT,
  loading = false,
  empty = false,
}: DonutChartProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <GlassCard variant="medium">
        <ChartSkeleton height={size} />
      </GlassCard>
    );
  }

  if (empty || !segments.length) {
    return (
      <GlassCard variant="medium">
        <ChartEmpty />
      </GlassCard>
    );
  }

  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const data = segments.map((seg, i) => ({
    name: seg.label,
    label: seg.label,
    value: seg.value,
    color: getSegmentColor(seg, i),
  }));

  return (
    <GlassCard variant="medium">
      <div className="flex flex-col items-center gap-3 p-2">
        <div className="relative w-full" style={{ height: size }}>
          <ResponsiveContainer width="100%" height={size}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={size * 0.35}
                outerRadius={size * 0.45}
                paddingAngle={1}
                {...(activeIndex !== null ? { activeIndex } : {})}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value} (${total ? Math.round((value / total) * 100) : 0}%)`,
                  "",
                ]}
                contentStyle={{
                  background: "var(--ns-color-surface)",
                  border: "1px solid var(--ns-color-border)",
                  borderRadius: "var(--ns-radius-sm)",
                  color: "var(--ns-color-text)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {centerLabel != null && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-center text-sm font-medium [color:var(--ns-color-text)]"
              aria-hidden
            >
              {centerLabel}
            </div>
          )}
        </div>
        <ul
          className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs [color:var(--ns-color-muted)] list-none"
          role="list"
        >
          {data.map((entry, i) => (
            <li
              key={entry.label}
              className={cn(
                "flex items-center gap-1.5",
                activeIndex === i && "font-medium [color:var(--ns-color-text)]"
              )}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
                aria-hidden
              />
              <span>{entry.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}
