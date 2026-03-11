// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — AdapterInfoPopover
// Content panel explaining which adapter is running and how to change it.

import * as React from "react";
import { cn } from "../lib/utils";
import type { AdapterType } from "@novasphere/agent-core";

export type AdapterInfoPopoverProps = {
  /** Current adapter type. */
  adapterType: AdapterType | null;
  /** Model name from adapter. */
  modelName: string | null;
  /** Optional class name for the content panel. */
  className?: string;
  /** Optional children rendered after the default content. */
  children?: React.ReactNode;
};

function getAdapterDescription(type: AdapterType | null): string {
  switch (type) {
    case "ollama":
      return "Running locally via Ollama. No API key required. Install Ollama for offline use.";
    case "webllm":
      return "Running in your browser with WebLLM. One-time model download, then works offline.";
    case "claude":
      return "Using Anthropic Claude API. Set ANTHROPIC_API_KEY to use.";
    case "openai":
      return "Using OpenAI API. Set OPENAI_API_KEY to use.";
    case "mock":
      return "Demo mode. No real AI — responses are predefined. Use Ollama or set API keys for real responses.";
    default:
      return "Detecting or initialising the AI engine…";
  }
}

/**
 * Popover content explaining the current adapter and how to change it.
 * Parent is responsible for positioning (e.g. in a Radix Popover or dropdown).
 */
export default function AdapterInfoPopover({
  adapterType,
  modelName,
  className,
  children,
}: AdapterInfoPopoverProps): JSX.Element {
  const description = getAdapterDescription(adapterType);

  return (
    <div
      className={cn(
        "rounded-lg border border-ns-border bg-ns-surface p-3 text-sm shadow-lg",
        "min-w-[220px] max-w-[280px]",
        className
      )}
      role="dialog"
      aria-label="Adapter information"
    >
      <p className="font-medium text-ns-text">
        {adapterType ?? "Unknown"} {modelName ? `· ${modelName}` : ""}
      </p>
      <p className="mt-1.5 text-ns-muted">{description}</p>
      {children}
    </div>
  );
}
