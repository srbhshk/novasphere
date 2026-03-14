// SPDX-License-Identifier: MIT
// @novasphere/tokens — package entry
// Re-exports token constants as typed TS values.

export { novaspherePreset } from "./tailwind.preset";

/** Design token values as typed constants. Same values as CSS custom properties. */
/* intentional: token value constants — single source of truth for TS, mirrors tokens.css */
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
  shadow: {
    card: "0 4px 24px rgba(0, 0, 0, 0.25)",
    cardHover: "0 8px 32px rgba(0, 0, 0, 0.35)",
    sidebar: "1px 0 0 rgba(255, 255, 255, 0.06)",
    sidebarExpanded:
      "16px 0 32px rgba(0, 0, 0, 0.35), 8px 0 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.06) inset",
    topbar: "0 1px 0 rgba(255, 255, 255, 0.06)",
    panel: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    elevated: "0 12px 40px rgba(0, 0, 0, 0.35)",
    inset: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  },
  glassHighlight: {
    highlight: "rgba(255, 255, 255, 0.08)",
    sheen:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
  },
  ambient: {
    bg: "#020617",
    orb1: "rgba(79, 142, 247, 0.15)",
    orb2: "rgba(167, 139, 250, 0.12)",
    orb3: "rgba(52, 211, 153, 0.08)",
  },
  accentOpacity: {
    accent10: "rgba(79, 142, 247, 0.10)",
    accent20: "rgba(79, 142, 247, 0.20)",
    accent220: "rgba(167, 139, 250, 0.20)",
    danger20: "rgba(249, 115, 22, 0.20)",
  },
  noise: {
    opacity: 0.05,
  },
} as const;

export type Tokens = typeof tokens;
