// SPDX-License-Identifier: MIT
// apps/demo — Bento module: scrollable activity feed with icon, description, timestamp, status.

"use client";

import {
  Zap,
  AlertTriangle,
  UserPlus,
  Loader2,
  Activity,
} from "lucide-react";
import type { BentoCardModuleProps } from "@novasphere/ui-bento";
import { MOCK_ACTIVITY } from "@/mocks/activity.mock";
import type { ActivityItem } from "@/mocks/activity.mock";

const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  deploy: Zap,
  alert: AlertTriangle,
  user: UserPlus,
  model: Loader2,
  api: Activity,
};

function statusClass(status: ActivityItem["status"]): string {
  switch (status) {
    case "success":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "warning":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "info":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "pending":
      return "bg-ns-muted/30 text-ns-muted border-ns-border";
    default:
      return "bg-ns-muted/20 text-ns-muted border-ns-border";
  }
}

export default function ActivityFeedModule({
  config,
}: BentoCardModuleProps): JSX.Element {
  const title = config.title ?? "Activity";
  return (
    <div className="flex h-full flex-col overflow-hidden p-4">
      <h3 className="text-sm font-semibold text-ns-text mb-3">{title}</h3>
      <ul className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1" role="list">
        {MOCK_ACTIVITY.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? Activity;
          return (
            <li
              key={item.id}
              className="flex gap-3 rounded-lg border border-ns-border/50 bg-ns-surface/30 p-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ns-muted/20 text-ns-muted">
                <Icon className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ns-text">{item.description}</p>
                <p className="mt-0.5 text-xs text-ns-muted">{item.timestamp}</p>
              </div>
              <span
                className={`shrink-0 self-center rounded border px-2 py-0.5 text-xs font-medium ${statusClass(item.status)}`}
              >
                {item.status}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
