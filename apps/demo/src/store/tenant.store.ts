// SPDX-License-Identifier: MIT
// apps/demo — Current tenant config. Default: demo.

import { create } from "zustand";
import { resolveTenant } from "@novasphere/tenant-core";
import type { TenantConfig } from "@novasphere/tenant-core";

const defaultTenantId = "demo";
let defaultTenant: TenantConfig;
try {
  defaultTenant = resolveTenant(defaultTenantId);
} catch {
  defaultTenant = {
    id: defaultTenantId,
    name: "Demo",
    features: { bentoReorder: true, generativeLayout: true, multiTenant: false, authEnabled: false },
    navItems: [],
  };
}

export type TenantState = {
  tenant: TenantConfig;
};

export type TenantActions = {
  setTenant: (tenant: TenantConfig) => void;
};

export type TenantStore = TenantState & TenantActions;

export const useTenantStore = create<TenantStore>((set) => ({
  tenant: defaultTenant,
  setTenant: (tenant) => set({ tenant }),
}));
