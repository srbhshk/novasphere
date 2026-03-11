// SPDX-License-Identifier: MIT
// @novasphere/tenant-core — tenant.types
// Tenant and navigation item type definitions.

export type TenantNavItem = {
  id: string;
  label: string;
  /** Lucide icon name as string (e.g. "LayoutDashboard"). */
  icon: string;
  href: string;
  active?: boolean;
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
