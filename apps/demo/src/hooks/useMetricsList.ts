// SPDX-License-Identifier: MIT
// apps/demo — TanStack Query hook for metrics list from /api/metrics.

import { useQuery } from "@tanstack/react-query";
import type { DashboardMetric } from "@/mocks/metrics.mock";

export type MetricsApiResponse = {
  data: DashboardMetric[] | null;
  error: { code: string; message: string } | null;
};

async function fetchMetrics(): Promise<MetricsApiResponse> {
  const res = await fetch("/api/metrics");
  if (!res.ok) {
    return {
      data: null,
      error: { code: "FETCH_ERROR", message: `HTTP ${res.status}` },
    };
  }
  const json = (await res.json()) as MetricsApiResponse;
  return json;
}

/**
 * Fetches metrics from GET /api/metrics. Handles loading, error, and empty states.
 */
export function useMetricsList(): ReturnType<typeof useQuery<MetricsApiResponse>> {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: fetchMetrics,
  });
}
