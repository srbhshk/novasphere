// SPDX-License-Identifier: MIT
// apps/demo — GET /api/metrics. Returns mock or live metrics by data source.

import { NextResponse } from "next/server";
import { MOCK_METRICS } from "@/mocks/metrics.mock";
import type { DashboardMetric } from "@/mocks/metrics.mock";

export type MetricsResponse = {
  data: DashboardMetric[] | null;
  error: { code: string; message: string } | null;
};

/**
 * GET /api/metrics
 * Returns metrics list. When NEXT_PUBLIC_DATA_SOURCE=mock, returns MOCK_METRICS.
 */
export async function GET(): Promise<NextResponse<MetricsResponse>> {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";
  if (dataSource === "mock") {
    return NextResponse.json({ data: MOCK_METRICS, error: null });
  }
  return NextResponse.json({
    data: null,
    error: { code: "NOT_IMPLEMENTED", message: "api data source not implemented" },
  });
}
