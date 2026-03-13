// SPDX-License-Identifier: MIT
// apps/demo — Dashboard page: BentoGrid + CopilotPanel, Generative UI via onLayoutChange.

"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BentoGrid } from "@novasphere/ui-bento";
import type { BentoCardModuleProps, BentoLayoutConfig } from "@novasphere/ui-bento";
import { CopilotPanel, useAgentStore } from "@novasphere/ui-agent";
import type { CopilotPanelRef } from "@novasphere/ui-agent";
import { createAdapter } from "@novasphere/agent-core";
import type { AgentAdapter, AgentContext, AgentMessage } from "@novasphere/agent-core";
import { classifyIntent, generateExplanation, LAYOUT_DESCRIPTIONS } from "@/lib/generative-ui/classifier";
import { getLayout } from "@/lib/generative-ui/layouts";
import { INTENT } from "@/lib/generative-ui/intents";
import { useAnomalyDetector, type AnomalyScenario } from "@/lib/generative-ui/anomaly-detector";
import { getTimeIntent, getTimeGreeting } from "@/lib/generative-ui/time-context";
import { useLayoutStore } from "@/store/layout.store";
import { useTenantStore } from "@/store/tenant.store";
import { useMetricsList } from "@/hooks/useMetricsList";
import MetricCard from "@/components/modules/MetricCard";
import ActivityFeedModule from "@/components/modules/ActivityFeed";
import AreaChartModule from "@/components/modules/AreaChartModule";
import AnomalyBanner from "@/components/modules/AnomalyBanner";
import AgentInsightCard from "@/components/modules/AgentInsightCard";
import DonutChartModule from "@/components/modules/DonutChartModule";
import GlobeModule from "@/components/modules/GlobeModule";
import ContextBanner from "@/components/ContextBanner";
import LayoutToast from "@/components/LayoutToast";
import DemoTriggerPanel from "@/components/DemoTriggerPanel";
import DemoScriptOverlay from "@/components/DemoScriptOverlay";

const MODULE_REGISTRY: Record<string, React.ComponentType<BentoCardModuleProps>> = {
  MetricCard,
  ActivityFeed: ActivityFeedModule,
  AreaChartModule,
  AnomalyBanner,
  AgentInsightCard,
  DonutChartModule,
  GlobeModule,
};

/** When agent response contains this phrase, show the anomaly ContextBanner. */
const ANOMALY_TRIGGER_PHRASE = "Signups dipped briefly";

