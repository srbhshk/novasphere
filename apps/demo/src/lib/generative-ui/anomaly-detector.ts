// SPDX-License-Identifier: MIT
// apps/demo — Simulated anomaly detector for Generative UI (demo + production modes).

"use client";

import * as React from "react";
import { INTENT, type Intent } from "./intents";

export type AnomalyScenario = {
  id: string;
  type: "revenue" | "infra" | "users";
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  intent: Intent;
  triggerAfterMs: number;
};

export const ANOMALY_SCENARIOS: AnomalyScenario[] = [
  {
    id: "apac-spike",
    type: "revenue",
    severity: "high",
    title: "Revenue Spike Detected",
    description: "APAC revenue is 34% above baseline. Unusual for this time window.",
    intent: INTENT.ANOMALY_REVENUE,
    triggerAfterMs: 45_000,
  },
  {
    id: "latency-spike",
    type: "infra",
    severity: "medium",
    title: "Inference Latency Elevated",
    description: "eu-west-2 endpoint latency is 3.2× above p99 baseline.",
    intent: INTENT.ANOMALY_INFRA,
    triggerAfterMs: 90_000,
  },
  {
    id: "churn-uptick",
    type: "users",
    severity: "low",
    title: "Churn Rate Uptick",
    description: "SMB segment churn increased 0.8% in the last 24 hours.",
    intent: INTENT.FOCUS_USERS,
    triggerAfterMs: 135_000,
  },
];

type UseAnomalyDetectorOptions = {
  /** When true, uses scripted demo timers instead of metrics polling. */
  isDemoMode?: boolean;
};

type MetricSample = {
  id: string;
  value: number;
};

function extractMetrics(json: unknown): MetricSample[] {
  if (
    typeof json !== "object" ||
    json === null ||
    !("data" in json) ||
    !Array.isArray((json as { data: unknown }).data)
  ) {
    return [];
  }

  const raw = (json as { data: unknown[] }).data;
  const metrics: MetricSample[] = [];

  for (const item of raw) {
    if (
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      "value" in item &&
      typeof (item as { id: unknown }).id === "string"
    ) {
      const id = (item as { id: string }).id;
      const valueRaw = (item as { value: unknown }).value;
      const numeric =
        typeof valueRaw === "number"
          ? valueRaw
          : typeof valueRaw === "string"
            ? Number.parseFloat(valueRaw.replace(/[^0-9.-]+/g, ""))
            : Number.NaN;
      if (!Number.isNaN(numeric)) {
        metrics.push({ id, value: numeric });
      }
    }
  }

  return metrics;
}

function pickScenarioForMetric(metricId: string): AnomalyScenario {
  if (metricId.toLowerCase().includes("revenue")) {
    return ANOMALY_SCENARIOS[0];
  }
  if (
    metricId.toLowerCase().includes("latency") ||
    metricId.toLowerCase().includes("infra")
  ) {
    return ANOMALY_SCENARIOS[1];
  }
  return ANOMALY_SCENARIOS[2];
}

/**
 * Proactive anomaly detector. In demo mode, triggers scripted scenarios based on timers.
 * In production mode, polls /api/metrics and fires when a metric changes >20% from baseline.
 */
export function useAnomalyDetector(
  onAnomaly: (scenario: AnomalyScenario) => void,
  options?: UseAnomalyDetectorOptions
): void {
  const isDemoMode = options?.isDemoMode ?? false;

  // Demo mode: scripted timers.
  React.useEffect(() => {
    if (!isDemoMode) return;
    if (typeof window === "undefined") return;

    const timeouts = ANOMALY_SCENARIOS.map((scenario) =>
      window.setTimeout(() => {
        onAnomaly(scenario);
      }, scenario.triggerAfterMs)
    );

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [isDemoMode, onAnomaly]);

  // Production mode: poll /api/metrics and compare to baseline.
  const baselineRef = React.useRef<MetricSample[] | null>(null);

  React.useEffect(() => {
    if (isDemoMode) return;
    if (typeof window === "undefined") return;

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch("/api/metrics", { method: "GET" });
        if (!res.ok) return;
        const json: unknown = await res.json();
        const metrics = extractMetrics(json);
        if (metrics.length === 0) return;

        if (baselineRef.current === null) {
          baselineRef.current = metrics;
          return;
        }

        const baseline = baselineRef.current;
        for (const metric of metrics) {
          const base = baseline.find((b) => b.id === metric.id);
          if (!base || base.value === 0) continue;
          const delta = Math.abs(metric.value - base.value) / base.value;
          if (delta > 0.2) {
            const scenario = pickScenarioForMetric(metric.id);
            onAnomaly(scenario);
            baselineRef.current = metrics;
            break;
          }
        }
      } catch {
        // Swallow errors — detector should never break the UI.
      }
    };

    const intervalId = window.setInterval(() => {
      if (!cancelled) void poll();
    }, 30_000);

    // Initial poll.
    void poll();

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isDemoMode, onAnomaly]);
}

