// SPDX-License-Identifier: MIT
// apps/demo — ThemeProvider: applies data-theme attribute on <html> based on store.

"use client";

import * as React from "react";
import { useThemeStore } from "../store/theme.store";

export type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function ThemeProvider({
  children,
}: ThemeProviderProps): React.ReactElement {
  const themeId = useThemeStore((state) => state.themeId);
  const setTheme = useThemeStore((state) => state.setTheme);

  React.useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    try {
      const stored = window.localStorage.getItem("novasphere.theme");
      if (
        stored === "spectral-edge" ||
        stored === "silicon-frost" ||
        stored === "subnet-deep"
      ) {
        if (stored !== themeId) {
          setTheme(stored);
          return;
        }
      }
    } catch {
      // ignore storage errors
    }

    const root = document.documentElement;
    root.dataset.theme = themeId;
  }, [themeId, setTheme]);

  return <>{children}</>;
}

