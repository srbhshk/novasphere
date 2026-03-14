// SPDX-License-Identifier: MIT
// @novasphere/tenant-core — breadcrumb.resolver
// Derives breadcrumb segments (max 2) from current path and tenant nav config.

import type { TenantConfig } from "./tenant.types";
import type { BreadcrumbSegment } from "./tenant.types";

const DEFAULT_FALLBACK_TITLE = "Page";

/**
 * Normalizes path for matching: trim trailing slash, ensure leading slash.
 */
function normalizePath(path: string): string {
  let p = path.trim();
  if (p.endsWith("/") && p.length > 1) {
    p = p.slice(0, -1);
  }
  if (!p.startsWith("/")) {
    p = `/${p}`;
  }
  return p;
}

/**
 * Returns breadcrumb segments for the given path from tenant nav config.
 * At most 2 levels: [parent, current] or [current]. Last item is current page (no href).
 *
 * Matching order: exact child href → exact nav href → path under nav (prefix) → fallback.
 *
 * @param path - Current pathname (e.g. from usePathname())
 * @param tenant - Tenant config with navItems (and optional children)
 * @param fallbackTitle - Title when path does not match any nav (e.g. "Page not found")
 * @returns Array of 1 or 2 breadcrumb segments
 */
export function getBreadcrumbs(
  path: string,
  tenant: TenantConfig,
  fallbackTitle?: string
): BreadcrumbSegment[] {
  const normalized = normalizePath(path);

  // 1) Check for exact or prefix match on a child
  for (const item of tenant.navItems) {
    const children = item.children ?? [];
    for (const child of children) {
      if (normalized === normalizePath(child.href)) {
        return [
          { label: item.label, href: item.href },
          { label: child.label },
        ];
      }
    }
  }

  // 2) Exact match on a top-level nav item
  for (const item of tenant.navItems) {
    if (normalized === normalizePath(item.href)) {
      return [{ label: item.label }];
    }
  }

  // 3) Path under a nav item (prefix match) but no matching child
  for (const item of tenant.navItems) {
    const base = normalizePath(item.href);
    if (normalized === base || normalized.startsWith(`${base}/`)) {
      return [{ label: item.label }];
    }
  }

  // 4) No match
  const title = fallbackTitle ?? DEFAULT_FALLBACK_TITLE;
  return [{ label: title }];
}
