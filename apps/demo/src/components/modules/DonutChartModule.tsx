// SPDX-License-Identifier: MIT
// apps/demo — Bento module: Donut chart with Usage / Revenue / Users tabs.

"use client";

import type React from "react";
import { useState } from "react";
import type { BentoCardModuleProps } from "@novasphere/ui-bento";
import { DonutChart } from "@novasphere/ui-charts";
import type { DonutSegment } from "@novasphere/ui-charts";

type DonutTabId = "usage" | "revenue" | "users";

const TABS: Array<{ id: DonutTabId; label: string }> = [
  { id: "usage", label: "Usage" },
  { id: "revenue", label: "Revenue" },
  { id: "users", label: "Users" },
];

const SEGMENTS: Record<DonutTabId, DonutSegment[]> = {
  usage: [
    { label: "API Calls", value: 45, color: "var(--ns-color-accent)" },
    { label: "UI Events", value: 32, color: "var(--ns-color-accent2)" },
    { label: "Pipelines", value: 23, color: "var(--ns-color-accent3)" },
  ],
  revenue: [
    { label: "Subscriptions", value: 58, color: "var(--ns-color-accent)" },
    { label: "Usage-based", value: 27, color: "var(--ns-color-accent2)" },
    { label: "Add-ons", value: 15, color: "var(--ns-color-accent3)" },
  ],
  users: [
    { label: "Product", value: 40, color: "var(--ns-color-accent)" },
    { label: "Engineering", value: 35, color: "var(--ns-color-accent2)" },
    { label: "Ops", value: 25, color: "var(--ns-color-accent3)" },
  ],
};

export default function DonutChartModule({
  config,
}: BentoCardModuleProps): React.ReactElement {
  const [tab, setTab] = useState<DonutTabId>("usage");
  const title = config.title ?? "Donut breakdown";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-ns-border/50 px-4 py-2">
        <h3 className="text-sm font-semibold text-ns-text">{title}</h3>
        <div className="flex rounded-lg border border-ns-border bg-ns-surface/60 p-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t.id
                  ? "bg-ns-accent text-white"
                  : "text-ns-muted hover:text-ns-text hover:bg-ns-muted/20"
              }`}
              aria-pressed={tab === t.id}
              aria-label={`Show ${t.label} segments`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 p-3">
        <DonutChart
          segments={SEGMENTS[tab]}
          centerLabel={`${TABS.find((t) => t.id === tab)?.label ?? ""}`}
          size={180}
        />
      </div>
    </div>
  );
}

