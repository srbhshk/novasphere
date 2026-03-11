// SPDX-License-Identifier: MIT
// @novasphere/tokens — package entry
// Re-exports token constants as typed TS values.

export { novaspherePreset } from "./tailwind.preset";

/** Design token values as typed constants. Same values as CSS custom properties. */
export const tokens = {
  color: {
    bg: "#06080f",
    surface: "#0c1120",
    accent: "#4f8ef7",
    accent2: "#a78bfa",
    accent3: "#34d399",
    text: "#e8ecf4",
    muted: "#6b7897",
    danger: "#f97316",
    border: "rgba(255, 255, 255, 0.1)",
    borderHi: "rgba(255, 255, 255, 0.18)",
  },
  glass: {
    bgSubtle: "rgba(255, 255, 255, 0.03)",
    bgMedium: "rgba(255, 255, 255, 0.05)",
    bgStrong: "rgba(255, 255, 255, 0.07)",
    blurSm: "12px",
    blurMd: "20px",
    blurLg: "32px",
  },
  radius: {
    sm: "10px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  motion: {
    easeSpring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    easeSmooth: "cubic-bezier(0.4, 0, 0.2, 1)",
    durationFast: "150ms",
    durationBase: "300ms",
    durationSlow: "600ms",
  },
  glow: {
    accent: "rgba(79, 142, 247, 0.35)",
    accent2: "rgba(167, 139, 250, 0.25)",
  },
} as const;

export type Tokens = typeof tokens;
