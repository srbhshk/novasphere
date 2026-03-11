// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — AdapterStatusBadge stories

import type { Meta, StoryObj } from "@storybook/react";
import AdapterStatusBadge from "./AdapterStatusBadge";

const meta: Meta<typeof AdapterStatusBadge> = {
  component: AdapterStatusBadge,
  title: "ui-agent/AdapterStatusBadge",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof AdapterStatusBadge>;

export const Checking: Story = {
  args: {
    adapterType: null,
    status: "checking",
    modelName: null,
  },
};

export const Ollama: Story = {
  args: {
    adapterType: "ollama",
    status: "idle",
    modelName: "qwen2.5:0.5b",
  },
};

export const WebLLM: Story = {
  args: {
    adapterType: "webllm",
    status: "idle",
    modelName: "Phi-3-mini",
  },
};

export const Downloading: Story = {
  args: {
    adapterType: "webllm",
    status: "downloading",
    modelName: null,
    downloadProgress: 45,
  },
};

export const Mock: Story = {
  args: {
    adapterType: "mock",
    status: "idle",
    modelName: "mock-v1",
  },
};

export const WithInfoClick: Story = {
  args: {
    adapterType: "ollama",
    status: "idle",
    modelName: "qwen2.5:0.5b",
    onInfoClick: () => alert("Info clicked"),
  },
};
