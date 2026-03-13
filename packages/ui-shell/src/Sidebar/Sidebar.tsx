// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — Sidebar
// Icon-only sidebar (72px) with logo, nav items, and user slot. Uses GlassPanel.

import * as React from "react";
import type { TenantConfig } from "@novasphere/tenant-core";
import { GlassPanel } from "@novasphere/ui-glass";
import { NavItem } from "../NavItem";
import styles from "./Sidebar.module.css";

export type SidebarProps = {
  tenant: TenantConfig;
  currentPath: string;
  /** Optional slot for user avatar/menu at bottom (e.g. UserMenu from ui-auth). */
  userSlot?: React.ReactNode;
};

export default function Sidebar({
  tenant,
  currentPath,
  userSlot,
}: SidebarProps): React.ReactElement {
  const navItemsWithActive = tenant.navItems.map((item) => ({
    ...item,
    active: currentPath === item.href || currentPath.startsWith(`${item.href}/`),
  }));

  return (
    <aside className={styles.sidebar} role="navigation" aria-label="Main navigation">
      <GlassPanel
        variant="subtle"
        {...(styles.sidebarPanel ? { className: styles.sidebarPanel } : {})}
      >
        <div className={styles.sidebarBody}>
          <div className={styles.logoWrap}>
            {tenant.logoUrl ? (
              <img
                src={tenant.logoUrl}
                alt=""
                className={styles.logoImg}
                aria-hidden
              />
            ) : (
              <div className={styles.logoMark} aria-hidden>
                {tenant.name.charAt(0)}
              </div>
            )}
          </div>
          <nav className={styles.navList} aria-label="Primary">
            {navItemsWithActive.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isCollapsed
              />
            ))}
          </nav>
          {userSlot != null ? (
            <div className={styles.userSlot}>{userSlot}</div>
          ) : null}
        </div>
      </GlassPanel>
    </aside>
  );
}
