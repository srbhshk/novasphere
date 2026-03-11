// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — CopilotPanel tests

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { MockAdapter } from "@novasphere/agent-core";
import CopilotPanel from "./CopilotPanel";
import { mockAgentContext } from "../mocks/mock-context";
import { useAgentStore } from "../agent.store";

describe("CopilotPanel", () => {
  const adapter = new MockAdapter();
  const getContext = () => ({ ...mockAgentContext, userMessage: "" });

  beforeEach(() => {
    useAgentStore.setState({
      messages: [],
      status: "idle",
      adapterType: null,
      adapterModel: null,
      downloadProgress: 0,
      streamingContent: "",
    });
  });

  it("renders closed state as a button when initialOpen is false", () => {
    render(
      <CopilotPanel adapter={adapter} getContext={getContext} initialOpen={false} />
    );
    expect(screen.getByRole("button", { name: "Open copilot" })).toBeInTheDocument();
  });

  it("renders panel when initialOpen is true", async () => {
    render(
      <CopilotPanel adapter={adapter} getContext={getContext} initialOpen={true} />
    );
    expect(screen.getByRole("button", { name: "Close copilot" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ask Nova…")).toBeInTheDocument();
  });

  it("opens panel when trigger button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CopilotPanel adapter={adapter} getContext={getContext} initialOpen={false} />
    );
    await user.click(screen.getByRole("button", { name: "Open copilot" }));
    expect(screen.getByRole("button", { name: "Close copilot" })).toBeInTheDocument();
  });
});
