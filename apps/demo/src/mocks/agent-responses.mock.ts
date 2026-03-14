// SPDX-License-Identifier: MIT
// apps/demo — mock agent responses for testing and MockAdapter-style flows.

import type { AgentMessage } from "@novasphere/agent-core";

/** Valid BentoLayoutConfig[] JSON — 12-card scheme matching layouts.ts DEFAULT. */
const LAYOUT_JSON =
  '[{"id":"revenue","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":0,"title":"Revenue"},{"id":"users","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":1,"title":"Users"},{"id":"ai-calls","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":2,"title":"AI Calls"},{"id":"churn","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":3,"title":"Churn"},{"id":"activity","colSpan":4,"rowSpan":2,"moduleId":"ActivityFeed","visible":true,"order":4,"title":"Activity"},{"id":"area-chart","colSpan":8,"rowSpan":1,"moduleId":"AreaChartModule","visible":true,"order":5,"title":"Traffic & Revenue"},{"id":"donut","colSpan":4,"rowSpan":1,"moduleId":"DonutChartModule","visible":true,"order":6,"title":"Breakdown"},{"id":"heatmap","colSpan":4,"rowSpan":1,"moduleId":"HeatmapModule","visible":true,"order":7,"title":"Usage Heatmap"},{"id":"quota","colSpan":4,"rowSpan":1,"moduleId":"QuotaModule","visible":false,"order":8,"title":"Quota"},{"id":"globe","colSpan":4,"rowSpan":2,"moduleId":"GlobeModule","visible":false,"order":9,"title":"Global Distribution"},{"id":"anomaly-banner","colSpan":12,"rowSpan":1,"moduleId":"AnomalyBanner","visible":false,"order":10,"title":"Anomaly Detected"},{"id":"agent-insight","colSpan":6,"rowSpan":1,"moduleId":"AgentInsightCard","visible":false,"order":11,"title":"Agent Insight"}]';

/** Generative UI scenario: area chart expanded (12-card ids, same as layouts.ts). */
export const RESTRUCTURE_LAYOUT_JSON =
  '[{"id":"area-chart","colSpan":12,"rowSpan":1,"moduleId":"AreaChartModule","visible":true,"order":0,"title":"Traffic & Revenue"},{"id":"revenue","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":1,"title":"Revenue"},{"id":"users","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":2,"title":"Users"},{"id":"ai-calls","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":3,"title":"AI Calls"},{"id":"churn","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":false,"order":4,"title":"Churn"},{"id":"activity","colSpan":4,"rowSpan":2,"moduleId":"ActivityFeed","visible":true,"order":5,"title":"Activity"},{"id":"donut","colSpan":4,"rowSpan":1,"moduleId":"DonutChartModule","visible":true,"order":6,"title":"Breakdown"},{"id":"heatmap","colSpan":4,"rowSpan":1,"moduleId":"HeatmapModule","visible":true,"order":7,"title":"Usage Heatmap"},{"id":"quota","colSpan":4,"rowSpan":1,"moduleId":"QuotaModule","visible":false,"order":8,"title":"Quota"},{"id":"globe","colSpan":4,"rowSpan":2,"moduleId":"GlobeModule","visible":false,"order":9,"title":"Global Distribution"},{"id":"anomaly-banner","colSpan":12,"rowSpan":1,"moduleId":"AnomalyBanner","visible":false,"order":10,"title":"Anomaly Detected"},{"id":"agent-insight","colSpan":6,"rowSpan":1,"moduleId":"AgentInsightCard","visible":false,"order":11,"title":"Agent Insight"}]';

const baseTs = 1700000000000;

export const MOCK_AGENT_RESPONSES: AgentMessage[] = [
  {
    id: "mock-1",
    role: "assistant",
    content: LAYOUT_JSON,
    timestamp: baseTs + 1000,
  },
  {
    id: "mock-2",
    role: "assistant",
    content:
      "Revenue is 12% above baseline this month. Signups dipped briefly this morning but recovered.",
    timestamp: baseTs + 2000,
  },
  {
    id: "mock-3",
    role: "assistant",
    content:
      "Active Users shows 12,847 — the trend is up over the last 12 periods. No anomalies detected.",
    timestamp: baseTs + 3000,
  },
  {
    id: "mock-4",
    role: "assistant",
    content:
      'Here are some actions: [{"id":"c1","label":"Reorder dashboard","action":"layout"},{"id":"c2","label":"Explain metrics","action":"explain"}]',
    timestamp: baseTs + 4000,
  },
  {
    id: "mock-5",
    role: "assistant",
    content:
      "Quick summary: your key metrics are within normal range. Churn is down 0.4%, which is positive.",
    timestamp: baseTs + 5000,
  },
];
