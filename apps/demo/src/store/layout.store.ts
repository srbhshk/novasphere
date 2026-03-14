// SPDX-License-Identifier: MIT
// apps/demo — Bento layout state. Used by dashboard and agent for Generative UI.

import { create } from "zustand";
import type { BentoLayoutConfig } from "@novasphere/ui-bento";
import { DEFAULT_LAYOUT } from "@/lib/generative-ui/layouts";

const INITIAL_LAYOUT: BentoLayoutConfig = DEFAULT_LAYOUT;

export type LayoutState = {
  layout: BentoLayoutConfig;
};

export type LayoutActions = {
  setLayout: (layout: BentoLayoutConfig) => void;
  resetLayout: () => void;
};

export type LayoutStore = LayoutState & LayoutActions;

export const useLayoutStore = create<LayoutStore>((set) => ({
  layout: INITIAL_LAYOUT,
  setLayout: (layout) => set({ layout }),
  resetLayout: () => set({ layout: DEFAULT_LAYOUT }),
}));
