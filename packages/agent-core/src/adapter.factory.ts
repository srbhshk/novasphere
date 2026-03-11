// SPDX-License-Identifier: MIT
// @novasphere/agent-core — adapter.factory
// Creates the active adapter from config. Resolution order: Ollama → WebLLM → Mock (auto).

import type { AgentAdapter } from './adapter.interface';
import type { AdapterType } from './agent.types';
import { MockAdapter } from './adapters/mock.adapter';
import { OllamaAdapter } from './adapters/ollama.adapter';
import { WebLLMAdapter } from './adapters/webllm.adapter';
import { ClaudeAdapter } from './adapters/claude.adapter';
import type { ClaudeAdapterConfig } from './adapters/claude.adapter';
import { OpenAIAdapter } from './adapters/openai.adapter';
import type { OpenAIAdapterConfig } from './adapters/openai.adapter';

/** Config for createAdapter. type 'auto' uses resolution order: Ollama → WebLLM → Mock. */
export type AdapterFactoryConfig = {
  type: AdapterType | 'auto';
  ollamaUrl?: string;
  ollamaModel?: string;
  claudeKey?: string;
  claudeModel?: string;
  openaiKey?: string;
  openaiModel?: string;
  openaiBaseUrl?: string;
  onDownloadProgress?: (progress: number, text: string) => void;
};

/**
 * True when running in Node (e.g. API route). Claude and OpenAI adapters
 * are only created when this is true; otherwise fall back to Mock with a warning.
 */
export function isServerSide(): boolean {
  return typeof window === 'undefined';
}

/**
 * Creates and initializes the adapter from config.
 * - auto: try Ollama → WebLLM → Mock (first successful init wins).
 * - Explicit type: create that adapter; if claude/openai and client-side, return Mock and warn.
 */
export async function createAdapter(config: AdapterFactoryConfig): Promise<AgentAdapter> {
  const requestedType = config.type;

  if (requestedType !== 'auto') {
    if ((requestedType === 'claude' || requestedType === 'openai') && !isServerSide()) {
      const mock = new MockAdapter();
      await mock.init();
      return mock;
    }
    const adapter = createAdapterByType(requestedType, config);
    await adapter.init();
    return adapter;
  }

  // auto: try Ollama first
  try {
    const ollamaConfig: { baseUrl?: string; modelName?: string } = {};
    if (config.ollamaUrl !== undefined) ollamaConfig.baseUrl = config.ollamaUrl;
    if (config.ollamaModel !== undefined) ollamaConfig.modelName = config.ollamaModel;
    const ollama = new OllamaAdapter(ollamaConfig);
    await ollama.init();
    return ollama;
  } catch {
    // Ollama not reachable; try WebLLM (browser only)
  }

  if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
    try {
      const webllmConfig: { onProgress?: (progress: number, text: string) => void } = {};
      if (config.onDownloadProgress !== undefined) webllmConfig.onProgress = config.onDownloadProgress;
      const webllm = new WebLLMAdapter(webllmConfig);
      await webllm.init();
      return webllm;
    } catch {
      // WebLLM failed; fall back to Mock
    }
  }

  const mock = new MockAdapter();
  await mock.init();
  return mock;
}

function createAdapterByType(
  type: AdapterType,
  config: AdapterFactoryConfig
): AgentAdapter {
  switch (type) {
    case 'ollama': {
      const ollamaConfig: { baseUrl?: string; modelName?: string } = {};
      if (config.ollamaUrl !== undefined) ollamaConfig.baseUrl = config.ollamaUrl;
      if (config.ollamaModel !== undefined) ollamaConfig.modelName = config.ollamaModel;
      return new OllamaAdapter(ollamaConfig);
    }
    case 'webllm': {
      const webllmConfig: { onProgress?: (progress: number, text: string) => void } = {};
      if (config.onDownloadProgress !== undefined) webllmConfig.onProgress = config.onDownloadProgress;
      return new WebLLMAdapter(webllmConfig);
    }
    case 'claude': {
      if (!config.claudeKey?.trim()) {
        throw new Error('Claude adapter requires claudeKey in config');
      }
      const claudeConfig: ClaudeAdapterConfig = { apiKey: config.claudeKey };
      if (config.claudeModel !== undefined) claudeConfig.model = config.claudeModel;
      return new ClaudeAdapter(claudeConfig);
    }
    case 'openai': {
      if (!config.openaiKey?.trim()) {
        throw new Error('OpenAI adapter requires openaiKey in config');
      }
      const openaiConfig: OpenAIAdapterConfig = { apiKey: config.openaiKey };
      if (config.openaiModel !== undefined) openaiConfig.model = config.openaiModel;
      if (config.openaiBaseUrl !== undefined) openaiConfig.baseUrl = config.openaiBaseUrl;
      return new OpenAIAdapter(openaiConfig);
    }
    case 'mock':
      return new MockAdapter();
    default:
      return new MockAdapter();
  }
}
