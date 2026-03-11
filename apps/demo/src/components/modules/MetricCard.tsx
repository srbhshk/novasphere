// SPDX-License-Identifier: MIT
// apps/demo — Bento module: metric card with label, value, delta, sparkline.

"use client";

import type { BentoCardModuleProps } from "@novasphere/ui-bento";
import { SparklineChart } from "@novasphere/ui-charts";
import { useMetricsList } from "@/hooks/useMetricsList";
import type { DashboardMetric } from "@/mocks/metrics.mock";

/** Map layout card id (e.g. revenue-metric) to metric id (e.g. revenue). */
function cardIdToMetricId(cardId: string): string {
  return cardId.replace(/-metric$/, "") || cardId;
}

export default function MetricCard({ config }: BentoCardModuleProps): JSX.Element {
  const { data, isPending, isError } = useMetricsList();
  const metricId = cardIdToMetricId(config.id);
  const metric: DashboardMetric | undefined =
    data?.data?.find((m) => m.id === metricId);

  if (isPending || isError || !metric) {
    return (
      <div className="flex h-full flex-col p-4">
        <div className="h-4 w-24 rounded bg-ns-muted/30 animate-pulse" />
        <div className="mt-2 h-8 w-20 rounded bg-ns-muted/30 animate-pulse" />
        <div className="mt-2 h-12 flex-1 min-h-[48px] rounded bg-ns-muted/20 animate-pulse" />
      </div>
    );
  }

  const deltaColor =
    metric.deltaDirection === "up"
      ? "text-emerald-400"
      : metric.deltaDirection === "down"
        ? "text-rose-400"
        : "text-ns-muted";

  return (
    <div className="flex h-full flex-col p-4">
      <div className="text-sm font-medium text-ns-muted">{metric.label}</div>
      <div className="mt-1 text-2xl font-semibold text-ns-text">{metric.value}</div>
      <span className={`mt-0.5 text-sm font-medium ${deltaColor}`}>
        {metric.delta}
      </span>
      <div className="mt-3 flex-1 min-h-[48px] [&_.recharts-responsive-container]:!h-full">
        <SparklineChart
          data={metric.sparklineData}
          height={48}
          color="var(--ns-color-accent)"
        />
      </div>
    </div>
  );
}
