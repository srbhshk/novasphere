// SPDX-License-Identifier: MIT
// @novasphere/tenant-core — tenant.types
// Tenant and navigation item type definitions.

/** Child nav item for second-level breadcrumb (e.g. Settings > API Keys). */
export type TenantNavItemChild = {
  id: string;
  label: string;
  href: string;
};

export type TenantNavItem = {
  id: string;
  label: string;
  /** Lucide icon name as string (e.g. "LayoutDashboard"). */
  icon: string;
  href: string;
  /** Optional second-level items; breadcrumbs show at most 2 levels. */
  children?: TenantNavItemChild[];
  active?: boolean;
};

/** Single breadcrumb segment; compatible with ui-shell BreadcrumbItem. */
export type BreadcrumbSegment = {
  label: string;
  href?: string;
};

export type TenantConfig = {
  id: string;
  name: string;
  logoUrl?: string;
  /** Overrides --ns-color-accent when set. */
  accentColor?: string;
  features: {
    bentoReorder: boolean;
    generativeLayout: boolean;
    multiTenant: boolean;
    authEnabled: boolean;
  };
  navItems: TenantNavItem[];
};
