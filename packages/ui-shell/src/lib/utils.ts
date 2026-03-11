// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — cn utility for class names

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
