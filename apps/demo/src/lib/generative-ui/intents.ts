// SPDX-License-Identifier: MIT
// apps/demo — Intent classification and layout presets for Generative UI.

import type { BentoLayoutConfig } from "@novasphere/ui-bento";

// =============================================================================
// PART A — Intent types
// =============================================================================

export const INTENT = {
  // Layout restructure intents
  FOCUS_REVENUE: "focus_revenue",
  FOCUS_USERS: "focus_users",
  FOCUS_ENGINEERING: "focus_engineering",

  // Role-based view intents
  CEO_VIEW: "ceo_view",
  ENGINEER_VIEW: "engineer_view",

  // Time-based intents
  MORNING_BRIEFING: "morning_briefing",
  EOD_SUMMARY: "eod_summary",

  // Anomaly intents
  ANOMALY_REVENUE: "anomaly_revenue",
  ANOMALY_INFRA: "anomaly_infra",

  // Drill-down intents
  EXPAND_CHART: "expand_chart",
  EXPAND_ACTIVITY: "expand_activity",

  // Reset
  DEFAULT_LAYOUT: "default_layout",

  // Not a layout intent — just answer conversationally
  CONVERSATIONAL: "conversational",
} as const;

export type Intent = (typeof INTENT)[keyof typeof INTENT];

// =============================================================================
// PART B — Keyword trigger map (instant, no AI needed for obvious phrases)
// =============================================================================

export const KEYWORD_TRIGGERS: Record<string, Intent> = {
  // CEO / executive
  ceo: INTENT.CEO_VIEW,
  executive: INTENT.CEO_VIEW,
  board: INTENT.CEO_VIEW,
  investor: INTENT.CEO_VIEW,
  "high level": INTENT.CEO_VIEW,

  // Engineer
  engineer: INTENT.ENGINEER_VIEW,
  technical: INTENT.ENGINEER_VIEW,
  infra: INTENT.ENGINEER_VIEW,
  infrastructure: INTENT.ENGINEER_VIEW,
  devops: INTENT.ENGINEER_VIEW,
  latency: INTENT.ENGINEER_VIEW,
  pipeline: INTENT.ENGINEER_VIEW,

  // Morning / EOD
  morning: INTENT.MORNING_BRIEFING,
  standup: INTENT.MORNING_BRIEFING,
  "good morning": INTENT.MORNING_BRIEFING,
  "start of day": INTENT.MORNING_BRIEFING,
  eod: INTENT.EOD_SUMMARY,
  "end of day": INTENT.EOD_SUMMARY,
  "wrap up": INTENT.EOD_SUMMARY,
  "daily summary": INTENT.EOD_SUMMARY,

  // Focus
  revenue: INTENT.FOCUS_REVENUE,
  sales: INTENT.FOCUS_REVENUE,
  mrr: INTENT.FOCUS_REVENUE,
  arr: INTENT.FOCUS_REVENUE,
  users: INTENT.FOCUS_USERS,
  growth: INTENT.FOCUS_USERS,
  retention: INTENT.FOCUS_USERS,
  churn: INTENT.FOCUS_USERS,

  // Anomaly
  anomaly: INTENT.ANOMALY_REVENUE,
  spike: INTENT.ANOMALY_REVENUE,
  alert: INTENT.ANOMALY_INFRA,
  incident: INTENT.ANOMALY_INFRA,
  outage: INTENT.ANOMALY_INFRA,

  // Expand
  expand: INTENT.EXPAND_CHART,
  zoom: INTENT.EXPAND_CHART,
  drill: INTENT.EXPAND_CHART,
  detail: INTENT.EXPAND_CHART,
  activity: INTENT.EXPAND_ACTIVITY,
  feed: INTENT.EXPAND_ACTIVITY,
  events: INTENT.EXPAND_ACTIVITY,

  // Reset
  reset: INTENT.DEFAULT_LAYOUT,
  default: INTENT.DEFAULT_LAYOUT,
  original: INTENT.DEFAULT_LAYOUT,
  home: INTENT.DEFAULT_LAYOUT,
};

/**
 * Detects intent from message using keyword triggers (no AI). Returns null if no match.
 */
export function detectKeywordIntent(message: string): Intent | null {
  const lower = message.toLowerCase();
  for (const [keyword, intent] of Object.entries(KEYWORD_TRIGGERS)) {
    if (lower.includes(keyword)) return intent;
  }
  return null;
}

