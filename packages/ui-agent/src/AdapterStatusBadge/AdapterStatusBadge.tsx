// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — AdapterStatusBadge
// Shows current adapter state (coloured dot + label). Click opens AdapterInfoPopover.

import type { ReactElement } from "react";
import { cn } from "../lib/utils";
import type { AgentStatus, AdapterType } from "@novasphere/agent-core";

export type AdapterStatusBadgeProps = {
  /** Current adapter type or null when detecting. */
  adapterType: AdapterType | null;
  /** Current agent status. */
  status: AgentStatus;
  /** Model name from adapter (e.g. "qwen2.5:0.5b"). */
  modelName: string | null;
  /** Progress 0–100 when status is 'downloading'. */
  downloadProgress?: number;
  /** Called when badge is clicked to open info popover. */
  onInfoClick?: () => void;
  className?: string;
};

function getBadgeLabel(
  adapterType: AdapterType | null,
  status: AgentStatus,
  _modelName: string | null,
  downloadProgress?: number
): string {
  if (status === "checking") return "Detecting AI engine…";
  if (status === "downloading" && typeof downloadProgress === "number") {
    return `↓ Loading model [${Math.round(downloadProgress)}%]`;
  }
  if (status === "downloading") return "↓ Loading model…";
  switch (adapterType) {
    case "ollama":
      return "● Local · Qwen2.5 0.5B";
    case "webllm":
      return "● Browser · Phi-3 Mini";
    case "claude":
      return "● Claude";
    case "openai":
      return "● GPT";
    case "mock":
      return "◌ Demo mode";
    default:
      return "Detecting AI engine…";
  }
}

function getDotColor(adapterType: AdapterType | null, status: AgentStatus): string {
  if (status === "checking" || status === "downloading") return "bg-ns-muted";
  switch (adapterType) {
    case "ollama":
      return "bg-emerald-500";
    case "webllm":
      return "bg-blue-500";
    case "claude":
      return "bg-violet-500";
    case "openai":
      return "bg-teal-500";
    case "mock":
      return "bg-ns-muted";
    default:
      return "bg-ns-muted";
  }
}

/**
 * Badge showing adapter state. Coloured dot + label. Clickable to open AdapterInfoPopover.
 */
export default function AdapterStatusBadge({
  adapterType,
  status,
  modelName,
  downloadProgress,
  onInfoClick,
  className,
}: AdapterStatusBadgeProps): ReactElement {
  const label = getBadgeLabel(adapterType, status, modelName, downloadProgress);
  const dotColor = getDotColor(adapterType, status);
  const isClickable = typeof onInfoClick === "function";

  return (
    <button
      type="button"
      onClick={onInfoClick}
      disabled={!isClickable}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ns-muted",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ns-border-hi",
        isClickable && "cursor-pointer hover:text-ns-text hover:bg-white/5",
        !isClickable && "cursor-default",
        className
      )}
      aria-label={isClickable ? "Adapter info" : undefined}
    >
      <span
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotColor)}
        aria-hidden
      />
      <span>{label}</span>
    </button>
  );
}
