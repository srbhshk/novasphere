// SPDX-License-Identifier: MIT
// @novasphere/agent-core — WebLLMAdapter
// Browser-only adapter using @mlc-ai/web-llm. Requires WebGPU.

import type { AgentAdapter } from '../adapter.interface';
import type { AgentMessage, AgentResponse } from '../agent.types';
import type { AgentContext } from '../context.types';
import { getPrompt } from '../prompts';
import { AgentParseError, AgentTimeoutError, WebGPUNotSupportedError } from '../agent.errors';

const WEBLLM_MODEL_ID = 'Phi-3-mini-4k-instruct-q4f16_1-MLC';
const CHAT_TIMEOUT_MS = 30_000;
const STREAM_TIMEOUT_MS = 60_000;

function timeoutPromise<T>(ms: number, message: string): Promise<T> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new AgentTimeoutError(message)), ms);
  });
}

export type WebLLMAdapterConfig = {
  onProgress?: (progress: number, text: string) => void;
  chatTimeoutMs?: number;
  streamTimeoutMs?: number;
};

type MLCEngine = {
  chat: {
    completions: {
      create(request: {
        messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
        stream?: boolean;
      }): Promise<{ choices?: Array<{ message?: { content?: string | null } }> }> | Promise<AsyncIterable<{ choices?: Array<{ delta?: { content?: string | null } }> }>>;
    };
  };
  unload(): Promise<void>;
};

function toWebLLMMessages(
  messages: AgentMessage[],
  systemPrompt: string,
  userContent: string
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const out: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];
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
      id: `webllm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
    },
    isStreaming: false,
    done: true,
  };
}

export class WebLLMAdapter implements AgentAdapter {
  readonly type = 'webllm';
  readonly modelName = 'Phi-3-mini-4k-instruct-q4f16_1-MLC';

  private engine: MLCEngine | null = null;
  private readonly onProgress: ((progress: number, text: string) => void) | undefined;
  private readonly chatTimeoutMs: number;
  private readonly streamTimeoutMs: number;

  constructor(config: WebLLMAdapterConfig = {}) {
    this.onProgress = config.onProgress;
    this.chatTimeoutMs = config.chatTimeoutMs ?? CHAT_TIMEOUT_MS;
    this.streamTimeoutMs = config.streamTimeoutMs ?? STREAM_TIMEOUT_MS;
  }

  async init(): Promise<void> {
    if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
      throw new WebGPUNotSupportedError('WebGPU is not supported in this environment');
    }
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    const onProgress = this.onProgress;
    const engineConfig = onProgress
      ? {
          initProgressCallback: (report: { progress: number; text: string }) => {
            onProgress(report.progress, report.text);
          },
        }
      : undefined;
    // Safe: @mlc-ai/web-llm is dynamically imported; MLCEngine type not available statically — cast verified at runtime.
    this.engine = (await CreateMLCEngine(WEBLLM_MODEL_ID, engineConfig)) as unknown as MLCEngine;
  }

  async chat(messages: AgentMessage[], context: AgentContext): Promise<AgentResponse> {
    const engine = this.engine;
    if (!engine) throw new Error('WebLLMAdapter not initialized');
    const prompt = getPrompt('metric_explain');
    const userContent = prompt.buildUserPrompt(context, context.userMessage);
    const webllmMessages = toWebLLMMessages(messages, prompt.systemPrompt, userContent);
    const chatPromise = engine.chat.completions.create({
      messages: webllmMessages,
      stream: false,
    });
    const result = await Promise.race([
      chatPromise,
      timeoutPromise<never>(
        this.chatTimeoutMs,
        `WebLLM chat timed out after ${this.chatTimeoutMs}ms`
      ),
    ]);
    // Safe: WebLLM create() returns engine-specific shape; we only read choices[0].message.content.
    const resolved = result as { choices?: Array<{ message?: { content?: string | null } }> };
    const content = resolved?.choices?.[0]?.message?.content ?? '';
    if (typeof content !== 'string') {
      throw new AgentParseError('Invalid WebLLM response content');
    }
    return makeResponse(content);
  }

  async streamChat(
    messages: AgentMessage[],
    context: AgentContext,
    onToken: (token: string) => void
  ): Promise<AgentResponse> {
    const engine = this.engine;
    if (!engine) throw new Error('WebLLMAdapter not initialized');
    const prompt = getPrompt('metric_explain');
    const userContent = prompt.buildUserPrompt(context, context.userMessage);
    const webllmMessages = toWebLLMMessages(messages, prompt.systemPrompt, userContent);
    const streamPromise = (async () => {
      const stream = await engine.chat.completions.create({
        messages: webllmMessages,
        stream: true,
      });
      let fullContent = '';
      // Safe: WebLLM stream shape; we only read choices[0].delta.content.
      const iterable = stream as AsyncIterable<{ choices?: Array<{ delta?: { content?: string | null } }> }>;
      for await (const chunk of iterable) {
        const delta = chunk?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string') {
          fullContent += delta;
          onToken(delta);
        }
      }
      return makeResponse(fullContent);
    })();
    return Promise.race([
      streamPromise,
      timeoutPromise<never>(
        this.streamTimeoutMs,
        `WebLLM stream timed out after ${this.streamTimeoutMs}ms`
      ),
    ]);
  }

  getStatus(): 'idle' | 'checking' | 'thinking' | 'streaming' | 'downloading' | 'error' {
    return this.engine ? 'idle' : 'checking';
  }

  async destroy(): Promise<void> {
    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
    }
  }
}
