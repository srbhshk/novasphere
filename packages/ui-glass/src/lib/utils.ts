// SPDX-License-Identifier: MIT
// @novasphere/ui-glass — cn utility for shadcn/ui components

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
