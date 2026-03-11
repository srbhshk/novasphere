// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — AuthGuard stories

import type { Meta, StoryObj } from "@storybook/react";
import AuthGuard from "./AuthGuard";
import type { AuthAdapter, AuthSession } from "../auth.adapter.interface";

const session: AuthSession = { userId: "u1", email: "user@example.com", tenantId: "t1" };

const authenticatedAdapter: AuthAdapter = {
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  getSession: async () => session,
  resetPassword: async () => {},
};

const unauthenticatedAdapter: AuthAdapter = {
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  getSession: async () => null,
  resetPassword: async () => {},
};

const meta: Meta<typeof AuthGuard> = {
  component: AuthGuard,
  title: "ui-auth/AuthGuard",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof AuthGuard>;

export const Authenticated: Story = {
  args: {
    adapter: authenticatedAdapter,
    children: <p>Protected content</p>,
    fallback: <p>Please sign in</p>,
  },
};

export const Unauthenticated: Story = {
  args: {
    adapter: unauthenticatedAdapter,
    children: <p>Protected content</p>,
    fallback: <p>Please sign in</p>,
  },
};
