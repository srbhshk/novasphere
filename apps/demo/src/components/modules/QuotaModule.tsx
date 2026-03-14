// SPDX-License-Identifier: MIT
// apps/demo — Bento module: resource quota (API, seats, storage, compute).

"use client";

import * as React from "react";
import { Gauge } from "lucide-react";
import type { BentoCardModuleProps } from "@novasphere/ui-bento";

type QuotaItem = {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
};

const MOCK_QUOTA: QuotaItem[] = [
  {
    id: "api-calls",
    label: "API Calls",
    used: 847000,
    limit: 1000000,
    unit: "/day",
    status: "healthy",
  },
  {
    id: "seats",
    label: "Active Seats",
    used: 47,
    limit: 50,
    unit: "users",
    status: "warning",
  },
  {
    id: "storage",
    label: "Storage",
    used: 2.3,
    limit: 10,
    unit: "GB",
    status: "healthy",
  },
  {
    id: "compute",
    label: "Compute",
    used: 91,
    limit: 100,
    unit: "units",
    status: "critical",
  },
];

function formatQuotaValue(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export default function QuotaModule({
  config,
}: BentoCardModuleProps): React.ReactElement {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const title = config.title ?? "Resource Quota";
  const items = MOCK_QUOTA;
  const empty = items.length === 0;

  if (loading) {
    return (
      <div className="flex h-full flex-col p-4">
        <div className="h-5 w-36 rounded bg-ns-muted/30 animate-pulse" />
        <div className="mt-1 h-3 w-24 rounded bg-ns-muted/20 animate-pulse" />
        <div className="mt-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-ns-muted/20 animate-pulse" />
              <div className="h-1.5 w-full rounded-full bg-ns-muted/20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
        <Gauge className="h-10 w-10 text-ns-muted" aria-hidden />
        <p className="text-sm text-ns-muted">No quota data</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4">
      <div>
        <h3 className="text-sm font-semibold text-ns-text">{title}</h3>
        <p className="text-xs text-ns-muted">Updated 2m ago</p>
      </div>
      <ul className="mt-4 flex-1 space-y-4" role="list">
        {items.map((item) => {
          const pct = Math.min(100, (item.used / item.limit) * 100);
          const isWarning = item.status === "warning";
          const isCritical = item.status === "critical";
          const barBg =
            item.status === "healthy"
              ? "var(--ns-color-accent-3)"
              : "var(--ns-color-danger)";
          const barOpacity = isWarning ? 0.7 : 1;
          return (
            <li
              key={item.id}
              className={`rounded-md p-2 ${
                isWarning || isCritical
                  ? "border-l-2 border-[var(--ns-color-danger)] pl-3"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-ns-text">
                  {item.label}
                </span>
                <span className="text-xs text-ns-muted">
                  {formatQuotaValue(item.used)} / {formatQuotaValue(item.limit)}{" "}
                  {item.unit}
                </span>
              </div>
              <div
                className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ns-muted/20"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.label}: ${formatQuotaValue(item.used)} of ${formatQuotaValue(item.limit)} ${item.unit}`}
              >
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: barBg,
                    opacity: barOpacity,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
