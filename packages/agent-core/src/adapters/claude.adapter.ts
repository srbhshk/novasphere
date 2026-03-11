// SPDX-License-Identifier: MIT
// @novasphere/agent-core — ClaudeAdapter
// Server-side only. Used via apps/demo API route. Uses @anthropic-ai/sdk.

import type { AgentAdapter } from '../adapter.interface';
import type { AgentMessage, AgentResponse } from '../agent.types';
import type { AgentContext } from '../context.types';
import { getPrompt } from '../prompts';
import { AgentNetworkError, AgentParseError } from '../agent.errors';

const DEFAULT_MODEL = 'claude-3-5-haiku-20241022';

export type ClaudeAdapterConfig = {
  apiKey: string;
  model?: string;
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

  constructor(config: ClaudeAdapterConfig) {
    if (!config.apiKey?.trim()) {
      throw new Error('ClaudeAdapter requires a non-empty apiKey');
    }
    this.apiKey = config.apiKey;
    this.modelName = config.model ?? DEFAULT_MODEL;
  }

  async init(): Promise<void> {
    // Validation done in constructor; no async health check required.
  }

  async chat(messages: AgentMessage[], context: AgentContext): Promise<AgentResponse> {
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: this.apiKey });
    const prompt = getPrompt('metric_explain');
    const userContent = prompt.buildUserPrompt(context, context.userMessage);
    const anthropicMessages = toAnthropicMessages(messages, userContent);
    try {
      const response = await client.messages.create({
        model: this.modelName,
        max_tokens: 1024,
        system: prompt.systemPrompt,
        messages: anthropicMessages,
      });
      let content = '';
      for (const block of response.content) {
        if (block && typeof block === 'object' && 'type' in block && block.type === 'text' && 'text' in block && typeof (block as { text: string }).text === 'string') {
          content += (block as { text: string }).text;
        }
      }
      return makeResponse(content);
    } catch (err) {
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
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey: this.apiKey });
    const prompt = getPrompt('metric_explain');
    const userContent = prompt.buildUserPrompt(context, context.userMessage);
    const anthropicMessages = toAnthropicMessages(messages, userContent);
    let fullContent = '';
    try {
      const stream = await client.messages.create({
        model: this.modelName,
        max_tokens: 1024,
        system: prompt.systemPrompt,
        messages: anthropicMessages,
        stream: true,
      });
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta && typeof (event.delta as { text?: string }).text === 'string') {
          const text = (event.delta as { text: string }).text;
          fullContent += text;
          onToken(text);
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new AgentNetworkError(err.message, { cause: err });
      }
      throw new AgentParseError('Unexpected error from Claude stream');
    }
    return makeResponse(fullContent);
  }

  getStatus(): 'idle' | 'checking' | 'thinking' | 'streaming' | 'downloading' | 'error' {
    return 'idle';
  }

  async destroy(): Promise<void> {}
}
