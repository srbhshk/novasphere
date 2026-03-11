// SPDX-License-Identifier: MIT
// @novasphere/agent-core — adapter.interface
// Contract that all AI adapters must implement.

import type { AgentMessage, AgentResponse, AgentStatus, AdapterType } from './agent.types';
import type { AgentContext } from './context.types';

/**
 * Contract for AI adapters. All concrete adapters (Ollama, WebLLM, Claude, OpenAI, Mock)
 * implement this interface. The factory returns the active adapter; ui-agent uses only
 * this interface.
 */
export interface AgentAdapter {
  readonly type: AdapterType;
  readonly modelName: string;
  init(): Promise<void>;
  chat(messages: AgentMessage[], context: AgentContext): Promise<AgentResponse>;
  streamChat(
    messages: AgentMessage[],
    context: AgentContext,
    onToken: (token: string) => void
  ): Promise<AgentResponse>;
  getStatus(): AgentStatus;
  destroy(): Promise<void>;
}
