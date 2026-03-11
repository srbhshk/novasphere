// SPDX-License-Identifier: MIT
// apps/demo — Bento layout state. Used by dashboard and agent for Generative UI.

import { create } from "zustand";
import type { BentoLayoutConfig } from "@novasphere/ui-bento";

const INITIAL_LAYOUT: BentoLayoutConfig = [
  { id: "revenue-metric", colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 0 },
  { id: "users-metric", colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 1 },
  { id: "ai-calls-metric", colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 2 },
  { id: "churn-metric", colSpan: 3, rowSpan: 1, moduleId: "MetricCard", visible: true, order: 3 },
  { id: "activity-feed", colSpan: 4, rowSpan: 2, moduleId: "ActivityFeed", visible: true, order: 4 },
  { id: "area-chart", colSpan: 8, rowSpan: 1, moduleId: "AreaChartModule", visible: true, order: 5 },
];

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
  resetLayout: () => set({ layout: INITIAL_LAYOUT }),
}));
