// SPDX-License-Identifier: MIT
// @novasphere/agent-core — OpenAIAdapter
// Server-side only. Uses openai package. Supports custom baseUrl.

import type { AgentAdapter } from '../adapter.interface';
import type { AgentMessage, AgentResponse } from '../agent.types';
import type { AgentContext } from '../context.types';
import { getPrompt } from '../prompts';
import { AgentError, AgentNetworkError, AgentParseError, AgentTimeoutError } from '../agent.errors';

const DEFAULT_MODEL = 'gpt-4o-mini';
const CHAT_TIMEOUT_MS = 30_000;
const STREAM_TIMEOUT_MS = 60_000;

export type OpenAIAdapterConfig = {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  chatTimeoutMs?: number;
  streamTimeoutMs?: number;
};

type OpenAIMessage = { role: 'system' | 'user' | 'assistant'; content: string };

function toOpenAIMessages(
  messages: AgentMessage[],
  systemPrompt: string,
  userContent: string
): OpenAIMessage[] {
  const out: OpenAIMessage[] = [{ role: 'system', content: systemPrompt }];
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

function makeResponse(content: string): AgentResponse {
  return {
    message: {
      id: `openai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
    },
    isStreaming: false,
    done: true,
  };
}

export class OpenAIAdapter implements AgentAdapter {
  readonly type = 'openai';
  readonly modelName: string;
  private readonly apiKey: string;
  private readonly baseUrl: string | undefined;
  private readonly chatTimeoutMs: number;
  private readonly streamTimeoutMs: number;

  constructor(config: OpenAIAdapterConfig) {
    if (!config.apiKey?.trim()) {
      throw new Error('OpenAIAdapter requires a non-empty apiKey');
    }
    this.apiKey = config.apiKey;
    this.modelName = config.model ?? DEFAULT_MODEL;
    this.baseUrl = config.baseUrl;
    this.chatTimeoutMs = config.chatTimeoutMs ?? CHAT_TIMEOUT_MS;
    this.streamTimeoutMs = config.streamTimeoutMs ?? STREAM_TIMEOUT_MS;
  }

  async init(): Promise<void> {
    // No async health check required.
  }

  async chat(messages: AgentMessage[], context: AgentContext): Promise<AgentResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.chatTimeoutMs);
    try {
      const { default: OpenAI } = await import('openai');
      const client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.baseUrl,
      });
      const prompt = getPrompt('metric_explain');
      const userContent = prompt.buildUserPrompt(context, context.userMessage);
      const openaiMessages = toOpenAIMessages(messages, prompt.systemPrompt, userContent);
      const completion = await client.chat.completions.create(
        {
          model: this.modelName,
          messages: openaiMessages,
          stream: false,
        },
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      const content = completion.choices?.[0]?.message?.content ?? '';
      if (typeof content !== 'string') {
        throw new AgentParseError('Invalid OpenAI response content');
      }
      return makeResponse(content);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new AgentTimeoutError(`OpenAI chat timed out after ${this.chatTimeoutMs}ms`);
      }
      if (err instanceof AgentError) throw err;
      if (err instanceof Error) {
        throw new AgentNetworkError(err.message, { cause: err });
      }
      throw new AgentParseError('Unexpected error from OpenAI API');
    }
  }

  async streamChat(
    messages: AgentMessage[],
    context: AgentContext,
    onToken: (token: string) => void
  ): Promise<AgentResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.streamTimeoutMs);
    try {
      const { default: OpenAI } = await import('openai');
      const client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.baseUrl,
      });
      const prompt = getPrompt('metric_explain');
      const userContent = prompt.buildUserPrompt(context, context.userMessage);
      const openaiMessages = toOpenAIMessages(messages, prompt.systemPrompt, userContent);
      const stream = await client.chat.completions.create(
        {
          model: this.modelName,
          messages: openaiMessages,
          stream: true,
        },
        { signal: controller.signal }
      );
      let fullContent = '';
      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (typeof delta === 'string') {
          fullContent += delta;
          onToken(delta);
        }
      }
      clearTimeout(timeoutId);
      return makeResponse(fullContent);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new AgentTimeoutError(`OpenAI stream timed out after ${this.streamTimeoutMs}ms`);
      }
      if (err instanceof AgentError) throw err;
      if (err instanceof Error) {
        throw new AgentNetworkError(err.message, { cause: err });
      }
      throw new AgentParseError('Unexpected error from OpenAI stream');
    }
  }

  getStatus(): 'idle' | 'checking' | 'thinking' | 'streaming' | 'downloading' | 'error' {
    return 'idle';
  }

  async destroy(): Promise<void> {}
}
