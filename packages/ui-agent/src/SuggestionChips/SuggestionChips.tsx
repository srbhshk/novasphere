// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — SuggestionChips
// Horizontal scrollable row of chip buttons. Chips disappear after one is selected.

import { cn } from "../lib/utils";
import type { SuggestionChip } from "@novasphere/agent-core";

export type SuggestionChipsProps = {
  /** Chips to display. */
  chips: SuggestionChip[];
  /** Called when a chip is selected. */
  onSelect: (chip: SuggestionChip) => void;
  className?: string;
};

/**
 * Horizontal scrollable row of suggestion chips. After a chip is selected,
 * the parent typically clears chips so they disappear.
 */
export default function SuggestionChips({
  chips,
  onSelect,
  className,
}: SuggestionChipsProps): JSX.Element {
  if (chips.length === 0) return <></>;

  return (
    <div
      className={cn("flex gap-2 overflow-x-auto pb-2 scrollbar-thin", className)}
      role="group"
      aria-label="Suggested actions"
    >
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onSelect(chip)}
          className={cn(
            "shrink-0 rounded-full border border-ns-border bg-ns-surface/80 px-3 py-1.5",
            "text-xs font-medium text-ns-text transition-colors",
            "hover:border-ns-accent-2/40 hover:bg-ns-accent-2/10",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ns-border-hi"
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
