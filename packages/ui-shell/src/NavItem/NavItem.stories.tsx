// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — NavItem stories

import type { Meta, StoryObj } from "@storybook/react";
import NavItem from "./NavItem";

const meta: Meta<typeof NavItem> = {
  component: NavItem,
  title: "ui-shell/NavItem",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof NavItem>;

export const Default: Story = {
  args: {
    item: {
      id: "dashboard",
      label: "Dashboard",
      icon: "LayoutDashboard",
      href: "/demo/dashboard",
    },
  },
};

export const Collapsed: Story = {
  args: {
    item: {
      id: "dashboard",
      label: "Dashboard",
      icon: "LayoutDashboard",
      href: "/demo/dashboard",
    },
    isCollapsed: true,
  },
};

export const Active: Story = {
  args: {
    item: {
      id: "dashboard",
      label: "Dashboard",
      icon: "LayoutDashboard",
      href: "/demo/dashboard",
      active: true,
    },
  },
};
