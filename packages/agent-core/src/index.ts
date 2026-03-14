// SPDX-License-Identifier: MIT
// @novasphere/agent-core — package entry
// AI adapter system: AgentAdapter interface, factory, and implementations.

export type {
  AgentRole,
  AgentMessage,
  AgentStatus,
  AgentResponse,
  SuggestionChip,
  AdapterType,
} from './agent.types';
export { ADAPTER_TYPE } from './agent.types';

export type { AgentContext, BentoCardConfig, MetricSnapshot, ActivityEvent } from './context.types';

export type { AgentAdapter } from './adapter.interface';

export type { AgentPromptId, AgentPrompt } from './prompts';
export { PROMPTS, getPrompt } from './prompts';

export {
  AgentError,
  OllamaNotReachableError,
  AgentNetworkError,
  AgentParseError,
  AgentTimeoutError,
  WebGPUNotSupportedError,
} from './agent.errors';

export { MockAdapter } from './adapters/mock.adapter';
export { OllamaAdapter } from './adapters/ollama.adapter';
export type { OllamaAdapterConfig } from './adapters/ollama.adapter';
export { WebLLMAdapter } from './adapters/webllm.adapter';
export type { WebLLMAdapterConfig } from './adapters/webllm.adapter';
export { ClaudeAdapter } from './adapters/claude.adapter';
export type { ClaudeAdapterConfig } from './adapters/claude.adapter';
export { OpenAIAdapter } from './adapters/openai.adapter';
export type { OpenAIAdapterConfig } from './adapters/openai.adapter';

export { createAdapter, isServerSide } from './adapter.factory';
export type { AdapterFactoryConfig } from './adapter.factory';
