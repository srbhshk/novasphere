// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — Sidebar stories

import type { Meta, StoryObj } from "@storybook/react";
import type { TenantConfig } from "@novasphere/tenant-core";
import { TENANT_REGISTRY } from "@novasphere/tenant-core";
import Sidebar from "./Sidebar";

const demoTenant: TenantConfig = TENANT_REGISTRY.demo as TenantConfig;

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  title: "ui-shell/Sidebar",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    tenant: demoTenant,
    currentPath: "/demo/dashboard",
    expanded: false,
    onExpandToggle: () => {},
  },
};

export const Expanded: Story = {
  args: {
    tenant: demoTenant,
    currentPath: "/demo/dashboard",
    expanded: true,
    onExpandToggle: () => {},
  },
};
