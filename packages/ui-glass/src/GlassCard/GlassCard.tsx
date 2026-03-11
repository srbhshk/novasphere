// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — GlassCard
// Liquid glass card with variant styles, optional highlight sheen and hover lift.

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils";
import styles from "./GlassCard.module.css";

export type GlassCardVariant = "subtle" | "medium" | "strong";

export type GlassCardProps = {
  variant?: GlassCardVariant;
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
  /** Renders a diagonal top-left sheen overlay. */
  highlight?: boolean;
};

export default function GlassCard({
  variant = "medium",
  className,
  children,
  asChild = false,
  highlight = false,
}: GlassCardProps): JSX.Element {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        styles.glassCard,
        styles[variant],
        !asChild && styles.hoverable,
        highlight && styles.highlight,
        className
      )}
      role={asChild ? undefined : "group"}
    >
      {children}
    </Comp>
  );
}
