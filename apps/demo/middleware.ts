// SPDX-License-Identifier: MIT
// apps/demo — middleware
// Sets x-tenant-id from path; redirects / to /demo for dashboard.

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEFAULT_TENANT = "demo";

export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/" || pathname === "") {
    return NextResponse.redirect(new URL(`/${DEFAULT_TENANT}/dashboard`, request.url));
  }
  const segments = pathname.split("/").filter(Boolean);
  const tenantId = segments[0] ?? DEFAULT_TENANT;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", tenantId);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
