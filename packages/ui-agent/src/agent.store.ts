// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — agent.store
// Local Zustand store for Copilot conversation, adapter status, and streaming state.

import { create } from "zustand";
import type { AgentMessage, AgentStatus, AdapterType } from "@novasphere/agent-core";

export type AgentStoreState = {
  messages: AgentMessage[];
  status: AgentStatus;
  adapterType: AdapterType | null;
  adapterModel: string | null;
  downloadProgress: number;
  streamingContent: string;
};

export type AgentStoreActions = {
  addMessage: (message: AgentMessage) => void;
  setStatus: (status: AgentStatus) => void;
  setAdapter: (type: AdapterType, model: string) => void;
  setDownloadProgress: (progress: number) => void;
  appendStreamToken: (token: string) => void;
  finaliseStream: () => void;
};

const initialState: AgentStoreState = {
  messages: [],
  status: "idle",
  adapterType: null,
  adapterModel: null,
  downloadProgress: 0,
  streamingContent: "",
};

export const useAgentStore = create<AgentStoreState & AgentStoreActions>((set) => ({
  ...initialState,

  addMessage(message) {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setStatus(status) {
    set({ status });
  },

  setAdapter(type, model) {
    set({ adapterType: type, adapterModel: model });
  },

  setDownloadProgress(progress) {
    set({ downloadProgress: Math.min(100, Math.max(0, progress)) });
  },

  appendStreamToken(token) {
    set((state) => ({
      streamingContent: state.streamingContent + token,
    }));
  },

  finaliseStream() {
    set((state) => {
      const content = state.streamingContent;
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (content.length === 0) {
        return { streamingContent: "" };
      }
      const newMessage: AgentMessage = {
        id: last?.role === "assistant" ? last.id : `msg-${Date.now()}`,
        role: "assistant",
        content: (last?.role === "assistant" ? last.content : "") + content,
        timestamp: Date.now(),
      };
      const next =
        last?.role === "assistant"
          ? messages.slice(0, -1).concat(newMessage)
          : messages.concat(newMessage);
      return { messages: next, streamingContent: "" };
    });
  },
}));
