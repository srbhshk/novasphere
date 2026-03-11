// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — UserMenu tests

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import UserMenu from "./UserMenu";
import type { AuthAdapter } from "../auth.adapter.interface";

function createMockAdapter(overrides: Partial<AuthAdapter> = {}): AuthAdapter {
  return {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn().mockResolvedValue(undefined),
    getSession: vi.fn().mockResolvedValue(null),
    resetPassword: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("UserMenu", () => {
  it("renders 'Not signed in' when session is null", () => {
    render(<UserMenu session={null} adapter={createMockAdapter()} />);
    expect(screen.getByLabelText(/not signed in/i)).toBeInTheDocument();
  });

  it("renders avatar and email when session is present", () => {
    render(
      <UserMenu
        session={{ userId: "u1", email: "test@example.com", tenantId: "t1" }}
        adapter={createMockAdapter()}
      />
    );
    expect(screen.getByRole("button", { name: /user menu/i })).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("opens dropdown and shows Profile, Settings, Sign Out", async () => {
    const user = userEvent.setup();
    render(
      <UserMenu
        session={{ userId: "u1", email: "a@b.com", tenantId: "t1" }}
        adapter={createMockAdapter()}
      />
    );
    await user.click(screen.getByRole("button", { name: /user menu/i }));
    expect(screen.getByRole("button", { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("calls adapter.signOut when Sign Out is clicked", async () => {
    const user = userEvent.setup();
    const signOut = vi.fn().mockResolvedValue(undefined);
    render(
      <UserMenu
        session={{ userId: "u1", email: "a@b.com", tenantId: "t1" }}
        adapter={createMockAdapter({ signOut })}
      />
    );
    await user.click(screen.getByRole("button", { name: /user menu/i }));
    await user.click(screen.getByRole("button", { name: /sign out/i }));
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});
