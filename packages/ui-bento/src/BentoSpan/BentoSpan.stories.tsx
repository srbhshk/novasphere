// SPDX-License-Identifier: MIT
// @novasphere/ui-bento — BentoSpan stories

import type { Meta, StoryObj } from "@storybook/react";
import BentoSpan from "./BentoSpan";

const meta: Meta<typeof BentoSpan> = {
  component: BentoSpan,
  title: "ui-bento/BentoSpan",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof BentoSpan>;

export const Default: Story = {
  args: {
    children: "Span content (1×1)",
  },
};

export const WideSpan: Story = {
  args: {
    colSpan: 4,
    rowSpan: 1,
    children: "Wide span (colSpan 4)",
  },
};

export const TallSpan: Story = {
  args: {
    colSpan: 1,
    rowSpan: 2,
    children: "Tall span (rowSpan 2)",
  },
};

export const LargeCell: Story = {
  args: {
    colSpan: 4,
    rowSpan: 2,
    children: "Large cell (4×2)",
  },
};
