// SPDX-License-Identifier: MIT
// apps/demo — GET /api/tenant. Returns TenantConfig by id.

import { NextRequest, NextResponse } from "next/server";
import { resolveTenant, TenantNotFoundError } from "@novasphere/tenant-core";
import type { TenantConfig } from "@novasphere/tenant-core";

export type TenantResponse = {
  data: TenantConfig | null;
  error: { code: string; message: string } | null;
};

/**
 * GET /api/tenant?id=demo
 * Returns tenant config from registry. Query param: id (e.g. demo).
 */
export async function GET(request: NextRequest): Promise<NextResponse<TenantResponse>> {
  const id = request.nextUrl.searchParams.get("id");
  if (id == null || id.trim() === "") {
    return NextResponse.json(
      { data: null, error: { code: "MISSING_ID", message: "Query param id is required" } },
      { status: 400 }
    );
  }
  try {
    const tenant = resolveTenant(id.trim());
    return NextResponse.json({ data: tenant, error: null });
  } catch (err) {
    if (err instanceof TenantNotFoundError) {
      return NextResponse.json(
        { data: null, error: { code: "NOT_FOUND", message: err.message } },
        { status: 404 }
      );
    }
    throw err;
  }
}
