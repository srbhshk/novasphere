// SPDX-License-Identifier: MIT
// @novasphere/ui-shell — NavItem icon name to Lucide component map

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BarChart3,
  GitBranch,
  Bot,
  Settings,
  Circle,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  GitBranch,
  Bot,
  Settings,
};

export function getNavIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? Circle;
}
