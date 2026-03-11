// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — Topbar stories

import type { Meta, StoryObj } from "@storybook/react";
import type { TenantConfig } from "@novasphere/tenant-core";
import { TENANT_REGISTRY } from "@novasphere/tenant-core";
import Topbar from "./Topbar";

const demoTenant: TenantConfig = TENANT_REGISTRY.demo as TenantConfig;

const meta: Meta<typeof Topbar> = {
  component: Topbar,
  title: "ui-shell/Topbar",
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof Topbar>;

export const Default: Story = {
  args: {
    tenant: demoTenant,
    title: "Dashboard",
  },
};
