// SPDX-License-Identifier: MIT
// apps/demo — mock agent responses for testing and MockAdapter-style flows.

import type { AgentMessage } from "@novasphere/agent-core";

/** Valid BentoLayoutConfig[] JSON string for Generative UI trigger testing. */
const LAYOUT_JSON =
  '[{"id":"revenue-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":0},{"id":"users-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":1},{"id":"ai-calls-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":2},{"id":"churn-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":3},{"id":"activity-feed","colSpan":4,"rowSpan":2,"moduleId":"ActivityFeed","visible":true,"order":4},{"id":"area-chart","colSpan":8,"rowSpan":1,"moduleId":"AreaChartModule","visible":true,"order":5}]';

/** Generative UI scenario: when user sends "restructure dashboard" or similar, MockAdapter returns this. */
export const RESTRUCTURE_LAYOUT_JSON =
  '[{"id":"area-chart","colSpan":12,"rowSpan":1,"moduleId":"AreaChartModule","visible":true,"order":0},{"id":"revenue-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":1},{"id":"users-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":2},{"id":"ai-calls-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":3},{"id":"churn-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":false,"order":4},{"id":"activity-feed","colSpan":4,"rowSpan":2,"moduleId":"ActivityFeed","visible":true,"order":5}]';

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
