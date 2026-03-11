// SPDX-License-Identifier: MIT
// @novasphere/agent-core — OllamaAdapter
// Local Ollama backend. Health check on init; OpenAI-compatible chat/stream.

import type { AgentAdapter } from '../adapter.interface';
import type { AgentMessage, AgentResponse } from '../agent.types';
import type { AgentContext } from '../context.types';
import { getPrompt } from '../prompts';
import { AgentNetworkError, AgentParseError, OllamaNotReachableError } from '../agent.errors';

const DEFAULT_BASE_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'qwen2.5:0.5b';
const INIT_TIMEOUT_MS = 2000;

export type OllamaAdapterConfig = {
  baseUrl?: string;
  modelName?: string;
};

type OllamaMessage = { role: 'system' | 'user' | 'assistant'; content: string };

function toOllamaMessages(messages: AgentMessage[], systemPrompt: string, userContent: string): OllamaMessage[] {
  const out: OllamaMessage[] = [{ role: 'system', content: systemPrompt }];
  for (const m of messages) {
    if (m.role === 'user' || m.role === 'assistant') {
      out.push({ role: m.role, content: m.content });
    }
  }
  if (userContent && out[out.length - 1]?.role !== 'user') {
    out.push({ role: 'user', content: userContent });
  }
  return out;
}

function buildBody(model: string, ollamaMessages: OllamaMessage[], stream: boolean): string {
  return JSON.stringify({
    model,
    messages: ollamaMessages,
    stream,
  });
}

function makeResponse(content: string): AgentResponse {
  return {
    message: {
      id: `ollama-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
    },
    isStreaming: false,
    done: true,
  };
}

export class OllamaAdapter implements AgentAdapter {
  readonly type = 'ollama';
  readonly modelName: string;
  private readonly baseUrl: string;

  constructor(config: OllamaAdapterConfig = {}) {
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.modelName = config.modelName ?? DEFAULT_MODEL;
  }

  async init(): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), INIT_TIMEOUT_MS);
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new OllamaNotReachableError(`Ollama returned ${res.status}`);
      }
    } catch (err) {
      if (err instanceof OllamaNotReachableError) throw err;
      const message = err instanceof Error ? err.message : 'Ollama health check failed';
      throw new OllamaNotReachableError(message, { cause: err instanceof Error ? err : undefined });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async chat(messages: AgentMessage[], context: AgentContext): Promise<AgentResponse> {
    const prompt = getPrompt('metric_explain');
    const userContent = prompt.buildUserPrompt(context, context.userMessage);
    const ollamaMessages = toOllamaMessages(messages, prompt.systemPrompt, userContent);
    const body = buildBody(this.modelName, ollamaMessages, false);

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    } catch (err) {
      throw new AgentNetworkError(err instanceof Error ? err.message : 'Network error', {
        cause: err instanceof Error ? err : undefined,
      });
    }

    if (!res.ok) {
      throw new AgentNetworkError(`Ollama returned ${res.status}`);
    }

    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      const text = await res.text();
      data = JSON.parse(text) as { choices?: Array<{ message?: { content?: string } }> };
    } catch {
      throw new AgentParseError('Invalid JSON response from Ollama');
    }

    const content = data?.choices?.[0]?.message?.content ?? '';
    return makeResponse(content);
  }

  async streamChat(
    messages: AgentMessage[],
    context: AgentContext,
    onToken: (token: string) => void
  ): Promise<AgentResponse> {
    const prompt = getPrompt('metric_explain');
    const userContent = prompt.buildUserPrompt(context, context.userMessage);
    const ollamaMessages = toOllamaMessages(messages, prompt.systemPrompt, userContent);
    const body = buildBody(this.modelName, ollamaMessages, true);

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    } catch (err) {
      throw new AgentNetworkError(err instanceof Error ? err.message : 'Network error', {
        cause: err instanceof Error ? err : undefined,
      });
    }

    if (!res.ok) {
      throw new AgentNetworkError(`Ollama returned ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) {
      throw new AgentNetworkError('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.slice(6).trim();
            if (payload === '[DONE]') continue;
            try {
              const data = JSON.parse(payload) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const delta = data?.choices?.[0]?.delta?.content;
              if (typeof delta === 'string') {
                fullContent += delta;
                onToken(delta);
              }
            } catch {
              // ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof AgentNetworkError) throw err;
      throw new AgentNetworkError(err instanceof Error ? err.message : 'Stream read failed', {
        cause: err instanceof Error ? err : undefined,
      });
    }

    return makeResponse(fullContent);
  }

  getStatus(): 'idle' | 'checking' | 'thinking' | 'streaming' | 'downloading' | 'error' {
    return 'idle';
  }

  async destroy(): Promise<void> {}
}
