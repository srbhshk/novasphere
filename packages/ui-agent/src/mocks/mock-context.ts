// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — mock AgentContext for stories and tests

import type { AgentContext } from "@novasphere/agent-core";

export const mockAgentContext: AgentContext = {
  tenantId: "demo",
  userId: "user-1",
  currentRoute: "/demo/dashboard",
  visibleCards: [],
  activeMetrics: [],
  recentActivity: [],
  userMessage: "",
};
