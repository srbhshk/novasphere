// SPDX-License-Identifier: MIT
// apps/demo — Bento module: area chart with 7D / 30D / 90D tab switcher.

"use client";

import type React from "react";
import { useState } from "react";
import type { BentoCardModuleProps } from "@novasphere/ui-bento";
import { AreaChart } from "@novasphere/ui-charts";
import { AREA_CHART_DATA } from "@/mocks/areaChart.mock";
import type { AreaChartRange } from "@/mocks/areaChart.mock";

const TABS: Array<{ id: AreaChartRange; label: string }> = [
  { id: "7D", label: "7D" },
  { id: "30D", label: "30D" },
  { id: "90D", label: "90D" },
];

export default function AreaChartModule({
  config,
}: BentoCardModuleProps): React.ReactElement {
  const [range, setRange] = useState<AreaChartRange>("7D");
  const title = config.title ?? "Traffic";
  const data = AREA_CHART_DATA[range];

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-ns-border/50 px-4 py-2">
        <h3 className="text-sm font-semibold text-ns-text">{title}</h3>
        <div className="flex rounded-lg border border-ns-border bg-ns-surface/50 p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRange(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                range === tab.id
                  ? "bg-ns-accent text-white"
                  : "text-ns-muted hover:text-ns-text hover:bg-ns-muted/20"
              }`}
              aria-pressed={range === tab.id}
              aria-label={`Show ${tab.label} data`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 p-2">
        <AreaChart
          data={data}
          color="var(--ns-color-accent)"
        />
      </div>
    </div>
  );
}
