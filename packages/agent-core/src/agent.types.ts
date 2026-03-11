// SPDX-License-Identifier: MIT
// @novasphere/agent-core — agent.types
// Core agent message, status, response, and adapter type definitions.

/** Role of the message sender in the conversation. */
export type AgentRole = 'user' | 'assistant' | 'system';

/**
 * A single message in the agent conversation.
 */
export type AgentMessage = {
  /** Unique message id. */
  id: string;
  /** Sender role. */
  role: AgentRole;
  /** Message body. */
  content: string;
  /** Unix timestamp (ms). */
  timestamp: number;
};

/** Current status of the agent/adapter. */
export type AgentStatus =
  | 'idle'
  | 'checking'
  | 'thinking'
  | 'streaming'
  | 'downloading'
  | 'error';

/**
 * Response from the agent (chat or stream). Carries the message and stream state.
 */
export type AgentResponse = {
  /** The message (partial when streaming). */
  message: AgentMessage;
  /** Whether the response is still streaming. */
  isStreaming: boolean;
  /** Whether the response is complete. */
  done: boolean;
};

/**
 * Suggestion chip shown in the copilot UI. action is the intent string sent to the agent.
 */
export type SuggestionChip = {
  /** Unique chip id. */
  id: string;
  /** Display label. */
  label: string;
  /** Intent string passed back to the agent when selected. */
  action: string;
};

/** Adapter type identifiers. */
export const ADAPTER_TYPE = {
  OLLAMA: 'ollama',
  WEBLLM: 'webllm',
  CLAUDE: 'claude',
  OPENAI: 'openai',
  MOCK: 'mock',
} as const;

export type AdapterType = (typeof ADAPTER_TYPE)[keyof typeof ADAPTER_TYPE];
