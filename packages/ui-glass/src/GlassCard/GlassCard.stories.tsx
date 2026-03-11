// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — GlassCard stories

import type { Meta, StoryObj } from "@storybook/react";
import GlassCard from "./GlassCard";

const meta: Meta<typeof GlassCard> = {
  component: GlassCard,
  title: "ui-glass/GlassCard",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof GlassCard>;

export const Default: Story = {
  args: {
    variant: "medium",
    children: "Default medium variant content",
  },
};

export const Subtle: Story = {
  args: {
    variant: "subtle",
    children: "Subtle variant — lighter glass",
  },
};

export const Strong: Story = {
  args: {
    variant: "strong",
    children: "Strong variant — more opaque glass",
  },
};

export const WithHighlight: Story = {
  args: {
    variant: "medium",
    highlight: true,
    children: "Card with diagonal top-left sheen",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      <GlassCard variant="subtle">Subtle</GlassCard>
      <GlassCard variant="medium">Medium</GlassCard>
      <GlassCard variant="strong">Strong</GlassCard>
    </div>
  ),
};
