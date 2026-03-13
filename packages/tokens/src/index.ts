// SPDX-License-Identifier: MIT
// @novasphere/tokens — package entry
// Re-exports token constants as typed TS values.

export { novaspherePreset } from "./tailwind.preset";

/** Design token values as typed constants. Same values as CSS custom properties. */
export const tokens = {
  color: {
    bg: "#020617",
    surface: "#020617",
    accent: "#f59e0b",
    accent2: "#ec4899",
    accent3: "#34d399",
    text: "#e8ecf4",
    muted: "#6b7897",
    danger: "#f97316",
    border: "rgba(255, 255, 255, 0.1)",
    borderHi: "rgba(255, 255, 255, 0.18)",
  },
  glass: {
    bgSubtle: "rgba(255, 255, 255, 0.03)",
    bgMedium: "rgba(255, 255, 255, 0.03)",
    bgStrong: "rgba(255, 255, 255, 0.06)",
    blurSm: "16px",
    blurMd: "28px",
    blurLg: "40px",
    saturate: 2,
    contrast: 1.1,
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
    accent: "rgba(245, 158, 11, 0.35)",
    accent2: "rgba(236, 72, 153, 0.3)",
  },
  noise: {
    opacity: 0.05,
  },
} as const;

export type Tokens = typeof tokens;
