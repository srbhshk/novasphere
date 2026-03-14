// SPDX-License-Identifier: MIT
// apps/demo — POST /api/agent. Streams agent response when adapter is claude or openai.

import { NextRequest, NextResponse } from "next/server";
import { createAdapter } from "@novasphere/agent-core";
import type { AgentContext, AgentMessage } from "@novasphere/agent-core";
import { z } from "zod";

const AgentRequestBodySchema = z.object({
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
      timestamp: z.number(),
    })
  ),
  context: z.object({
    tenantId: z.string(),
    userId: z.string(),
    currentRoute: z.string(),
    visibleCards: z.array(z.unknown()),
    activeMetrics: z.array(z.unknown()),
    recentActivity: z.array(z.unknown()),
    userMessage: z.string(),
  }),
});

const RATE_LIMIT_RPM = 20;
const rateLimitMap = new Map<string, number[]>();

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return (forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown").toLowerCase();
}

function isRateLimited(clientId: string): boolean {
  const limit = Number(process.env.RATE_LIMIT_AGENT_RPM) || RATE_LIMIT_RPM;
  const now = Date.now();
  const windowMs = 60_000;
  let timestamps = rateLimitMap.get(clientId) ?? [];
  timestamps = timestamps.filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    return true;
  }
  timestamps.push(now);
  rateLimitMap.set(clientId, timestamps);
  return false;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<unknown> | Response> {
  const adapterType = (process.env.NEXT_PUBLIC_AI_ADAPTER ?? "auto").toLowerCase();
  if (adapterType !== "claude" && adapterType !== "openai") {
    return NextResponse.json(
      {
        data: null,
        error: {
          code: "ADAPTER_NOT_PROXYED",
          message:
            "Use Ollama, WebLLM, or Mock on the client for this adapter. Agent API only streams for claude or openai.",
        },
      },
      { status: 400 }
    );
  }

  const clientId = getClientId(request);
  if (isRateLimited(clientId)) {
    return NextResponse.json(
      { data: null, error: { code: "RATE_LIMITED", message: "Too many agent requests. Try again later." } },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { data: null, error: { code: "INVALID_JSON", message: "Request body must be JSON" } },
      { status: 400 }
    );
  }
  const parsed = AgentRequestBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        data: null,
        error: { code: "VALIDATION_ERROR", message: parsed.error.message },
      },
      { status: 400 }
    );
  }
  const { messages, context } = parsed.data;
  // Safe: Zod-validated context; array shapes match AgentContext (validated at API boundary).
  const agentContext: AgentContext = {
    tenantId: context.tenantId,
    userId: context.userId,
    currentRoute: context.currentRoute,
    visibleCards: context.visibleCards as AgentContext["visibleCards"],
    activeMetrics: context.activeMetrics as AgentContext["activeMetrics"],
    recentActivity: context.recentActivity as AgentContext["recentActivity"],
    userMessage: context.userMessage,
  };
  const agentMessages: AgentMessage[] = messages;

  const claudeKey = process.env.ANTHROPIC_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (adapterType === "claude" && !claudeKey) {
    return NextResponse.json(
      { data: null, error: { code: "NO_API_KEY", message: "ANTHROPIC_API_KEY is required for claude" } },
      { status: 502 }
    );
  }
  if (adapterType === "openai" && !openaiKey) {
    return NextResponse.json(
      { data: null, error: { code: "NO_API_KEY", message: "OPENAI_API_KEY is required for openai" } },
      { status: 502 }
    );
  }

  const config =
    adapterType === "claude"
      ? {
          type: "claude" as const,
          claudeKey: claudeKey ?? "",
          ...(process.env.ANTHROPIC_MODEL && { claudeModel: process.env.ANTHROPIC_MODEL }),
        }
      : {
          type: "openai" as const,
          openaiKey: openaiKey ?? "",
          ...(process.env.OPENAI_MODEL && { openaiModel: process.env.OPENAI_MODEL }),
          ...(process.env.OPENAI_BASE_URL && { openaiBaseUrl: process.env.OPENAI_BASE_URL }),
        };

  // Safe: config is built from validated env and matches createAdapter union.
  const adapter = await createAdapter(config as Parameters<typeof createAdapter>[0]);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (text: string): void => {
        const line = "data: " + text.replace(/\n/g, "\\n") + "\n\n";
        controller.enqueue(encoder.encode(line));
      };
      try {
        await adapter.streamChat(agentMessages, agentContext, (token: string) => {
          send(JSON.stringify({ token }));
        });
        send("[DONE]");
      } catch (err) {
        send(JSON.stringify({ error: err instanceof Error ? err.message : "Stream error" }));
      } finally {
        controller.close();
        await adapter.destroy();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    },
  });
}
