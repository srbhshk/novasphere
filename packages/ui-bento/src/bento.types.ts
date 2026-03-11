// SPDX-License-Identifier: MIT
// @novasphere/ui-bento — Bento layout and card configuration types.

/** Valid column span values for the 12-column grid. */
export type BentoColSpan = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12;

/** Valid row span values for the grid. */
export type BentoRowSpan = 1 | 2 | 3;

/** Default colSpan when not specified. */
export const BENTO_DEFAULT_COL_SPAN = 4 as const;

/** Default rowSpan when not specified. */
export const BENTO_DEFAULT_ROW_SPAN = 1 as const;

/**
 * Configuration for a single Bento card. Used as React key and drag ID; agent
 * can hide via visible and reorder via order.
 */
export type BentoCardConfig = {
  /** Unique, stable id — used as React key and drag ID. */
  id: string;
  /** Column span in the 12-column grid. Default: 4. */
  colSpan: BentoColSpan;
  /** Row span. Default: 1. */
  rowSpan: BentoRowSpan;
  /** Which module component to render (key in BentoGrid modules map). */
  moduleId: string;
  /** Optional card title. */
  title?: string;
  /** Agent can set to false to hide the card. */
  visible: boolean;
  /** Sort order; agent changes this to reorder. */
  order: number;
};

/** Full layout: array of card configs. */
export type BentoLayoutConfig = BentoCardConfig[];

/** Props passed to each module component rendered inside a Bento card. */
export type BentoCardModuleProps = {
  config: BentoCardConfig;
};
