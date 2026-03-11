// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — CopilotPanel Storybook stories

import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect, fn } from "@storybook/test";
import { MockAdapter } from "@novasphere/agent-core";
import CopilotPanel from "./CopilotPanel";
import { mockAgentContext } from "../mocks/mock-context";
import { useAgentStore } from "../agent.store";

const meta: Meta<typeof CopilotPanel> = {
  component: CopilotPanel,
  title: "ui-agent/CopilotPanel",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 520, width: 380 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CopilotPanel>;

const mockAdapter = new MockAdapter();
const getContext = () => ({ ...mockAgentContext, userMessage: "" });

export const Default: Story = {
  args: {
    adapter: mockAdapter,
    getContext,
    initialOpen: true,
    agentName: "Nova",
    avatarEmoji: "🤖",
  },
};

export const Closed: Story = {
  args: {
    adapter: mockAdapter,
    getContext,
    initialOpen: false,
  },
};

export const Downloading: Story = {
  args: {
    adapter: mockAdapter,
    getContext,
    initialOpen: true,
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        useAgentStore.getState().setStatus("downloading");
        useAgentStore.getState().setAdapter("webllm", "Phi-3-mini");
        useAgentStore.getState().setDownloadProgress(45);
        return () => {
          useAgentStore.getState().setStatus("idle");
          useAgentStore.getState().setDownloadProgress(0);
        };
      }, []);
      return <Story />;
    },
  ],
};

export const Streaming: Story = {
  args: {
    adapter: mockAdapter,
    getContext,
    initialOpen: true,
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        useAgentStore.getState().setStatus("streaming");
        useAgentStore.getState().setAdapter("ollama", "qwen2.5:0.5b");
        useAgentStore.getState().addMessage({
          id: "u1",
          role: "user",
          content: "Reorder my dashboard",
          timestamp: Date.now(),
        });
        useAgentStore.getState().appendStreamToken("Here is your ");
        return () => {
          useAgentStore.getState().setStatus("idle");
          useAgentStore.getState().finaliseStream();
        };
      }, []);
      return <Story />;
    },
  ],
};

export const WithSuggestions: Story = {
  args: {
    adapter: mockAdapter,
    getContext,
    initialOpen: true,
  },
  decorators: [
    (Story) => {
      useEffect(() => {
        useAgentStore.getState().setAdapter("mock", "mock-v1");
        useAgentStore.getState().addMessage({
          id: "u1",
          role: "user",
          content: "What can you do?",
          timestamp: Date.now(),
        });
        useAgentStore.getState().addMessage({
          id: "a1",
          role: "assistant",
          content: "I can help reorder the dashboard or explain metrics.",
          timestamp: Date.now(),
        });
        return () => {
          useAgentStore.setState({
            messages: [],
            status: "idle",
            adapterType: null,
            adapterModel: null,
            downloadProgress: 0,
            streamingContent: "",
          });
        };
      }, []);
      return <Story />;
    },
  ],
};

export const WithLayoutChangeCallback: Story = {
  args: {
    adapter: mockAdapter,
    getContext,
    initialOpen: true,
    onLayoutChange: fn(),
  },
};

export const SendMessageInteraction: Story = {
  args: {
    adapter: mockAdapter,
    getContext,
    initialOpen: true,
    agentName: "Nova",
    avatarEmoji: "🤖",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: /message input/i });
    await userEvent.type(input, "Hello");
    const sendButton = canvas.getByRole("button", { name: /send message/i });
    await userEvent.click(sendButton);
    await expect(canvas.getByText("Hello")).toBeInTheDocument();
  },
};
