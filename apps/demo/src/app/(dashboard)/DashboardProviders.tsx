// SPDX-License-Identifier: MIT
// apps/demo — Client wrapper: QueryClientProvider + AppShell. Used by dashboard layout.

"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppShell } from "@novasphere/ui-shell";
import type { TenantConfig } from "@novasphere/tenant-core";
import ThemeSwitcher from "../../components/ThemeSwitcher";

export type DashboardProvidersProps = {
  tenant: TenantConfig;
  children: React.ReactNode;
  title?: string;
};

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
    },
  });
}

export default function DashboardProviders({
  tenant,
  children,
  title = "Dashboard",
}: DashboardProvidersProps): JSX.Element {
  const pathname = usePathname();
  const [queryClient] = React.useState(makeQueryClient);
  const currentPath = pathname ?? "/";

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell
        tenant={tenant}
        currentPath={currentPath}
        title={title}
        topbarRightSlot={<ThemeSwitcher />}
      >
        {children}
      </AppShell>
    </QueryClientProvider>
  );
}
