// SPDX-License-Identifier: MIT
// apps/demo — metrics mock data for dashboard.

import type { SparklineDataPoint } from "@novasphere/ui-charts";

export type DeltaDirection = "up" | "down" | "neutral";

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaDirection: DeltaDirection;
  sparklineData: SparklineDataPoint[];
};

function sparklineUp(base: number, count: number): SparklineDataPoint[] {
  const points: SparklineDataPoint[] = [];
  for (let i = 0; i < count; i++) {
    points.push({ value: base + i * (base * 0.08) + Math.sin(i * 0.5) * (base * 0.03) });
  }
  return points;
}

function sparklineDown(base: number, count: number): SparklineDataPoint[] {
  const points: SparklineDataPoint[] = [];
  for (let i = 0; i < count; i++) {
    points.push({ value: base - i * (base * 0.02) + Math.sin(i * 0.4) * (base * 0.02) });
  }
  return points;
}

export const MOCK_METRICS: DashboardMetric[] = [
  {
    id: "revenue",
    label: "Monthly Revenue",
    value: "$284K",
    delta: "+18%",
    deltaDirection: "up",
    sparklineData: sparklineUp(220, 12),
  },
  {
    id: "users",
    label: "Active Users",
    value: "12,847",
    delta: "+6%",
    deltaDirection: "up",
    sparklineData: sparklineUp(11000, 12),
  },
  {
    id: "ai-calls",
    label: "AI Calls/Day",
    value: "847K",
    delta: "+34%",
    deltaDirection: "up",
    sparklineData: sparklineUp(600, 12),
  },
  {
    id: "churn",
    label: "Churn Rate",
    value: "2.1%",
    delta: "-0.4%",
    deltaDirection: "down",
    sparklineData: sparklineDown(2.8, 12),
  },
];
