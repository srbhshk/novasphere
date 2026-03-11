// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — TypingIndicator
// Three bouncing dots shown when the agent is thinking or streaming.

import { cn } from "../lib/utils";
import styles from "./TypingIndicator.module.css";

export type TypingIndicatorProps = {
  /** Optional class name. */
  className?: string;
  /** Optional aria-label for accessibility. */
  "aria-label"?: string;
};

/**
 * Three bouncing dots. Visible when status is 'thinking' or 'streaming'.
 * Respects prefers-reduced-motion.
 */
export default function TypingIndicator({
  className,
  "aria-label": ariaLabel = "Agent is typing",
}: TypingIndicatorProps): JSX.Element {
  return (
    <div
      className={cn(styles.typingIndicator, className)}
      role="status"
      aria-label={ariaLabel}
    >
      <span className={styles.dot} aria-hidden />
      <span className={styles.dot} aria-hidden />
      <span className={styles.dot} aria-hidden />
    </div>
  );
}
