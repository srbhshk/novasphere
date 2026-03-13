// SPDX-License-Identifier: MIT
// apps/demo — Bento module: shows the latest Nova insight with typewriter effect and follow-up chips.

"use client";

import * as React from "react";
import type { BentoCardModuleProps } from "@novasphere/ui-bento";
import { useAgentStore, SuggestionChips } from "@novasphere/ui-agent";
import type { SuggestionChip } from "@novasphere/agent-core";

const SUGGESTION_CHIPS: SuggestionChip[] = [
  { id: "tell-more", label: "Tell me more", action: "tell_more" },
  { id: "show-breakdown", label: "Show breakdown", action: "show_breakdown" },
  { id: "export-report", label: "Export report", action: "export_report" },
];

function useTypewriter(text: string, speedMs: number = 18): string {
  const [displayed, setDisplayed] = React.useState<string>("");

  React.useEffect(() => {
    if (!text) {
      setDisplayed("");
      return undefined;
    }
    let index = 0;
    setDisplayed("");
    const id = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(id);
      }
    }, speedMs);
    return () => {
      window.clearInterval(id);
    };
  }, [text, speedMs]);

  return displayed;
}

export default function AgentInsightCard({
  config,
}: BentoCardModuleProps): React.ReactElement {
  const title = config.title ?? "Nova's Insight";
  const messages = useAgentStore((state) => state.messages);
  const lastAssistant = React.useMemo(
    () =>
      [...messages]
        .reverse()
        .find((m) => m.role === "assistant"),
    [messages]
  );

  const insightText =
    lastAssistant?.content ??
    "Waiting for Nova to analyse your dashboard and surface insights.";

  const typed = useTypewriter(lastAssistant?.content ?? "");
  const showSkeleton = !lastAssistant;

  const handleChipSelect = (chip: SuggestionChip): void => {
    if (typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("novasphere:copilot-open", {
        detail: {
          presetInput: chip.action,
        },
      })
    );
  };

  if (showSkeleton) {
    return (
      <div className="flex h-full flex-col rounded-xl border border-ns-border/60 bg-ns-surface/40 px-4 py-3">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-ns-muted animate-pulse" aria-hidden />
          <span className="text-xs font-semibold tracking-wide text-ns-muted">
            ✦ {title}
          </span>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-2/3 rounded bg-ns-muted/20 animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-ns-muted/20 animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-ns-muted/20 animate-pulse" />
        </div>
        <p className="mt-4 text-xs text-ns-muted">Waiting for Nova…</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-ns-border/60 bg-ns-surface/60 px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-ns-accent opacity-75 animate-ping" aria-hidden />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ns-accent" aria-hidden />
        </span>
        <span className="text-xs font-semibold tracking-wide text-ns-muted">
          ✦ {title}
        </span>
      </div>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-ns-text">
        {typed || insightText}
      </p>
      <div className="mt-3">
        <SuggestionChips chips={SUGGESTION_CHIPS} onSelect={handleChipSelect} />
      </div>
    </div>
  );
}

