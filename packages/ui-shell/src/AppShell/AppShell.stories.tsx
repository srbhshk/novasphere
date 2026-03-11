// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — AppShell stories

import type { Meta, StoryObj } from "@storybook/react";
import type { TenantConfig } from "@novasphere/tenant-core";
import { TENANT_REGISTRY } from "@novasphere/tenant-core";
import AppShell from "./AppShell";

const demoTenant: TenantConfig = TENANT_REGISTRY.demo as TenantConfig;

const meta: Meta<typeof AppShell> = {
  component: AppShell,
  title: "ui-shell/AppShell",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#06080f" }] },
  },
};

export default meta;

type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  args: {
    tenant: demoTenant,
    currentPath: "/demo/dashboard",
    title: "Dashboard",
    children: (
      <div style={{ padding: "1.5rem" }}>
        <p>Main content area. Sidebar (72px) + main column with ambient background and grain.</p>
      </div>
    ),
  },
};
