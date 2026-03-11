// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — AgentMessage stories

import type { Meta, StoryObj } from "@storybook/react";
import type { AgentMessage as AgentMessageType } from "@novasphere/agent-core";
import AgentMessage from "./AgentMessage";

const meta: Meta<typeof AgentMessage> = {
  component: AgentMessage,
  title: "ui-agent/AgentMessage",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof AgentMessage>;

const userMessage: AgentMessageType = {
  id: "1",
  role: "user",
  content: "Can you reorder my dashboard?",
  timestamp: Date.now() - 60000,
};

const assistantMessage: AgentMessageType = {
  id: "2",
  role: "assistant",
  content: "Here’s an updated layout that puts metrics first.",
  timestamp: Date.now(),
};

export const UserMessage: Story = {
  args: {
    message: userMessage,
  },
};

export const AssistantMessage: Story = {
  args: {
    message: assistantMessage,
  },
};

export const Streaming: Story = {
  args: {
    message: { ...assistantMessage, content: "" },
    isStreaming: true,
    streamingContent: "Here’s an updated layout that puts ",
  },
};