export default function DashboardPage(): JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDemoMode = searchParams?.get("demo") === "true";
  const { layout, setLayout } = useLayoutStore();
  const { tenant } = useTenantStore();
  const { data: metricsData } = useMetricsList();
  const addAgentMessage = useAgentStore((state) => state.addMessage);
  const [adapter, setAdapter] = React.useState<AgentAdapter | null>(null);
  const adapterRef = React.useRef<AgentAdapter | null>(null);
  const [anomalyMessage, setAnomalyMessage] = React.useState<string | null>(null);
  const [anomalyToast, setAnomalyToast] = React.useState<AnomalyScenario | null>(null);
  const copilotRef = React.useRef<CopilotPanelRef | null>(null);

  const adapterType = (typeof process.env.NEXT_PUBLIC_AI_ADAPTER === "string" && process.env.NEXT_PUBLIC_AI_ADAPTER.trim())
    ? (process.env.NEXT_PUBLIC_AI_ADAPTER.trim().toLowerCase() as "auto" | "mock" | "ollama" | "webllm" | "claude" | "openai")
    : "auto";

  React.useEffect(() => {
    let cancelled = false;
    createAdapter({ type: adapterType })
      .then((a) => {
        if (!cancelled) {
          adapterRef.current = a;
          setAdapter(a);
        } else {
          void a.destroy();
        }
      })
      .catch(() => {
        if (!cancelled) setAdapter(null);
      });
    return () => {
      cancelled = true;
      adapterRef.current?.destroy?.();
      adapterRef.current = null;
      setAdapter(null);
    };
  }, [adapterType]);

  const getContext = React.useCallback((): AgentContext => {
    const activeMetrics = (metricsData?.data ?? []).map((m) => ({
      id: m.id,
      name: m.label,
      value: 0,
      unit: m.value,
      trend: m.delta,
    }));
    const visibleCards = layout.map((c) => ({
      id: c.id,
      colSpan: c.colSpan,
      rowSpan: c.rowSpan,
      moduleId: c.moduleId,
      ...(c.title !== undefined && { title: c.title }),
      visible: c.visible,
      order: c.order,
    }));
    return {
      tenantId: tenant.id,
      userId: "demo-user",
      currentRoute: pathname ?? "/",
      visibleCards,
      activeMetrics,
      recentActivity: [],
      userMessage: "",
    };
  }, [layout, metricsData?.data, tenant.id, pathname]);

  const [layoutRestructureToast, setLayoutRestructureToast] = React.useState<string | null>(null);
  const toastTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleLayoutChange = React.useCallback(
    (newLayout: BentoLayoutConfig) => {
      setLayout(newLayout);
      setLayoutRestructureToast("Nova restructured your dashboard");
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setLayoutRestructureToast(null);
        toastTimeoutRef.current = null;
      }, 4000);
    },
    [setLayout]
  );

  const handleReorder = React.useCallback(
    (newLayout: BentoLayoutConfig) => {
      setLayout(newLayout);
    },
    [setLayout]
  );

  const handleAgentResponse = React.useCallback((content: string) => {
    if (content.includes(ANOMALY_TRIGGER_PHRASE)) {
      setAnomalyMessage(content);
    }
  }, []);

  const showToast = React.useCallback((description: string) => {
    setLayoutRestructureToast(description);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setLayoutRestructureToast(null);
      toastTimeoutRef.current = null;
    }, 3000);
  }, []);

  const handleUserMessage = React.useCallback(
    async (message: string): Promise<string> => {
      const intent = await classifyIntent(message);

      if (intent !== INTENT.CONVERSATIONAL) {
        const newLayout = getLayout(intent);
        setLayout(newLayout);
        const description =
          LAYOUT_DESCRIPTIONS[intent] ?? "update the dashboard layout";
        showToast(`Nova restructured for: ${description}`);
      }

      const explanation = await generateExplanation(intent, message);
      return explanation;
    },
    [setLayout, showToast]
  );

  const showAnomalyToast = React.useCallback((scenario: AnomalyScenario) => {
    setAnomalyToast(scenario);
    // Auto-dismiss after 5 seconds.
    window.setTimeout(() => {
      setAnomalyToast((current) =>
        current && current.id === scenario.id ? null : current
      );
    }, 5000);
  }, []);

  const handleAnomaly = React.useCallback(
    async (scenario: AnomalyScenario) => {
      setLayout(getLayout(scenario.intent));
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `anomaly-${Date.now()}`;
      const message: AgentMessage = {
        id,
        role: "assistant",
        content: `⚠️ ${scenario.title}: ${scenario.description}
I've restructured your dashboard to surface the relevant data.
What would you like to investigate first?`,
        timestamp: Date.now(),
      };
      addAgentMessage(message);
      showAnomalyToast(scenario);
    },
    [addAgentMessage, setLayout, showAnomalyToast]
  );

  useAnomalyDetector(handleAnomaly, { isDemoMode });

  React.useEffect(() => {
    const timeIntent = getTimeIntent();
    if (!timeIntent) return undefined;

    const timeoutId = window.setTimeout(() => {
      setLayout(getLayout(timeIntent));
      const greeting = getTimeGreeting();
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `msg-${Date.now()}`;
      const message: AgentMessage = {
        id,
        role: "assistant",
        content: `${greeting} I've set up your dashboard for this time of day. Let me know what to focus on.`,
        timestamp: Date.now(),
      };
      addAgentMessage(message);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [addAgentMessage, setLayout]);

  React.useEffect(() => {
    const handler = (event: Event): void => {
      const maybeCustomEvent = event as CustomEvent<unknown>;
      const detail = maybeCustomEvent.detail;
      if (
        detail &&
        typeof detail === "object" &&
        "presetInput" in detail &&
        typeof (detail as { presetInput: unknown }).presetInput === "string"
      ) {
        const presetInput = (detail as { presetInput: string }).presetInput;
        copilotRef.current?.openAndSetInput(presetInput);
      }
    };

    window.addEventListener("novasphere:copilot-open", handler as EventListener);
    return () => {
      window.removeEventListener("novasphere:copilot-open", handler as EventListener);
    };
  }, []);

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isMetaOrCtrl = event.metaKey || event.ctrlKey;
      if (!isMetaOrCtrl) return;

      switch (event.key) {
        case "1":
          event.preventDefault();
          void handleUserMessage("Show me the CEO view");
          break;
        case "2":
          event.preventDefault();
          void handleUserMessage("Switch to engineer view");
          break;
        case "3":
          event.preventDefault();
          void handleUserMessage("Good morning, brief me");
          break;
        case "4":
          event.preventDefault();
          void handleUserMessage("There's a revenue anomaly");
          break;
        case "0":
          event.preventDefault();
          void handleUserMessage("Reset to default layout");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUserMessage]);

  return (
    <>
      <ContextBanner
        message={anomalyMessage}
        onDismiss={() => setAnomalyMessage(null)}
        onInvestigate={() => {
          copilotRef.current?.openAndSetInput("Can you investigate this anomaly?");
        }}
      />
      <LayoutToast
        message={layoutRestructureToast}
        onDismiss={() => setLayoutRestructureToast(null)}
      />
      {anomalyToast && (
        <div
          className="fixed right-4 top-20 z-40 md:right-6 md:top-24"
          role="alert"
          aria-live="assertive"
        >
          <div className="rounded-xl border border-amber-500/60 bg-amber-500/15 px-4 py-2 text-sm text-amber-100 shadow-lg">
            <div className="text-xs font-semibold uppercase tracking-wide text-amber-300">
              Anomaly detected · {anomalyToast.severity.toUpperCase()}
            </div>
            <div className="mt-1 font-medium">{anomalyToast.title}</div>
            <div className="text-xs text-amber-100/80">
              {anomalyToast.description}
            </div>
          </div>
        </div>
      )}
      <div className="p-4 md:p-6">
        <BentoGrid
          layout={layout}
          modules={MODULE_REGISTRY}
          onReorder={handleReorder}
        />
      </div>
      {isDemoMode && (
        <>
          <DemoTriggerPanel copilotRef={copilotRef} />
          <DemoScriptOverlay
            onTriggerScenario={(message) => {
              void handleUserMessage(message);
            }}
          />
        </>
      )}
      {adapter !== null && (
        <CopilotPanel
          adapter={adapter}
          getContext={getContext}
          initialOpen={false}
          onLayoutChange={handleLayoutChange}
          onAgentResponse={handleAgentResponse}
          copilotRef={copilotRef}
          onUserMessage={handleUserMessage}
        />
      )}
    </>
  );
}
