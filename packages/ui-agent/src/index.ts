// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — package entry
// Copilot Panel UI: CopilotPanel, AgentMessage, SuggestionChips, TypingIndicator,
// AdapterStatusBadge, AdapterInfoPopover, and useAgentStore.

export { CopilotPanel } from "./CopilotPanel";
export type { CopilotPanelProps, CopilotPanelRef } from "./CopilotPanel";

export { AgentMessage } from "./AgentMessage";
export type { AgentMessageProps } from "./AgentMessage";

export { SuggestionChips } from "./SuggestionChips";
export type { SuggestionChipsProps } from "./SuggestionChips";

export { TypingIndicator } from "./TypingIndicator";
export type { TypingIndicatorProps } from "./TypingIndicator";

export { AdapterStatusBadge } from "./AdapterStatusBadge";
export type { AdapterStatusBadgeProps } from "./AdapterStatusBadge";

export { AdapterInfoPopover } from "./AdapterInfoPopover";
export type { AdapterInfoPopoverProps } from "./AdapterInfoPopover";

export { useAgentStore } from "./agent.store";
export type { AgentStoreState, AgentStoreActions } from "./agent.store";
