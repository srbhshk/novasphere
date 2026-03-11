// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — agent store tests

import { describe, it, expect, beforeEach } from "vitest";
import { useAgentStore } from "./agent.store";

describe("useAgentStore", () => {
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

  it("addMessage appends a message", () => {
    useAgentStore.getState().addMessage({
      id: "1",
      role: "user",
      content: "Hi",
      timestamp: Date.now(),
    });
    expect(useAgentStore.getState().messages).toHaveLength(1);
    expect(useAgentStore.getState().messages[0]?.content).toBe("Hi");
  });

  it("setStatus updates status", () => {
    useAgentStore.getState().setStatus("thinking");
    expect(useAgentStore.getState().status).toBe("thinking");
  });

  it("setAdapter updates adapter type and model", () => {
    useAgentStore.getState().setAdapter("ollama", "qwen2.5:0.5b");
    expect(useAgentStore.getState().adapterType).toBe("ollama");
    expect(useAgentStore.getState().adapterModel).toBe("qwen2.5:0.5b");
  });

  it("appendStreamToken appends to streamingContent", () => {
    useAgentStore.getState().appendStreamToken("Hello ");
    useAgentStore.getState().appendStreamToken("world");
    expect(useAgentStore.getState().streamingContent).toBe("Hello world");
  });

  it("finaliseStream moves streaming content into a new message", () => {
    useAgentStore.getState().addMessage({
      id: "u1",
      role: "user",
      content: "Hi",
      timestamp: Date.now(),
    });
    useAgentStore.getState().appendStreamToken("Reply");
    useAgentStore.getState().finaliseStream();
    expect(useAgentStore.getState().streamingContent).toBe("");
    expect(useAgentStore.getState().messages).toHaveLength(2);
    expect(useAgentStore.getState().messages[1]?.role).toBe("assistant");
    expect(useAgentStore.getState().messages[1]?.content).toBe("Reply");
  });
});
