// SPDX-License-Identifier: MIT
// apps/demo — Intent classification and keyword triggers for Generative UI.

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