// =============================================================================
// Layout presets — BentoLayoutConfig per layout-changing intent
// Card ids and moduleIds must match apps/demo layout store and module registry.
// =============================================================================

const DEMO_CARD_IDS = {
  REVENUE: "revenue-metric",
  USERS: "users-metric",
  AI_CALLS: "ai-calls-metric",
  CHURN: "churn-metric",
  ACTIVITY: "activity-feed",
  AREA_CHART: "area-chart",
} as const;

/** Default layout — matches layout.store.ts INITIAL_LAYOUT. */
export const DEFAULT_LAYOUT_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 4, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 8, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 5 },
];

/** CEO view: revenue and users prominent, chart full width, activity compact. */
const CEO_VIEW_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 6, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 6, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 12, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 4, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 5 },
];

/** Engineer view: activity and chart prominent, infra metrics first. */
const ENGINEER_VIEW_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 8, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 12, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 5 },
];

/** Focus revenue: revenue large, others secondary. */
const FOCUS_REVENUE_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 6, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 6, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 3, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 5 },
];

/** Focus users: users and churn/retention prominent. */
const FOCUS_USERS_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.USERS, colSpan: 6, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 6, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 6, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 6, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 5 },
];

/** Focus engineering: AI calls and activity feed prominent. */
const FOCUS_ENGINEERING_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 6, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 6, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 12, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 5 },
];

/** Morning briefing: high-level metrics + chart. */
const MORNING_BRIEFING_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 8, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 4, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 5 },
];

/** EOD summary: same as morning or default with chart emphasis. */
const EOD_SUMMARY_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 8, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 4, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 5 },
];

/** Expand chart: area chart full width, others compact. */
const EXPAND_CHART_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 12, rowSpan: 2, moduleId: "AreaChartModule", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 4, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 5 },
];

/** Expand activity: activity feed large, chart and metrics secondary. */
const EXPAND_ACTIVITY_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 8, rowSpan: 3, moduleId: "ActivityFeed", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 8, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 5 },
];

/** Anomaly revenue: revenue and chart prominent for investigation. */
const ANOMALY_REVENUE_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 6, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 6, rowSpan: 2, moduleId: "AreaChartModule", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 3, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 5 },
];

/** Anomaly infra: AI calls and activity for incident view. */
const ANOMALY_INFRA_PRESET: BentoLayoutConfig = [
  { id: DEMO_CARD_IDS.AI_CALLS, colSpan: 6, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: DEMO_CARD_IDS.ACTIVITY, colSpan: 6, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 1 },
  { id: DEMO_CARD_IDS.AREA_CHART, colSpan: 12, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 2 },
  { id: DEMO_CARD_IDS.REVENUE, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: DEMO_CARD_IDS.USERS, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 4 },
  { id: DEMO_CARD_IDS.CHURN, colSpan: 4, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 5 },
];

/** Intents that have an associated layout preset. CONVERSATIONAL has no layout. */
export const LAYOUT_PRESETS: Partial<Record<Intent, BentoLayoutConfig>> = {
  [INTENT.DEFAULT_LAYOUT]: DEFAULT_LAYOUT_PRESET,
  [INTENT.CEO_VIEW]: CEO_VIEW_PRESET,
  [INTENT.ENGINEER_VIEW]: ENGINEER_VIEW_PRESET,
  [INTENT.FOCUS_REVENUE]: FOCUS_REVENUE_PRESET,
  [INTENT.FOCUS_USERS]: FOCUS_USERS_PRESET,
  [INTENT.FOCUS_ENGINEERING]: FOCUS_ENGINEERING_PRESET,
  [INTENT.MORNING_BRIEFING]: MORNING_BRIEFING_PRESET,
  [INTENT.EOD_SUMMARY]: EOD_SUMMARY_PRESET,
  [INTENT.EXPAND_CHART]: EXPAND_CHART_PRESET,
  [INTENT.EXPAND_ACTIVITY]: EXPAND_ACTIVITY_PRESET,
  [INTENT.ANOMALY_REVENUE]: ANOMALY_REVENUE_PRESET,
  [INTENT.ANOMALY_INFRA]: ANOMALY_INFRA_PRESET,
};

/**
 * Returns the layout config for the given intent, or the default layout when no preset or CONVERSATIONAL.
 */
export function getLayoutForIntent(intent: Intent, fallback: BentoLayoutConfig): BentoLayoutConfig {
  const preset = LAYOUT_PRESETS[intent];
  return preset ?? fallback;
}
