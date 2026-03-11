// SPDX-License-Identifier: MIT
// @novasphere/tenant-core — package entry
// Multi-tenancy: TenantConfig types, tenant registry, and resolver utilities.

export type { TenantConfig, TenantNavItem } from "./tenant.types";
export { TENANT_REGISTRY } from "./tenant.registry";
export { resolveTenant, TenantNotFoundError } from "./tenant.resolver";
