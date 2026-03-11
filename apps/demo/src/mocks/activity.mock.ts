// SPDX-License-Identifier: MIT
// apps/demo — mock activity feed data.

export type ActivityItem = {
  id: string;
  icon: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "info" | "pending";
};

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    icon: "deploy",
    description: "Pipeline deploy completed",
    timestamp: "2 min ago",
    status: "success",
  },
  {
    id: "a2",
    icon: "alert",
    description: "Anomaly detected on revenue metric",
    timestamp: "12 min ago",
    status: "warning",
  },
  {
    id: "a3",
    icon: "user",
    description: "New user signup from campaign",
    timestamp: "1 hour ago",
    status: "info",
  },
  {
    id: "a4",
    icon: "model",
    description: "Model fine-tune in progress",
    timestamp: "2 hours ago",
    status: "pending",
  },
  {
    id: "a5",
    icon: "api",
    description: "API rate limit threshold reached",
    timestamp: "3 hours ago",
    status: "info",
  },
];
