// SPDX-License-Identifier: MIT
// apps/demo — Time-of-day context and intent helpers for Generative UI.

"use client";

import { INTENT, type Intent } from "./intents";

export type TimeContext = "morning" | "afternoon" | "evening" | "night";

export function getTimeContext(): TimeContext {
  let override: TimeContext | null = null;

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const timeParam = params.get("time");
    if (
      timeParam === "morning" ||
      timeParam === "afternoon" ||
      timeParam === "evening" ||
      timeParam === "night"
    ) {
      override = timeParam;
    }
  }

  if (override) return override;

  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getTimeIntent(): Intent | null {
  const ctx = getTimeContext();
  if (ctx === "morning") return INTENT.MORNING_BRIEFING;
  if (ctx === "evening") return INTENT.EOD_SUMMARY;
  return null;
}

export function getTimeGreeting(): string {
  const ctx = getTimeContext();
  const hour = new Date().getHours();
  if (ctx === "morning") {
    const weekday = new Date().toLocaleDateString("en", { weekday: "long" });
    return `Good morning! Here's your ${weekday} briefing.`;
  }
  if (ctx === "afternoon") {
    return "Good afternoon! Your metrics are looking strong today.";
  }
  if (ctx === "evening") {
    return "Good evening! Here's your end-of-day summary.";
  }
  return "Working late? Here's a quick status overview.";
}

