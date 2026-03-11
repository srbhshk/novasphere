// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — AgentMessage tests

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AgentMessage from "./AgentMessage";

const userMessage = {
  id: "1",
  role: "user" as const,
  content: "Hello",
  timestamp: Date.now(),
};

const assistantMessage = {
  id: "2",
  role: "assistant" as const,
  content: "Hi there!",
  timestamp: Date.now(),
};

describe("AgentMessage", () => {
  it("renders user message content", () => {
    render(<AgentMessage message={userMessage} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders assistant message content", () => {
    render(<AgentMessage message={assistantMessage} />);
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  it("renders timestamp in HH:MM format", () => {
    const d = new Date();
    const msg = { ...userMessage, timestamp: d.getTime() };
    render(<AgentMessage message={msg} />);
    const expected = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("renders streaming content when provided", () => {
    render(
      <AgentMessage
        message={{ ...assistantMessage, content: "" }}
        isStreaming
        streamingContent="Partial response "
      />
    );
    expect(screen.getByText(/Partial response/)).toBeInTheDocument();
  });
});
