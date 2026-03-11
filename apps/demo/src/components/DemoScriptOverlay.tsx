// SPDX-License-Identifier: MIT
// apps/demo — DemoScriptOverlay: guided demo script overlay for live presentations.

"use client";

import * as React from "react";
import { GlassPanel } from "@novasphere/ui-glass";

type DemoScriptStep = {
  step: number;
  scenarioName: string;
  audienceLine: string;
  autoTrigger: string | null;
  waitMs: number;
};

const DEMO_SCRIPT: DemoScriptStep[] = [
  {
    step: 1,
    scenarioName: "Default State",
    audienceLine:
      "This is novasphere — an AI-native SaaS dashboard.\nNotice the live metrics, activity feed, and charts.",
    autoTrigger: null,
    waitMs: 5000,
  },
  {
    step: 2,
    scenarioName: "Time Context",
    audienceLine:
      "The dashboard already knows what time it is.\nIt loaded the right view automatically.",
    autoTrigger: null,
    waitMs: 0,
  },
  {
    step: 3,
    scenarioName: "Natural Language",
    audienceLine: "Watch what happens when I just... talk to it.",
    autoTrigger: "Show me the CEO view",
    waitMs: 3000,
  },
  {
    step: 4,
    scenarioName: "Role Switching",
    audienceLine:
      "Now switch to engineer view — same data,\ncompletely different priorities surfaced.",
    autoTrigger: "Switch to engineer view",
    waitMs: 3000,
  },
  {
    step: 5,
    scenarioName: "Drill Down",
    audienceLine: "I want more detail on the trend.",
    autoTrigger: "Expand the chart",
    waitMs: 3000,
  },
  {
    step: 6,
    scenarioName: "Anomaly Detection",
    audienceLine: "Now watch this — no user input required.",
    autoTrigger: null, // anomaly fires automatically via detector
    waitMs: 0,
  },
  {
    step: 7,
    scenarioName: "Proactive AI",
    audienceLine:
      "Nova detected an anomaly and restructured the dashboard\nbefore I said anything. That's Generative UI.",
    autoTrigger: null,
    waitMs: 5000,
  },
  {
    step: 8,
    scenarioName: "Reset",
    audienceLine: "One command to reset.",
    autoTrigger: "Reset to default layout",
    waitMs: 2000,
  },
];

export type DemoScriptOverlayProps = {
  /** Called when the current step's autoTrigger should be sent to the copilot. */
  onTriggerScenario?: (message: string) => void | Promise<void>;
};

export default function DemoScriptOverlay({
  onTriggerScenario,
}: DemoScriptOverlayProps): JSX.Element | null {
  const [index, setIndex] = React.useState(0);
  const [hidden, setHidden] = React.useState(false);

  const isBrowser = typeof window !== "undefined";
  if (!isBrowser) return null;

  const params = new URLSearchParams(window.location.search);
  const isDemo = params.get("demo") === "true";
  if (!isDemo) return null;

  const current = DEMO_SCRIPT[index] ?? DEMO_SCRIPT[0];
  if (!current) return null;

  const goPrev = React.useCallback(() => {
    setIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goNext = React.useCallback(() => {
    setIndex((prev) => (prev < DEMO_SCRIPT.length - 1 ? prev + 1 : prev));
  }, []);

  const trigger = React.useCallback(() => {
    if (!current) return;
    if (!onTriggerScenario || !current.autoTrigger) return;
    void onTriggerScenario(current.autoTrigger);
  }, [current, onTriggerScenario]);

  React.useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === " ") {
        event.preventDefault();
        trigger();
      } else if (event.key === "h" || event.key === "H") {
        setHidden((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, trigger]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-opacity duration-150 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <GlassPanel
        variant="strong"
        className="w-[400px] max-w-[calc(100vw-2rem)] text-sm text-ns-text"
        header={
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ns-accent/20 text-xs font-semibold text-ns-accent animate-pulse">
                {current.step}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wide text-ns-muted">
                Demo Script
              </div>
            </div>
            <span className="text-xs text-ns-muted">
              Step {current.step} / {DEMO_SCRIPT.length}
            </span>
          </div>
        }
        footer={
          <div className="flex items-center justify-between gap-2 text-[11px] text-ns-muted">
            <span>←/→ navigate · Space trigger · H hide</span>
            <span>Demo overlay (local only)</span>
          </div>
        }
      >
        <div className="space-y-2">
          <div className="text-xs font-semibold text-ns-muted">
            {current.scenarioName}
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ns-text">
            {current.audienceLine}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0}
              className="rounded-lg border border-ns-border bg-ns-surface/80 px-3 py-1 text-xs text-ns-text disabled:opacity-40"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={trigger}
                disabled={!current.autoTrigger || !onTriggerScenario}
                className="rounded-lg bg-ns-accent px-3 py-1 text-xs font-medium text-white disabled:opacity-40"
              >
                Trigger
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={index === DEMO_SCRIPT.length - 1}
                className="rounded-lg border border-ns-border bg-ns-surface/80 px-3 py-1 text-xs text-ns-text disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}

