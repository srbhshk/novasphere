// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — CopilotPanel
// Agent chat panel: messages, input, suggestions, adapter status. Uses GlassPanel and agent store.

"use client";

import * as React from "react";
import { useRef, useEffect, useState, useCallback, useImperativeHandle } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { GlassPanel } from "@novasphere/ui-glass";
import {
  type AgentAdapter,
  type AgentContext,
  type AgentMessage as AgentMessageType,
  type BentoCardConfig,
  type SuggestionChip,
} from "@novasphere/agent-core";
import { useAgentStore } from "../agent.store";
import { cn } from "../lib/utils";
import { AdapterStatusBadge } from "../AdapterStatusBadge";
import { AdapterInfoPopover } from "../AdapterInfoPopover";
import { AgentMessage } from "../AgentMessage";
import { SuggestionChips } from "../SuggestionChips";
import { TypingIndicator } from "../TypingIndicator";

export type CopilotPanelRef = {
  /** Open the panel and set the input to the given text (e.g. for follow-up from ContextBanner). */
  openAndSetInput: (text: string) => void;
  /** Submit the current input value, equivalent to pressing Enter in the textarea. */
  sendCurrentInput: () => void;
};

export type CopilotPanelProps = {
  /** Injected adapter from consuming app (e.g. from createAdapter). */
  adapter: AgentAdapter;
  /** Context getter — app provides current context for each send. */
  getContext: () => AgentContext;
  /** When true, panel is open on first render. */
  initialOpen?: boolean;
  /** Called when response parses as BentoLayoutConfig JSON (Generative UI). */
  onLayoutChange?: (layout: BentoCardConfig[]) => void;
  /** Called after each assistant response with the full content (e.g. for anomaly detection). */
  onAgentResponse?: (content: string) => void;
  /** Optional ref to open panel and set input (e.g. for Investigate from ContextBanner). */
  copilotRef?: React.Ref<CopilotPanelRef | null>;
  /**
   * Optional app-provided pipeline for handling user messages.
   * When provided, adapter.streamChat is not called; instead this function
   * is awaited and its string result is shown as the assistant message.
   */
  onUserMessage?: (message: string) => Promise<string>;
  /** Agent display name. */
  agentName?: string;
  /** Agent avatar (emoji or text). */
  avatarEmoji?: string;
  className?: string;
};

function tryParseLayoutJson(content: string): BentoCardConfig[] | null {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return null;
  try {
    const parsed = JSON.parse(jsonMatch[0]) as unknown;
    if (!Array.isArray(parsed)) return null;
    const valid = parsed.every(
      (item: unknown): item is BentoCardConfig =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "visible" in item &&
        "order" in item &&
        "moduleId" in item
    );
    return valid ? (parsed as BentoCardConfig[]) : null;
  } catch {
    return null;
  }
}

/**
 * Copilot panel: header with adapter badge, scrollable messages, typing indicator,
 * download progress (WebLLM), input and suggestion chips.
 */
