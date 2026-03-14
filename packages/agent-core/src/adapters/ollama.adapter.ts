// SPDX-License-Identifier: MIT
// @novasphere/agent-core — OllamaAdapter
// Local Ollama backend. Health check on init; OpenAI-compatible chat/stream.

import type { AgentAdapter } from '../adapter.interface';
import type { AgentMessage, AgentResponse } from '../agent.types';
import type { AgentContext } from '../context.types';
import { getPrompt } from '../prompts';
import { AgentError, AgentNetworkError, AgentParseError, AgentTimeoutError, OllamaNotReachableError } from '../agent.errors';

const DEFAULT_BASE_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'qwen2.5:0.5b';
const INIT_TIMEOUT_MS = 2_000;
const CHAT_TIMEOUT_MS = 30_000;
const STREAM_TIMEOUT_MS = 60_000;
const STREAM_FIRST_TOKEN_TIMEOUT_MS = 10_000;

export type OllamaAdapterConfig = {
  baseUrl?: string;
  modelName?: string;
  chatTimeoutMs?: number;
  streamTimeoutMs?: number;
  firstTokenTimeoutMs?: number;
};

type OllamaChatChunk = {
  choices?: Array<{ delta?: { content?: string }; message?: { content?: string } }>;
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
  private readonly config: {
    chatTimeoutMs: number;
    streamTimeoutMs: number;
    firstTokenTimeoutMs: number;
  };

  constructor(config: OllamaAdapterConfig = {}) {
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.modelName = config.modelName ?? DEFAULT_MODEL;
    this.config = {
      chatTimeoutMs: config.chatTimeoutMs ?? CHAT_TIMEOUT_MS,
      streamTimeoutMs: config.streamTimeoutMs ?? STREAM_TIMEOUT_MS,
      firstTokenTimeoutMs: config.firstTokenTimeoutMs ?? STREAM_FIRST_TOKEN_TIMEOUT_MS,
    };
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
    const controller = new AbortController();
    const timeoutMs = this.config.chatTimeoutMs;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const prompt = getPrompt('metric_explain');
      const userContent = prompt.buildUserPrompt(context, context.userMessage);
      const ollamaMessages = toOllamaMessages(messages, prompt.systemPrompt, userContent);
      const body = buildBody(this.modelName, ollamaMessages, false);

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new AgentNetworkError(
          `Ollama returned ${response.status}: ${response.statusText}`
        );
      }

      const text = await response.text();
      let data: { choices?: Array<{ message?: { content?: string } }> };
      try {
        // Safe: Ollama chat completions API returns OpenAI-compatible shape.
        data = JSON.parse(text) as { choices?: Array<{ message?: { content?: string } }> };
      } catch {
        throw new AgentParseError('Invalid JSON response from Ollama');
      }

      const content = data?.choices?.[0]?.message?.content ?? '';
      return makeResponse(content);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new AgentTimeoutError(`Ollama chat timed out after ${timeoutMs}ms`);
      }
      if (error instanceof AgentError) throw error;
      throw new AgentNetworkError(
        `Ollama chat failed: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error instanceof Error ? error : undefined }
      );
    }
  }

  async streamChat(
    messages: AgentMessage[],
    context: AgentContext,
    onToken: (token: string) => void
  ): Promise<AgentResponse> {
    const controller = new AbortController();
    let firstTokenReceived = false;
    const totalTimeoutMs = this.config.streamTimeoutMs;
    const firstTokenTimeoutMs = this.config.firstTokenTimeoutMs;

    const totalTimeoutId = setTimeout(() => controller.abort(), totalTimeoutMs);
    const firstTokenTimeoutId = setTimeout(() => {
      if (!firstTokenReceived) controller.abort();
    }, firstTokenTimeoutMs);

    try {
      const prompt = getPrompt('metric_explain');
      const userContent = prompt.buildUserPrompt(context, context.userMessage);
      const ollamaMessages = toOllamaMessages(messages, prompt.systemPrompt, userContent);
      const body = buildBody(this.modelName, ollamaMessages, true);

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new AgentNetworkError(`Ollama stream failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.slice(6).trim();
            if (payload === '[DONE]') break;
            try {
              // Safe: Ollama SSE stream sends chunks in this shape.
              const parsed = JSON.parse(payload) as OllamaChatChunk;
              const token = parsed.choices?.[0]?.delta?.content ?? parsed.choices?.[0]?.message?.content ?? '';
              if (token) {
                if (!firstTokenReceived) {
                  firstTokenReceived = true;
                  clearTimeout(firstTokenTimeoutId);
                }
                fullContent += token;
                onToken(token);
              }
            } catch {
              // malformed chunk — skip, continue streaming
            }
          }
        }
      }

      clearTimeout(totalTimeoutId);
      clearTimeout(firstTokenTimeoutId);

      return {
        message: {
          id: `ollama-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          role: 'assistant',
          content: fullContent,
          timestamp: Date.now(),
        },
        isStreaming: false,
        done: true,
      };
    } catch (error) {
      clearTimeout(totalTimeoutId);
      clearTimeout(firstTokenTimeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        if (!firstTokenReceived) {
          throw new AgentTimeoutError(
            `Ollama: no response within ${firstTokenTimeoutMs}ms`
          );
        }
        throw new AgentTimeoutError(
          `Ollama stream timed out after ${totalTimeoutMs}ms`
        );
      }
      if (error instanceof AgentError) throw error;
      throw new AgentNetworkError(
        `Ollama stream error: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error instanceof Error ? error : undefined }
      );
    }
  }

  getStatus(): 'idle' | 'checking' | 'thinking' | 'streaming' | 'downloading' | 'error' {
    return 'idle';
  }

  async destroy(): Promise<void> {}
}
