// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — SuggestionChips stories

import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect, fn } from "@storybook/test";
import type { SuggestionChip } from "@novasphere/agent-core";
import SuggestionChips from "./SuggestionChips";

const meta: Meta<typeof SuggestionChips> = {
  component: SuggestionChips,
  title: "ui-agent/SuggestionChips",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof SuggestionChips>;

const chips: SuggestionChip[] = [
  { id: "1", label: "Reorder dashboard", action: "layout_restructure" },
  { id: "2", label: "Explain metrics", action: "metric_explain" },
  { id: "3", label: "Summarise anomalies", action: "anomaly_summarise" },
];

export const Default: Story = {
  args: {
    chips,
    onSelect: fn(),
  },
};

export const ChipClickInteraction: Story = {
  args: {
    chips,
    onSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const firstChip = canvas.getByRole("button", { name: /reorder dashboard/i });
    await userEvent.click(firstChip);
    await expect(args.onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", action: "layout_restructure" })
    );
  },
};
