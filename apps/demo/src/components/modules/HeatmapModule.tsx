// SPDX-License-Identifier: MIT
// apps/demo — Bento module: API call heatmap (16-week usage pattern).

"use client";

import * as React from "react";
import { LayoutGrid } from "lucide-react";
import type { BentoCardModuleProps } from "@novasphere/ui-bento";
import { HeatmapChart } from "@novasphere/ui-charts";
import type { HeatmapCell } from "@novasphere/ui-charts";

function generateHeatmapData(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  for (let week = 0; week < 16; week++) {
    for (let day = 0; day < 7; day++) {
      const isWeekend = day === 0 || day === 6;
      const recentBoost = week > 12 ? 1.4 : 1;
      const base = isWeekend ? 15 : 65;
      const variance = Math.sin(week * 0.8 + day * 1.2) * 20;
      cells.push({
        week,
        day,
        value: Math.max(0, Math.round((base + variance) * recentBoost)),
      });
    }
  }
  return cells;
}

const HEATMAP_DATA = generateHeatmapData();

export default function HeatmapModule({
  config,
}: BentoCardModuleProps): React.ReactElement {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const title = config.title ?? "API Call Heatmap";
  const empty = HEATMAP_DATA.length === 0;

  if (loading) {
    return (
      <div className="flex h-full flex-col p-4">
        <div className="h-5 w-32 rounded bg-ns-muted/30 animate-pulse" />
        <div className="mt-1 h-4 w-40 rounded bg-ns-muted/20 animate-pulse" />
        <div className="mt-3 flex flex-1 gap-1">
          {Array.from({ length: 7 }).map((_, row) => (
            <div key={row} className="flex flex-1 flex-col gap-1">
              {Array.from({ length: 16 }).map((_, col) => (
                <div
                  key={col}
                  className="min-h-[6px] flex-1 rounded bg-ns-muted/20 animate-pulse"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
        <LayoutGrid className="h-10 w-10 text-ns-muted" aria-hidden />
        <p className="text-sm text-ns-muted">No usage data available</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-ns-border/50 px-4 py-2">
        <div>
          <h3 className="text-sm font-semibold text-ns-text">{title}</h3>
          <p className="text-xs text-ns-muted">16-week usage pattern</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-md bg-[var(--ns-color-accent)]/10 px-2 py-1 text-xs font-medium text-[var(--ns-color-text)]">
            Peak: Tue–Thu
          </span>
          <span className="rounded-md bg-[var(--ns-color-accent)]/10 px-2 py-1 text-xs font-medium text-[var(--ns-color-text)]">
            ↑34% recent
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0 p-2">
        <HeatmapChart data={HEATMAP_DATA} weeks={16} />
      </div>
    </div>
  );
}
