// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — LoginForm tests

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import LoginForm from "./LoginForm";
import type { AuthAdapter, AuthSession } from "../auth.adapter.interface";

function createMockAdapter(overrides: Partial<AuthAdapter> = {}): AuthAdapter {
  return {
    signIn: vi.fn().mockResolvedValue({ success: true, session: { userId: "u1", email: "a@b.com", tenantId: "t1" } as AuthSession }),
    signUp: vi.fn().mockResolvedValue({ success: true }),
    signOut: vi.fn().mockResolvedValue(undefined),
    getSession: vi.fn().mockResolvedValue(null),
    resetPassword: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function getEmailInput(): HTMLElement {
  return screen.getByRole("textbox", { name: /email/i });
}

function getPasswordInput(): HTMLElement {
  return document.getElementById("login-password") as HTMLInputElement;
}

describe("LoginForm", () => {
  it("renders email and password fields and submit button", () => {
    const adapter = createMockAdapter();
    render(<LoginForm adapter={adapter} />);
    expect(getEmailInput()).toBeInTheDocument();
    expect(getPasswordInput()).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("calls adapter.signIn with credentials on submit", async () => {
    const user = userEvent.setup();
    const signIn = vi.fn().mockResolvedValue({ success: true, session: { userId: "u1", email: "a@b.com", tenantId: "t1" } });
    const adapter = createMockAdapter({ signIn });
    render(<LoginForm adapter={adapter} />);
    await user.type(getEmailInput(), "test@example.com");
    await user.type(getPasswordInput(), "password1");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith({ email: "test@example.com", password: "password1" });
    });
  });

  it("calls onSuccess with session when sign-in succeeds", async () => {
    const user = userEvent.setup();
    const session: AuthSession = { userId: "u1", email: "ok@example.com", tenantId: "t1" };
    const signIn = vi.fn().mockResolvedValue({ success: true, session });
    const onSuccess = vi.fn();
    const adapter = createMockAdapter({ signIn });
    render(<LoginForm adapter={adapter} onSuccess={onSuccess} />);
    await user.type(getEmailInput(), "ok@example.com");
    await user.type(getPasswordInput(), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(session);
    });
  });

  it("shows inline error when sign-in fails", async () => {
    const user = userEvent.setup();
    const adapter = createMockAdapter({
      signIn: vi.fn().mockResolvedValue({ success: false, error: "Invalid credentials" }),
    });
    render(<LoginForm adapter={adapter} />);
    await user.type(getEmailInput(), "bad@example.com");
    await user.type(getPasswordInput(), "wrongpassword"); // min 8 chars to pass validation
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("does not call signIn when email is invalid", async () => {
    const user = userEvent.setup();
    const signIn = vi.fn().mockResolvedValue({ success: true, session: null });
    render(<LoginForm adapter={createMockAdapter({ signIn })} />);
    await user.type(getEmailInput(), "not-an-email");
    await user.type(getPasswordInput(), "password12");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(signIn).not.toHaveBeenCalled();
    });
  });

  it("does not call signIn when password is too short", async () => {
    const user = userEvent.setup();
    const signIn = vi.fn().mockResolvedValue({ success: true, session: null });
    render(<LoginForm adapter={createMockAdapter({ signIn })} />);
    await user.type(getEmailInput(), "a@b.com");
    await user.type(getPasswordInput(), "short");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(signIn).not.toHaveBeenCalled();
    });
  });

  it("has show/hide password toggle", async () => {
    const user = userEvent.setup();
    render(<LoginForm adapter={createMockAdapter()} />);
    const toggle = screen.getByRole("button", { name: /show password/i });
    expect(toggle).toBeInTheDocument();
    await user.click(toggle);
    expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument();
  });
});
