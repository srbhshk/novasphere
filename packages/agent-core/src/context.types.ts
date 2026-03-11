// SPDX-License-Identifier: MIT
// @novasphere/agent-core — context.types
// AgentContext and related types for adapter calls. Assembled by the app layer.

/**
 * Card descriptor in context. Same shape as BentoCardConfig from @novasphere/ui-bento
 * so the app can pass visible cards without importing ui-bento into agent-core.
 */
export type BentoCardConfig = {
  id: string;
  colSpan: 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12;
  rowSpan: 1 | 2 | 3;
  moduleId: string;
  title?: string;
  visible: boolean;
  order: number;
};

/** Snapshot of a metric for agent context. */
export type MetricSnapshot = {
  id?: string;
  name: string;
  value: number;
  unit?: string;
  trend?: string;
};

/** Recent activity event for agent context. */
export type ActivityEvent = {
  id?: string;
  type: string;
  timestamp: number;
  description?: string;
};

/**
 * Context passed to the agent on each chat/stream call. Assembled by useAgentContext()
 * in the app; serialised into prompt for Ollama/WebLLM, sent as structured data for
 * Claude/OpenAI via API route.
 */
export type AgentContext = {
  tenantId: string;
  userId: string;
  currentRoute: string;
  visibleCards: BentoCardConfig[];
  activeMetrics: MetricSnapshot[];
  recentActivity: ActivityEvent[];
  userMessage: string;
};
