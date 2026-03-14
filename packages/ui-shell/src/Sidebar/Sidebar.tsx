// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — Sidebar
// Icon-only sidebar (72px) with nav items, user slot, and expand/collapse at bottom. Uses GlassPanel.

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TenantConfig } from "@novasphere/tenant-core";
import { GlassPanel } from "@novasphere/ui-glass";
import { NavItem } from "../NavItem";
import styles from "./Sidebar.module.css";

export type SidebarProps = {
  tenant: TenantConfig;
  currentPath: string;
  /** Optional slot for user avatar/menu at bottom (e.g. UserMenu from ui-auth). */
  userSlot?: React.ReactNode;
  /** When true, sidebar shows labels and uses expanded width. */
  expanded?: boolean;
  /** Called when user clicks expand/collapse control at bottom. */
  onExpandToggle?: () => void;
};

export default function Sidebar({
  tenant,
  currentPath,
  userSlot,
  expanded = false,
  onExpandToggle,
}: SidebarProps): React.ReactElement {
  const navItemsWithActive = tenant.navItems.map((item) => ({
    ...item,
    active: currentPath === item.href || currentPath.startsWith(`${item.href}/`),
  }));

  return (
    <aside
      className={styles.sidebar}
      role="navigation"
      aria-label="Main navigation"
      data-expanded={expanded ? "true" : "false"}
    >
      <GlassPanel
        variant="strong"
        {...(styles.sidebarPanel ? { className: styles.sidebarPanel } : {})}
      >
        <div className={styles.sidebarInner}>
          <div className={styles.sidebarBody}>
            <nav className={styles.navList} aria-label="Primary">
              {navItemsWithActive.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isCollapsed={!expanded}
                />
              ))}
            </nav>
            {userSlot != null ? (
              <div className={styles.userSlot}>{userSlot}</div>
            ) : null}
          </div>
          {onExpandToggle != null ? (
            <div className={styles.expandFooter}>
              <button
                type="button"
                className={styles.expandButton}
                onClick={onExpandToggle}
                aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                title={expanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                {expanded ? (
                  <ChevronLeft size={20} strokeWidth={1.5} aria-hidden />
                ) : (
                  <ChevronRight size={20} strokeWidth={1.5} aria-hidden />
                )}
                {expanded ? (
                  <span className={styles.expandLabel}>Collapse</span>
                ) : (
                  <span className={styles.expandLabel}>Expand</span>
                )}
              </button>
            </div>
          ) : null}
        </div>
      </GlassPanel>
    </aside>
  );
}
