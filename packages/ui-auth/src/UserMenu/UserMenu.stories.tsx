// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — UserMenu stories

import type { Meta, StoryObj } from "@storybook/react";
import UserMenu from "./UserMenu";
import type { AuthAdapter } from "../auth.adapter.interface";

const mockAdapter: AuthAdapter = {
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  getSession: async () => null,
  resetPassword: async () => {},
};

const meta: Meta<typeof UserMenu> = {
  component: UserMenu,
  title: "ui-auth/UserMenu",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof UserMenu>;

export const SignedIn: Story = {
  args: {
    session: { userId: "u1", email: "user@example.com", tenantId: "t1" },
    adapter: mockAdapter,
  },
};

export const SignedOut: Story = {
  args: {
    session: null,
    adapter: mockAdapter,
  },
};
