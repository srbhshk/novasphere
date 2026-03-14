// SPDX-License-Identifier: MIT
// apps/demo — ThemeSwitcher: topbar control to switch between Silicon Frost, Subnet Deep, and Spectral Edge.

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { SunMedium, MoonStar, Sparkles } from "lucide-react";
import { useThemeStore, type ThemeId } from "../store/theme.store";

type ThemeOption = {
  id: ThemeId;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const THEME_OPTIONS = [
  {
    id: "spectral-edge",
    label: "Spectral Edge",
    description: "Liquid metal · Brand",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
  {
    id: "silicon-frost",
    label: "Silicon Frost",
    description: "Light · Clean Room",
    icon: <SunMedium className="h-3.5 w-3.5" />,
  },
  {
    id: "subnet-deep",
    label: "Subnet Deep",
    description: "Dark · Pro Mode",
    icon: <MoonStar className="h-3.5 w-3.5" />,
  },
 ] as const satisfies ReadonlyArray<ThemeOption>;

const getActiveTheme = (themeId: ThemeId): ThemeOption => {
  const found = THEME_OPTIONS.find((t) => t.id === themeId);
  if (found !== undefined) {
    return found;
  }

  // Fallback to Spectral Edge when themeId is unknown.
  const spectralEdge = THEME_OPTIONS.find((t) => t.id === "spectral-edge");
  if (spectralEdge !== undefined) {
    return spectralEdge;
  }

  // As a last resort, return the first defined option.
  for (const option of THEME_OPTIONS) {
    if (option !== undefined) {
      return option;
    }
  }

  // This should be unreachable given the static definition above.
  return {
    id: "spectral-edge",
    label: "Spectral Edge",
    description: "Liquid metal · Brand",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  };
};

export default function ThemeSwitcher(): React.ReactElement {
  const themeId = useThemeStore((state) => state.themeId);
  const setTheme = useThemeStore((state) => state.setTheme);
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState<{
    top: number;
    right: number;
  } | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const active = getActiveTheme(themeId);

  const updatePosition = React.useCallback((): void => {
    if (typeof window === "undefined") {
      return;
    }
    const button = buttonRef.current;
    if (!button) {
      return;
    }
    const rect = button.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  }, []);

  React.useLayoutEffect(() => {
    if (!open) {
      return undefined;
    }

    updatePosition();

    const handleResize = (): void => {
      updatePosition();
    };

    const handleScroll = (): void => {
      updatePosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, updatePosition]);

  const handleSelect = (id: ThemeId) => {
    setTheme(id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-ns-border bg-ns-surface/70 px-3 py-1.5 text-xs font-medium text-ns-text shadow-sm hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ns-border-hi"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Switch visual theme"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ns-accent-2/15 text-ns-accent-2">
          {active.icon}
        </span>
        <span>{active.label}</span>
      </button>
      {open && position != null
        ? createPortal(
            <div
              className="fixed z-40 w-56 rounded-xl border border-ns-border bg-ns-surface/95 p-2 text-xs text-ns-text shadow-xl"
              style={{ top: position.top, right: position.right }}
              role="menu"
              aria-label="Select theme"
            >
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ns-border-hi"
                  role="menuitemradio"
                  aria-checked={themeId === option.id}
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-ns-accent-2/10 text-ns-accent-2">
                    {option.icon}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-[11px] text-ns-muted">
                      {option.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

