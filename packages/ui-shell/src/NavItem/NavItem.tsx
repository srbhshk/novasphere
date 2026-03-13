// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — NavItem
// Renders nav link with icon and label. Active state uses accent glow. Tooltip when collapsed.

import type { ReactElement } from "react";
import type { TenantNavItem } from "@novasphere/tenant-core";
import { getNavIcon } from "./nav-icons";
import { cn } from "../lib/utils";
import styles from "./NavItem.module.css";

export type NavItemProps = {
  item: TenantNavItem;
  isCollapsed?: boolean;
};

export default function NavItem({
  item,
  isCollapsed = false,
}: NavItemProps): ReactElement {
  const Icon = getNavIcon(item.icon);
  const isActive = item.active === true;
  const content = (
    <>
      <span className={styles.iconWrap} aria-hidden>
        <Icon size={20} strokeWidth={1.5} />
      </span>
      <span className={styles.navItemLabel}>{item.label}</span>
    </>
  );

  const className = cn(
    styles.navItem,
    isActive && styles.navItemActive,
    isCollapsed && styles.navItemCollapsed
  );

  return (
    <a
      href={item.href}
      className={className}
      title={isCollapsed ? item.label : undefined}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </a>
  );
}
