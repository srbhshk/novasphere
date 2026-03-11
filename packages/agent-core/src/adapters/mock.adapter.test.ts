// SPDX-License-Identifier: MIT
// @novasphere/agent-core — MockAdapter tests

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockAdapter } from './mock.adapter';
import type { AgentContext } from '../context.types';

const minimalContext: AgentContext = {
  tenantId: 't1',
  userId: 'u1',
  currentRoute: '/demo',
  visibleCards: [],
  activeMetrics: [],
  recentActivity: [],
  userMessage: 'hello',
};

describe('MockAdapter', () => {
  let adapter: MockAdapter;

  beforeEach(() => {
    adapter = new MockAdapter();
  });

  it('implements AgentAdapter with type mock and modelName mock-v1', () => {
    expect(adapter.type).toBe('mock');
    expect(adapter.modelName).toBe('mock-v1');
  });

  it('init() resolves immediately', async () => {
    await expect(adapter.init()).resolves.toBeUndefined();
  });

  it('getStatus() returns idle after init', async () => {
    expect(adapter.getStatus()).toBe('idle');
    await adapter.init();
    expect(adapter.getStatus()).toBe('idle');
  });

  it('chat() returns a response after ~800ms delay', async () => {
    await adapter.init();
    const res = await adapter.chat([], minimalContext);
    expect(res).toBeDefined();
    expect(res.message.role).toBe('assistant');
    expect(typeof res.message.content).toBe('string');
    expect(res.message.content.length).toBeGreaterThan(0);
    expect(res.done).toBe(true);
    expect(res.isStreaming).toBe(false);
  });

  it('streamChat() calls onToken multiple times', async () => {
    await adapter.init();
    const onToken = vi.fn<(token: string) => void>();
    const res = await adapter.streamChat([], minimalContext, onToken);
    expect(onToken).toHaveBeenCalled();
    expect(onToken.mock.calls.length).toBeGreaterThan(1);
    const concatenated = onToken.mock.calls.map((call) => call[0]).join('');
    expect(concatenated).toBe(res.message.content);
    expect(res.done).toBe(true);
    expect(res.isStreaming).toBe(false);
  });

  it('destroy() resolves immediately', async () => {
    await expect(adapter.destroy()).resolves.toBeUndefined();
  });
});
