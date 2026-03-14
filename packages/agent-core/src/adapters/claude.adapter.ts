// SPDX-License-Identifier: MIT
// @novasphere/agent-core — ClaudeAdapter
// Server-side only. Used via apps/demo API route. Uses @anthropic-ai/sdk.

import type { AgentAdapter } from '../adapter.interface';
import type { AgentMessage, AgentResponse } from '../agent.types';
import type { AgentContext } from '../context.types';
import { getPrompt } from '../prompts';
import { AgentError, AgentNetworkError, AgentParseError, AgentTimeoutError } from '../agent.errors';

const DEFAULT_MODEL = 'claude-3-5-haiku-20241022';
const CHAT_TIMEOUT_MS = 30_000;
const STREAM_TIMEOUT_MS = 60_000;

export type ClaudeAdapterConfig = {
  apiKey: string;
  model?: string;
  chatTimeoutMs?: number;
  streamTimeoutMs?: number;
};

function toAnthropicMessages(
  messages: AgentMessage[],
  userContent: string
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const out: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  for (const m of messages) {
    if (m.role === 'user' || m.role === 'assistant') {
      out.push({ role: m.role, content: m.content });
    }
  }
  if (userContent && (out.length === 0 || out[out.length - 1]?.role !== 'user')) {
    out.push({ role: 'user', content: userContent });
  }
  return out;
}

function makeResponse(content: string): AgentResponse {
  return {
    message: {
      id: `claude-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
    },
    isStreaming: false,
    done: true,
  };
}

export class ClaudeAdapter implements AgentAdapter {
  readonly type = 'claude';
  readonly modelName: string;
  private readonly apiKey: string;
  private readonly chatTimeoutMs: number;
  private readonly streamTimeoutMs: number;

  constructor(config: ClaudeAdapterConfig) {
    if (!config.apiKey?.trim()) {
      throw new Error('ClaudeAdapter requires a non-empty apiKey');
    }
    this.apiKey = config.apiKey;
    this.modelName = config.model ?? DEFAULT_MODEL;
    this.chatTimeoutMs = config.chatTimeoutMs ?? CHAT_TIMEOUT_MS;
    this.streamTimeoutMs = config.streamTimeoutMs ?? STREAM_TIMEOUT_MS;
  }

  async init(): Promise<void> {
    // Validation done in constructor; no async health check required.
  }

  async chat(messages: AgentMessage[], context: AgentContext): Promise<AgentResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.chatTimeoutMs);
    try {
      const { Anthropic } = await import('@anthropic-ai/sdk');
      const client = new Anthropic({ apiKey: this.apiKey });
      const prompt = getPrompt('metric_explain');
      const userContent = prompt.buildUserPrompt(context, context.userMessage);
      const anthropicMessages = toAnthropicMessages(messages, userContent);
      const response = await client.messages.create(
        {
          model: this.modelName,
          max_tokens: 1024,
          system: prompt.systemPrompt,
          messages: anthropicMessages,
        },
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      let content = '';
      for (const block of response.content) {
        // Safe: block shape verified above; Anthropic API returns text blocks with .text.
        if (block && typeof block === 'object' && 'type' in block && block.type === 'text' && 'text' in block && typeof (block as { text: string }).text === 'string') {
          content += (block as { text: string }).text;
        }
      }
      return makeResponse(content);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new AgentTimeoutError(`Claude chat timed out after ${this.chatTimeoutMs}ms`);
      }
      if (err instanceof AgentError) throw err;
      if (err instanceof Error) {
        throw new AgentNetworkError(err.message, { cause: err });
      }
      throw new AgentParseError('Unexpected error from Claude API');
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
      const { Anthropic } = await import('@anthropic-ai/sdk');
      const client = new Anthropic({ apiKey: this.apiKey });
      const prompt = getPrompt('metric_explain');
      const userContent = prompt.buildUserPrompt(context, context.userMessage);
      const anthropicMessages = toAnthropicMessages(messages, userContent);
      const stream = await client.messages.create(
        {
          model: this.modelName,
          max_tokens: 1024,
          system: prompt.systemPrompt,
          messages: anthropicMessages,
          stream: true,
        },
        { signal: controller.signal }
      );
      let fullContent = '';
      for await (const event of stream) {
        // Safe: delta shape verified; Anthropic stream sends .text on content_block_delta.
        if (event.type === 'content_block_delta' && event.delta && typeof (event.delta as { text?: string }).text === 'string') {
          const text = (event.delta as { text: string }).text;
          fullContent += text;
          onToken(text);
        }
      }
      clearTimeout(timeoutId);
      return makeResponse(fullContent);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new AgentTimeoutError(`Claude stream timed out after ${this.streamTimeoutMs}ms`);
      }
      if (err instanceof AgentError) throw err;
      if (err instanceof Error) {
        throw new AgentNetworkError(err.message, { cause: err });
      }
      throw new AgentParseError('Unexpected error from Claude stream');
    }
  }

  getStatus(): 'idle' | 'checking' | 'thinking' | 'streaming' | 'downloading' | 'error' {
    return 'idle';
  }

  async destroy(): Promise<void> {}
}
