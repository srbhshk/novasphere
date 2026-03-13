// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — GlassPanel
// Liquid glass panel with variant styles and optional header/footer slots. No hover transform.

import * as React from "react";
import { cn } from "../lib/utils";
import styles from "./GlassPanel.module.css";

export type GlassPanelVariant = "subtle" | "medium" | "strong";

export type GlassPanelProps = {
  variant?: GlassPanelVariant;
  className?: string;
  children: React.ReactNode;
  /** Optional slot rendered above the main content. */
  header?: React.ReactNode;
  /** Optional slot rendered below the main content. */
  footer?: React.ReactNode;
  /** When true, allows content (e.g. dropdowns) to overflow the panel bounds. */
  allowOverflow?: boolean;
};

export default function GlassPanel({
  variant = "medium",
  className,
  children,
  header,
  footer,
  allowOverflow = false,
}: GlassPanelProps): JSX.Element {
  return (
    <div
      className={cn(
        styles.glassPanel,
        styles[variant],
        allowOverflow && styles.allowOverflow,
        className
      )}
      role="region"
      aria-label="Panel"
    >
      {header != null ? (
        <div className={styles.glassPanelHeader}>{header}</div>
      ) : null}
      <div className={styles.glassPanelBody}>{children}</div>
      {footer != null ? (
        <div className={styles.glassPanelFooter}>{footer}</div>
      ) : null}
    </div>
  );
}
