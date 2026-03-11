// SPDX-License-Identifier: MIT
// apps/demo — Intent classification and explanation generation for Generative UI.

import { INTENT, type Intent, detectKeywordIntent } from "./intents";

const OLLAMA_BASE_URL = (process.env.OLLAMA_BASE_URL ?? "http://localhost:11434").replace(/\/+$/, "");
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen2.5:0.5b";
const OLLAMA_TIMEOUT_MS = 3000;

type OllamaChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OllamaChatRequest = {
  model: string;
  messages: OllamaChatMessage[];
  temperature: number;
  max_tokens: number;
};

type OllamaChatChoice = {
  message?: {
    content?: string;
  };
};

type OllamaChatResponse = {
  choices?: OllamaChatChoice[];
};

/**
 * Human-readable layout descriptions used to explain what Nova changed.
 */
export const LAYOUT_DESCRIPTIONS: Record<Intent, string> = {
  [INTENT.CEO_VIEW]: "show a high-level executive view with revenue as the hero metric",
  [INTENT.ENGINEER_VIEW]: "surface engineering metrics — API calls, usage patterns, and infrastructure",
  [INTENT.MORNING_BRIEFING]: "set up your morning briefing with overnight activity at the top",
  [INTENT.EOD_SUMMARY]: "show a full-day trend summary with today's numbers",
  [INTENT.FOCUS_REVENUE]: "focus on revenue with a large trend chart",
  [INTENT.FOCUS_USERS]: "focus on user growth and churn",
  [INTENT.FOCUS_ENGINEERING]: "focus on engineering health, AI calls, and infra signals",
  [INTENT.ANOMALY_REVENUE]: "highlight the revenue anomaly with supporting context",
  [INTENT.ANOMALY_INFRA]: "surface the infrastructure incident with event logs",
  [INTENT.EXPAND_CHART]: "expand the trend chart for detailed analysis",
  [INTENT.EXPAND_ACTIVITY]: "expand the activity feed for full event history",
  [INTENT.DEFAULT_LAYOUT]: "restore the default balanced layout",
  [INTENT.CONVERSATIONAL]: "keep the current layout",
};

const ALL_INTENT_VALUES: Intent[] = Object.values(INTENT);

/**
 * Calls Ollama's chat completions API with a timeout, returning the trimmed content string.
 */
async function callOllama(request: OllamaChatRequest): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, OLLAMA_TIMEOUT_MS);

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    const parsed = data as OllamaChatResponse;
    const content =
      parsed.choices &&
      parsed.choices[0] &&
      parsed.choices[0].message &&
      typeof parsed.choices[0].message.content === "string"
        ? parsed.choices[0].message.content
        : null;

    return content !== null ? content.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Stage 2 classifier using Ollama when keywords do not give a clear answer.
 */
async function classifyWithOllama(message: string): Promise<Intent> {
  const systemPrompt =
    "You are a dashboard intent classifier.\n" +
    "Classify the user message into exactly one of these intents.\n" +
    "Reply with ONLY the intent string, nothing else.\n" +
    "Intents: focus_revenue, focus_users, focus_engineering,\n" +
    "ceo_view, engineer_view, morning_briefing, eod_summary,\n" +
    "anomaly_revenue, anomaly_infra, expand_chart,\n" +
    "expand_activity, default_layout, conversational";

  const content = await callOllama({
    model: OLLAMA_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    temperature: 0,
    max_tokens: 20,
  });

  if (!content) {
    return INTENT.CONVERSATIONAL;
  }

  const normalised = content.trim().toLowerCase();
  const matched = ALL_INTENT_VALUES.find((intent) => intent === normalised);

  return matched ?? INTENT.CONVERSATIONAL;
}

/**
 * Classifies a user message into an Intent.
 *
 * Stage 1: keyword detection (instant, no AI).
 * Stage 2: Ollama classification for ambiguous messages.
 */
export async function classifyIntent(message: string): Promise<Intent> {
  const keywordIntent = detectKeywordIntent(message);
  if (keywordIntent) {
    return keywordIntent;
  }

  return classifyWithOllama(message);
}

/**
 * Generates a short explanation for the CopilotPanel after a layout change.
 */
export async function generateExplanation(intent: Intent, userMessage: string): Promise<string> {
  const layoutDescription = LAYOUT_DESCRIPTIONS[intent] ?? "update the dashboard layout";

  const systemPrompt =
    "You are Nova, an AI dashboard assistant. Be concise — max 2 sentences.";

  const userPrompt = `${userMessage.trim()} I've restructured the dashboard to ${layoutDescription}.`;

  const content = await callOllama({
    model: OLLAMA_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0,
    max_tokens: 80,
  });

  if (!content || content.length === 0) {
    return "I've updated the dashboard to better match what you asked for.";
  }

  return content;
}

