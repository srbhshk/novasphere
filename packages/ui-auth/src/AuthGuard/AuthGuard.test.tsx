// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — AuthGuard tests

import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthGuard from "./AuthGuard";
import type { AuthAdapter, AuthSession } from "../auth.adapter.interface";

function createMockAdapter(session: AuthSession | null): AuthAdapter {
  return {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn().mockResolvedValue(session),
    resetPassword: vi.fn(),
  };
}

describe("AuthGuard", () => {
  it("renders fallback while loading", () => {
    const adapter = createMockAdapter(null);
    (adapter.getSession as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {})
    );
    render(
      <AuthGuard adapter={adapter} fallback={<span>Loading…</span>}>
        <span>Content</span>
      </AuthGuard>
    );
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders children when session exists", async () => {
    const session: AuthSession = { userId: "u1", email: "a@b.com", tenantId: "t1" };
    const adapter = createMockAdapter(session);
    render(
      <AuthGuard adapter={adapter} fallback={<span>Sign in</span>}>
        <span>Protected content</span>
      </AuthGuard>
    );
    await waitFor(() => {
      expect(screen.getByText("Protected content")).toBeInTheDocument();
    });
    expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
  });

  it("renders fallback when session is null", async () => {
    const adapter = createMockAdapter(null);
    render(
      <AuthGuard adapter={adapter} fallback={<span>Please sign in</span>}>
        <span>Protected content</span>
      </AuthGuard>
    );
    await waitFor(() => {
      expect(screen.getByText("Please sign in")).toBeInTheDocument();
    });
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("calls adapter.getSession on mount", async () => {
    const getSession = vi.fn().mockResolvedValue(null);
    const adapter = createMockAdapter(null);
    adapter.getSession = getSession;
    render(
      <AuthGuard adapter={adapter} fallback={null}>
        <span>Content</span>
      </AuthGuard>
    );
    await waitFor(() => {
      expect(getSession).toHaveBeenCalled();
    });
  });
});
