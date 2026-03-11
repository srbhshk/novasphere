// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — TypingIndicator stories

import type { Meta, StoryObj } from "@storybook/react";
import TypingIndicator from "./TypingIndicator";

const meta: Meta<typeof TypingIndicator> = {
  component: TypingIndicator,
  title: "ui-agent/TypingIndicator",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof TypingIndicator>;

export const Default: Story = {
  args: {},
};

export const WithCustomLabel: Story = {
  args: {
    "aria-label": "Thinking…",
  },
};
