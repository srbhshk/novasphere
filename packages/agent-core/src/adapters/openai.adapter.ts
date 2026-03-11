// SPDX-License-Identifier: MIT
// @novasphere/agent-core — OpenAIAdapter
// Server-side only. Uses openai package. Supports custom baseUrl.

import type { AgentAdapter } from '../adapter.interface';
import type { AgentMessage, AgentResponse } from '../agent.types';
import type { AgentContext } from '../context.types';
import { getPrompt } from '../prompts';
import { AgentNetworkError, AgentParseError } from '../agent.errors';

const DEFAULT_MODEL = 'gpt-4o-mini';

export type OpenAIAdapterConfig = {
  apiKey: string;
  model?: string;
  baseUrl?: string;
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

  constructor(config: OpenAIAdapterConfig) {
    if (!config.apiKey?.trim()) {
      throw new Error('OpenAIAdapter requires a non-empty apiKey');
    }
    this.apiKey = config.apiKey;
    this.modelName = config.model ?? DEFAULT_MODEL;
    this.baseUrl = config.baseUrl;
  }

  async init(): Promise<void> {
    // No async health check required.
  }

  async chat(messages: AgentMessage[], context: AgentContext): Promise<AgentResponse> {
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseUrl,
    });
    const prompt = getPrompt('metric_explain');
    const userContent = prompt.buildUserPrompt(context, context.userMessage);
    const openaiMessages = toOpenAIMessages(messages, prompt.systemPrompt, userContent);
    try {
      const completion = await client.chat.completions.create({
        model: this.modelName,
        messages: openaiMessages,
        stream: false,
      });
      const content = completion.choices?.[0]?.message?.content ?? '';
      if (typeof content !== 'string') {
        throw new AgentParseError('Invalid OpenAI response content');
      }
      return makeResponse(content);
    } catch (err) {
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
    const { default: OpenAI } = await import('openai');
    const client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: this.baseUrl,
    });
    const prompt = getPrompt('metric_explain');
    const userContent = prompt.buildUserPrompt(context, context.userMessage);
    const openaiMessages = toOpenAIMessages(messages, prompt.systemPrompt, userContent);
    let fullContent = '';
    try {
      const stream = await client.chat.completions.create({
        model: this.modelName,
        messages: openaiMessages,
        stream: true,
      });
      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (typeof delta === 'string') {
          fullContent += delta;
          onToken(delta);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new AgentNetworkError(err.message, { cause: err });
      }
      throw new AgentParseError('Unexpected error from OpenAI stream');
    }
    return makeResponse(fullContent);
  }

  getStatus(): 'idle' | 'checking' | 'thinking' | 'streaming' | 'downloading' | 'error' {
    return 'idle';
  }

  async destroy(): Promise<void> {}
}
