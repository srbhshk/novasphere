// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — BreadcrumbBar stories

import type { Meta, StoryObj } from "@storybook/react";
import BreadcrumbBar from "./BreadcrumbBar";

const meta: Meta<typeof BreadcrumbBar> = {
  component: BreadcrumbBar,
  title: "ui-shell/BreadcrumbBar",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof BreadcrumbBar>;

export const Default: Story = {
  args: {
    items: [{ label: "Dashboard" }],
  },
};

export const WithLinks: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Demo", href: "/demo" },
      { label: "Dashboard" },
    ],
  },
};
