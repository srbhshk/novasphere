// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — AgentMessage
// Renders user (right) and assistant (left) bubbles with optional streaming cursor.

import { cn } from "../lib/utils";
import type { AgentMessage as AgentMessageType } from "@novasphere/agent-core";
import styles from "./AgentMessage.module.css";

export type AgentMessageProps = {
  /** The message to render. */
  message: AgentMessageType;
  /** When true, assistant message shows streaming state (e.g. blinking cursor). */
  isStreaming?: boolean;
  /** Optional streaming content to show instead of message.content during stream. */
  streamingContent?: string;
  className?: string;
};

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const h = d.getHours();
  const m = d.getMinutes();
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/**
 * Single message bubble. User messages right-aligned, assistant left-aligned.
 * Timestamps shown as HH:MM. Streaming assistant shows streamingContent + blinking cursor.
 */
export default function AgentMessage({
  message,
  isStreaming = false,
  streamingContent,
  className,
}: AgentMessageProps): JSX.Element {
  const isUser = message.role === "user";
  const time = formatTime(message.timestamp);
  const displayContent =
    !isUser && isStreaming && typeof streamingContent === "string"
      ? streamingContent
      : message.content;

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
        className
      )}
      data-role={message.role}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
          isUser
            ? "bg-ns-accent/20 text-ns-text"
            : "bg-ns-surface/80 text-ns-text border border-ns-accent-2/50"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{displayContent}</p>
        {!isUser && isStreaming && (
          <span className={styles.cursor} aria-hidden />
        )}
        <p
          className="mt-1 text-xs text-ns-muted"
          aria-label={`Time: ${time}`}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
