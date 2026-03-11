// SPDX-License-Identifier: MIT
// @novasphere/agent-core — prompts
// Typed prompt templates for agent tasks. All agent prompts live here.

import type { AgentContext } from './context.types';

/** Identifiers for the 5 agent task prompts. */
export type AgentPromptId =
  | 'layout_restructure'
  | 'intent_classify'
  | 'anomaly_summarise'
  | 'action_suggest'
  | 'metric_explain';

/** Single prompt definition: system text and user-prompt builder. */
export type AgentPrompt = {
  id: AgentPromptId;
  systemPrompt: string;
  buildUserPrompt: (context: AgentContext, userMessage: string) => string;
  expectedFormat: 'json' | 'text';
  /** JSON schema description for JSON prompts. */
  outputSchema?: string;
};

/** Full BentoCardConfig shape inline so the model knows exactly what JSON to return. */
const BENTO_CARD_SCHEMA = `Each element must be: { "id": string, "colSpan": number (one of 3, 4, 5, 6, 7, 8, 9, 12), "rowSpan": number (1, 2, or 3), "moduleId": string, "title"?: string, "visible": boolean, "order": number }. colSpan and rowSpan are required numbers from those sets.`;

const layout_restructure: AgentPrompt = {
  id: 'layout_restructure',
  expectedFormat: 'json',
  outputSchema: `BentoLayoutConfig[] — ${BENTO_CARD_SCHEMA}`,
  systemPrompt: `You restructure the dashboard layout. Respond with valid JSON only — a single JSON array, no preamble, no markdown. Output a JSON array of card configs. Each object must have exactly: "id" (string, required), "colSpan" (number, one of 3, 4, 5, 6, 7, 8, 9, 12), "rowSpan" (number, one of 1, 2, 3), "moduleId" (string), "visible" (boolean), "order" (number). "title" is optional string. Preserve all card ids from context; only change order, visible, colSpan, rowSpan, or title as requested. Example: [{"id":"revenue-metric","colSpan":4,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":0}]`,
  buildUserPrompt(context, userMessage) {
    const cards = context.visibleCards
      .filter((c) => c.visible)
      .sort((a, b) => a.order - b.order)
      .map((c) => `${c.id}:${c.moduleId}(order ${c.order})`)
      .join(', ');
    return `Route: ${context.currentRoute}. Visible cards: [${cards}]. User: ${userMessage}`;
  },
};

const intent_classify: AgentPrompt = {
  id: 'intent_classify',
  expectedFormat: 'text',
  systemPrompt: `Classify the user intent. Respond with exactly one word: layout, query, action, explain, or other. No preamble.`,
  buildUserPrompt(context, userMessage) {
    return `Route: ${context.currentRoute}. User: ${userMessage}`;
  },
};

const anomaly_summarise: AgentPrompt = {
  id: 'anomaly_summarise',
  expectedFormat: 'text',
  systemPrompt: `Summarise metric anomalies in 1–2 short sentences. Output plain text only. No preamble.`,
  buildUserPrompt(context, userMessage) {
    const metrics = context.activeMetrics
      .map((m) => `${m.name}: ${m.value}${m.unit ?? ''}${m.trend ? ` (${m.trend})` : ''}`)
      .join('; ');
    const recent = context.recentActivity.length
      ? context.recentActivity.slice(0, 3).map((a) => `${a.type}: ${a.description ?? a.timestamp}`).join('; ')
      : 'none';
    return `Metrics: ${metrics}. Recent: ${recent}. User: ${userMessage}`;
  },
};

const action_suggest: AgentPrompt = {
  id: 'action_suggest',
  expectedFormat: 'json',
  outputSchema: `SuggestionChip[] — Array of { id: string, label: string, action: string }`,
  systemPrompt: `Suggest 2–4 quick actions as chips. Respond with valid JSON only. No preamble. Output a JSON array of objects: id (string), label (short display text), action (intent string: layout, query, action, explain, or other).`,
  buildUserPrompt(context, userMessage) {
    const cards = context.visibleCards.filter((c) => c.visible).map((c) => c.moduleId).join(', ');
    return `Route: ${context.currentRoute}. Modules: ${cards}. User: ${userMessage}`;
  },
};

const metric_explain: AgentPrompt = {
  id: 'metric_explain',
  expectedFormat: 'text',
  systemPrompt: `Explain the metric or answer the user's question in 1–2 short sentences. Plain text only. No preamble.`,
  buildUserPrompt(context, userMessage) {
    const metrics = context.activeMetrics
      .map((m) => `${m.name}: ${m.value}${m.unit ?? ''}${m.trend ? ` (${m.trend})` : ''}`)
      .join('; ');
    return `Metrics: ${metrics}. User: ${userMessage}`;
  },
};

/** All prompts keyed by id. */
export const PROMPTS: Record<AgentPromptId, AgentPrompt> = {
  layout_restructure,
  intent_classify,
  anomaly_summarise,
  action_suggest,
  metric_explain,
};

/**
 * Returns the prompt for the given id.
 *
 * @param id - AgentPromptId
 * @returns The AgentPrompt
 */
export function getPrompt(id: AgentPromptId): AgentPrompt {
  return PROMPTS[id];
}
