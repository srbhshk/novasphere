// SPDX-License-Identifier: MIT
// apps/demo — Theme store: manages active visual theme and persistence.

import { create } from "zustand";

export type ThemeId = "spectral-edge" | "silicon-frost" | "subnet-deep";

export type ThemeState = {
  themeId: ThemeId;
};

export type ThemeActions = {
  setTheme: (themeId: ThemeId) => void;
};

export type ThemeStore = ThemeState & ThemeActions;

const THEME_STORAGE_KEY = "novasphere.theme";

const getInitialTheme = (): ThemeId => {
  // To avoid React hydration mismatches between server and client,
  // we always start from the same theme on first render and hydrate
  // persisted preferences later on the client.
  return "spectral-edge";
};

export const useThemeStore = create<ThemeStore>((set) => ({
  themeId: getInitialTheme(),
  setTheme: (themeId) => {
    set({ themeId });
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(THEME_STORAGE_KEY, themeId);
      }
    } catch {
      // ignore
    }
  },
}));

