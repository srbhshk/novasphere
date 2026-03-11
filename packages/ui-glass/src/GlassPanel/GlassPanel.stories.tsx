// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — GlassPanel stories

import type { Meta, StoryObj } from "@storybook/react";
import GlassPanel from "./GlassPanel";

const meta: Meta<typeof GlassPanel> = {
  component: GlassPanel,
  title: "ui-glass/GlassPanel",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof GlassPanel>;

export const Default: Story = {
  args: {
    variant: "medium",
    children: "Panel body content",
  },
};

export const Subtle: Story = {
  args: {
    variant: "subtle",
    children: "Subtle panel content",
  },
};

export const Strong: Story = {
  args: {
    variant: "strong",
    children: "Strong panel content",
  },
};

export const WithHeaderAndFooter: Story = {
  args: {
    variant: "medium",
    header: <div style={{ padding: 12, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Header</div>,
    footer: <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>Footer</div>,
    children: "Panel body with header and footer slots",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <GlassPanel variant="subtle">Subtle</GlassPanel>
      <GlassPanel variant="medium">Medium</GlassPanel>
      <GlassPanel variant="strong">Strong</GlassPanel>
    </div>
  ),
};
