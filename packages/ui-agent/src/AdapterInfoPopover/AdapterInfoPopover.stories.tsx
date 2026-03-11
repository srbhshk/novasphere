// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — AdapterInfoPopover stories

import type { Meta, StoryObj } from "@storybook/react";
import AdapterInfoPopover from "./AdapterInfoPopover";

const meta: Meta<typeof AdapterInfoPopover> = {
  component: AdapterInfoPopover,
  title: "ui-agent/AdapterInfoPopover",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof AdapterInfoPopover>;

export const Mock: Story = {
  args: {
    adapterType: "mock",
    modelName: "mock-v1",
  },
};

export const Ollama: Story = {
  args: {
    adapterType: "ollama",
    modelName: "qwen2.5:0.5b",
  },
};
