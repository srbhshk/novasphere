// SPDX-License-Identifier: MIT
// apps/demo — DemoTriggerPanel: preset scenario buttons that drive the copilot for live demos.

"use client";

import * as React from "react";
import type { CopilotPanelRef } from "@novasphere/ui-agent";

type DemoTriggerPanelProps = {
  copilotRef: React.RefObject<CopilotPanelRef | null>;
};

const SCENARIOS: Array<{ id: string; label: string; message: string }> = [
  { id: "ceo", label: "🎯 CEO View", message: "Show me the CEO view" },
  { id: "engineer", label: "🔧 Engineer View", message: "Switch to engineer view" },
  { id: "morning", label: "🌅 Morning Briefing", message: "Good morning, brief me" },
  { id: "anomaly", label: "🚨 Anomaly Alert", message: "There's a revenue anomaly" },
  { id: "chart", label: "📊 Expand Chart", message: "Expand the main chart" },
];

export default function DemoTriggerPanel({
  copilotRef,
}: DemoTriggerPanelProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const runScenario = React.useCallback(
    (message: string) => {
      if (!copilotRef.current || busy) return;
      setBusy(true);
      setOpen(false);

      const total = message.length;
      let index = 0;

      const step = () => {
        index += 1;
        copilotRef.current?.openAndSetInput(message.slice(0, index));
        if (index < total) {
          window.setTimeout(step, 18);
        } else {
          window.setTimeout(() => {
            copilotRef.current?.sendCurrentInput();
            window.setTimeout(() => setBusy(false), 400);
          }, 800);
        }
      };

      step();
    },
    [busy, copilotRef]
  );

  return (
    <div className="fixed bottom-6 left-4 z-40 md:left-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={busy}
        className="mb-2 inline-flex items-center gap-1 rounded-full border border-ns-border bg-ns-surface/80 px-3 py-1 text-xs font-medium text-ns-text shadow hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ns-accent disabled:opacity-60"
        aria-pressed={open}
      >
        ⚡ Demo
      </button>
      {open && !busy && (
        <div className="w-56 rounded-xl border border-ns-border bg-ns-surface/90 p-3 text-xs text-ns-text shadow-lg">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-ns-muted">
            Scenarios
          </p>
          <div className="flex flex-col gap-1.5">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => runScenario(scenario.message)}
                className="inline-flex items-center justify-between rounded-lg bg-ns-surface/80 px-3 py-1.5 text-left text-[13px] hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ns-border-hi"
              >
                <span>{scenario.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