export default function CopilotPanel({
  adapter,
  getContext,
  initialOpen = false,
  onLayoutChange,
  onAgentResponse,
  copilotRef,
  onUserMessage,
  agentName = "Nova",
  avatarEmoji = "🤖",
  className,
}: CopilotPanelProps): JSX.Element {
  const [open, setOpen] = useState(initialOpen);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionChip[]>([]);
  const [infoPopoverOpen, setInfoPopoverOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    status,
    adapterType,
    adapterModel,
    downloadProgress,
    streamingContent,
    addMessage,
    setStatus,
    setAdapter,
    appendStreamToken,
    finaliseStream,
  } = useAgentStore();

  useEffect(() => {
    let cancelled = false;
    setStatus("checking");
    adapter
      .init()
      .then(() => {
        if (!cancelled) {
          setAdapter(adapter.type, adapter.modelName);
          setStatus(adapter.getStatus());
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("idle");
      });
    return () => {
      cancelled = true;
    };
  }, [adapter, setAdapter, setStatus]);

  const scrollToBottom = useCallback(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || status === "thinking" || status === "streaming" || status === "downloading") return;

    const userMessage: AgentMessageType = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    addMessage(userMessage);
    setInput("");
    setSuggestions([]);
    setStatus("thinking");

    try {
      if (onUserMessage) {
        const explanation = await onUserMessage(text);
        const assistantMessage: AgentMessageType = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: explanation,
          timestamp: Date.now(),
        };
        addMessage(assistantMessage);
        if (onAgentResponse) onAgentResponse(explanation);
        setStatus("idle");
      } else {
        const context = getContext();
        const response = await adapter.streamChat(
          [...messages, userMessage],
          { ...context, userMessage: text },
          (token) => {
            setStatus("streaming");
            appendStreamToken(token);
          }
        );
        finaliseStream();
        setStatus(adapter.getStatus());

        const content = response.message.content;
        if (onAgentResponse) onAgentResponse(content);
        const layout = tryParseLayoutJson(content);
        if (layout && onLayoutChange) onLayoutChange(layout);

        const chipsMatch = content.match(
          /\[\s*\{\s*"id"\s*:\s*"[^"]+"\s*,\s*"label"\s*:\s*"[^"]+"\s*,\s*"action"\s*:\s*"[^"]+"\s*\}\s*(?:,\s*\{\s*"id"\s*:\s*"[^"]+"\s*,\s*"label"\s*:\s*"[^"]+"\s*,\s*"action"\s*:\s*"[^"]+"\s*\})*\s*\]/
        );
        if (chipsMatch) {
          try {
            const chips = JSON.parse(chipsMatch[0]) as SuggestionChip[];
            if (Array.isArray(chips)) setSuggestions(chips);
          } catch {
            // ignore
          }
        }
      }
    } catch {
      finaliseStream();
      setStatus("error");
    }
  }, [
    input,
    status,
    messages,
    addMessage,
    setStatus,
    getContext,
    adapter,
    appendStreamToken,
    finaliseStream,
    onLayoutChange,
    onAgentResponse,
    onUserMessage,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
      if (e.key === "Escape") {
        setInput("");
        inputRef.current?.blur();
      }
    },
    [handleSend]
  );

  const handleSuggestionSelect = useCallback(
    (chip: SuggestionChip) => {
      setInput(chip.action);
      setSuggestions([]);
      inputRef.current?.focus();
    },
    []
  );

  useImperativeHandle(
    copilotRef,
    () => ({
      openAndSetInput(text: string) {
        setInput(text);
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      sendCurrentInput() {
        void handleSend();
      },
    }),
    [handleSend]
  );

  const showTyping =
    status === "thinking" || status === "streaming";
  const showDownloadBar = status === "downloading";
  const isDisabled =
    status === "thinking" || status === "streaming" || status === "downloading";

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full",
          "bg-ns-surface border border-ns-border text-ns-text shadow-lg",
          "hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ns-accent",
          className
        )}
        aria-label="Open copilot"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col",
        "rounded-xl shadow-xl",
        className
      )}
    >
      <GlassPanel variant="strong" className="flex max-h-[520px] flex-col overflow-hidden">
        <header className="flex flex-shrink-0 items-center gap-2 border-b border-ns-border px-3 py-2">
          <span className="text-lg" aria-hidden>
            {avatarEmoji}
          </span>
          <span className="font-medium text-ns-text">{agentName}</span>
          <div className="flex-1" />
          <div className="relative">
            <AdapterStatusBadge
              adapterType={adapterType}
              status={status}
              modelName={adapterModel}
              {...(showDownloadBar ? { downloadProgress } : {})}
              onInfoClick={() => setInfoPopoverOpen((v) => !v)}
            />
            {infoPopoverOpen && (
              <div className="absolute right-0 top-full z-10 mt-1">
                <AdapterInfoPopover
                  adapterType={adapterType}
                  modelName={adapterModel}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded p-1 text-ns-muted hover:bg-white/5 hover:text-ns-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ns-border-hi"
            aria-label="Close copilot"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <AgentMessage key={msg.id} message={msg} />
            ))}
            {status === "streaming" && streamingContent && (
              <AgentMessage
                message={{
                  id: "streaming",
                  role: "assistant",
                  content: "",
                  timestamp: Date.now(),
                }}
                isStreaming
                streamingContent={streamingContent}
              />
            )}
            {showTyping && status !== "streaming" && (
              <TypingIndicator aria-label="Agent is typing" />
            )}
            {showDownloadBar && (
              <div className="rounded-lg border border-ns-border bg-ns-surface/80 p-3 text-sm">
                <p className="text-ns-muted">
                  ↓ Loading model [{Math.round(downloadProgress)}%]
                </p>
                <p className="mt-1 text-xs text-ns-muted">
                  One-time download — instant on next load
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ns-border">
                  <div
                    className="h-full bg-ns-accent transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 border-t border-ns-border p-3">
            {suggestions.length > 0 && (
              <SuggestionChips chips={suggestions} onSelect={handleSuggestionSelect} />
            )}
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Nova…"
                disabled={isDisabled}
                rows={1}
                className={cn(
                  "min-h-[40px] flex-1 resize-none rounded-lg border border-ns-border bg-ns-surface px-3 py-2 text-sm text-ns-text placeholder:text-ns-muted",
                  "focus:outline-none focus:ring-1 focus:ring-ns-border-hi disabled:opacity-50"
                )}
                aria-label="Message input"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isDisabled || !input.trim()}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ns-accent text-white",
                  "hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ns-accent"
                )}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
