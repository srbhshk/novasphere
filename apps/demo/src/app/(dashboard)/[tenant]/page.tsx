// SPDX-License-Identifier: MIT
// apps/demo — Tenant root: redirects to /[tenant]/dashboard so /demo → /demo/dashboard.

import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ tenant: string }> };

/**
 * Redirects /[tenant] to /[tenant]/dashboard so the dashboard is the canonical route.
 */
export default async function TenantRootPage({ params }: PageProps): Promise<never> {
  const { tenant } = await params;
  redirect(`/${tenant}/dashboard`);
}
