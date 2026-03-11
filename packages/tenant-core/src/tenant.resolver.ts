// SPDX-License-Identifier: MIT
// @novasphere/tenant-core — tenant.resolver
// Resolves tenant by id from registry. Throws if not found.

import type { TenantConfig } from "./tenant.types";
import { TENANT_REGISTRY } from "./tenant.registry";

export class TenantNotFoundError extends Error {
  constructor(public readonly tenantId: string) {
    super(`Tenant not found: ${tenantId}`);
    this.name = "TenantNotFoundError";
    Object.setPrototypeOf(this, TenantNotFoundError.prototype);
  }
}

/**
 * Returns tenant config for the given id from the registry.
 * @param id - Tenant id (e.g. "demo")
 * @returns TenantConfig
 * @throws TenantNotFoundError when id is not in the registry
 */
export function resolveTenant(id: string): TenantConfig {
  const config = TENANT_REGISTRY[id];
  if (config == null) {
    throw new TenantNotFoundError(id);
  }
  return config;
}
