# @novasphere/ui-agent

Copilot Panel UI for the agent system. It renders the chat panel, messages, input, suggestion chips, typing indicator, and adapter status. It only talks to the app via the `AgentAdapter` interface from `@novasphere/agent-core`; it does not depend on a specific AI provider.

## Install

```bash
npm install @novasphere/ui-agent @novasphere/agent-core @novasphere/ui-glass @novasphere/tokens
```

Peer dependencies: `react`, `react-dom`, `framer-motion`, `zustand`.

## Usage

Create an adapter with `createAdapter()` from `@novasphere/agent-core`, then pass it and a context getter to `CopilotPanel`.

```tsx
import { CopilotPanel } from "@novasphere/ui-agent";
import { createAdapter } from "@novasphere/agent-core";

function App() {
  const adapter = createAdapter();
  const getContext = () => ({
    tenantId: "t1",
    userId: "u1",
    currentRoute: "/dashboard",
    visibleCards: [],
    activeMetrics: [],
    recentActivity: [],
    userMessage: "",
  });

  return (
    <CopilotPanel
      adapter={adapter}
      getContext={getContext}
      initialOpen={false}
      agentName="Nova"
      avatarEmoji="🤖"
      onLayoutChange={(layout) => console.log("New layout", layout)}
    />
  );
}
```

## Exports

| Export | Description |
|--------|-------------|
| `CopilotPanel` | Main panel; `adapter`, `getContext`, `initialOpen`, `onLayoutChange`, `agentName`, `avatarEmoji`, etc. |
| `AgentMessage` | Single message bubble |
| `SuggestionChips` | Horizontal chips; `chips`, `onSelect` |
| `TypingIndicator` | Typing animation |
| `AdapterStatusBadge` | Shows current adapter (Ollama, WebLLM, Claude, etc.) |
| `AdapterInfoPopover` | Explains adapter and how to change it |
| `useAgentStore` | Zustand store for messages and status (optional) |
| `CopilotPanelProps`, `CopilotPanelRef`, `AgentMessageProps`, `SuggestionChipsProps`, `TypingIndicatorProps`, `AdapterStatusBadgeProps`, `AdapterInfoPopoverProps` | Types |
| `AgentStoreState`, `AgentStoreActions` | Store types |

## Storybook

[Storybook — ui-agent](https://github.com/your-org/novasphere#storybook) (run `pnpm storybook` from repo root; ui-agent on port 6005).
