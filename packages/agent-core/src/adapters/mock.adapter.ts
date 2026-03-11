// SPDX-License-Identifier: MIT
// @novasphere/agent-core — MockAdapter
// In-memory adapter for demo, CI, and testing. No network.

import type { AgentAdapter } from '../adapter.interface';
import type { AgentMessage, AgentResponse } from '../agent.types';
import type { AgentContext } from '../context.types';

const MOCK_RESPONSES: string[] = [
  '[{"id":"metrics","colSpan":6,"rowSpan":1,"moduleId":"metrics","title":"Metrics","visible":true,"order":0},{"id":"charts","colSpan":6,"rowSpan":2,"moduleId":"charts","visible":true,"order":1}]',
  'Revenue is 12% above baseline. Signups dipped briefly this morning.',
  'This metric shows active users in the last 24 hours. The trend is up.',
  '[{"id":"c1","label":"Reorder dashboard","action":"layout"},{"id":"c2","label":"Explain metrics","action":"explain"}]',
  'Here’s a quick summary: your key metrics are within normal range.',
];

/** Generative UI: restructure layout — area chart 12 cols, churn hidden, reordered. */
const RESTRUCTURE_LAYOUT_JSON =
  '[{"id":"area-chart","colSpan":12,"rowSpan":1,"moduleId":"AreaChartModule","visible":true,"order":0},{"id":"revenue-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":1},{"id":"users-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":2},{"id":"ai-calls-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":true,"order":3},{"id":"churn-metric","colSpan":3,"rowSpan":1,"moduleId":"MetricCard","visible":false,"order":4},{"id":"activity-feed","colSpan":4,"rowSpan":2,"moduleId":"ActivityFeed","visible":true,"order":5}]';

function isRestructureIntent(userMessage: string): boolean {
  const lower = userMessage.toLowerCase().trim();
  return (
    lower.includes('restructure') ||
    lower.includes('focus on revenue')
  );
}

function makeResponse(content: string): AgentResponse {
  return {
    message: {
      id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      role: 'assistant',
      content,
      timestamp: Date.now(),
    },
    isStreaming: false,
    done: true,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAdapter implements AgentAdapter {
  readonly type = 'mock';
  readonly modelName = 'mock-v1';

  private _callIndex = 0;
  private _initialized = false;

  async init(): Promise<void> {
    this._initialized = true;
  }

  async chat(messages: AgentMessage[], context: AgentContext): Promise<AgentResponse> {
    await delay(800);
    const userMessage = context.userMessage ?? messages.filter((m) => m.role === 'user').pop()?.content ?? '';
    const content = isRestructureIntent(userMessage)
      ? RESTRUCTURE_LAYOUT_JSON
      : (MOCK_RESPONSES[this._callIndex % MOCK_RESPONSES.length] ?? '');
    if (!isRestructureIntent(userMessage)) this._callIndex += 1;
    return makeResponse(content);
  }

  async streamChat(
    messages: AgentMessage[],
    context: AgentContext,
    onToken: (token: string) => void
  ): Promise<AgentResponse> {
    const userMessage = context.userMessage ?? messages.filter((m) => m.role === 'user').pop()?.content ?? '';
    const content = isRestructureIntent(userMessage)
      ? RESTRUCTURE_LAYOUT_JSON
      : (MOCK_RESPONSES[this._callIndex % MOCK_RESPONSES.length] ?? '');
    if (!isRestructureIntent(userMessage)) this._callIndex += 1;
    const words = content.split(/(\s+)/).filter((w): w is string => w !== undefined && w.length > 0);
    const tokens: string[] = [];
    for (const w of words) {
      if (w.length > 8) {
        for (let i = 0; i < w.length; i += 4) tokens.push(w.slice(i, i + 4));
      } else {
        tokens.push(w);
      }
    }
    for (const token of tokens) {
      onToken(token);
      await delay(60);
    }
    return makeResponse(content);
  }

  getStatus(): 'idle' | 'checking' | 'thinking' | 'streaming' | 'downloading' | 'error' {
    return this._initialized ? 'idle' : 'idle';
  }

  async destroy(): Promise<void> {}
}
