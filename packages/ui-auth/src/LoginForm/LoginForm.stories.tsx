// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — LoginForm stories

import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";
import LoginForm from "./LoginForm";
import type { AuthAdapter, AuthSession } from "../auth.adapter.interface";

const createMockAdapter = (overrides: {
  signIn?: (creds: { email: string; password: string }) => Promise<{ success: boolean; error?: string; session?: AuthSession }>;
}): AuthAdapter => ({
  signIn: overrides.signIn ?? (async () => ({ success: true, session: { userId: "u1", email: "u@example.com", tenantId: "t1" } })),
  signUp: async () => ({ success: true, session: { userId: "u1", email: "u@example.com", tenantId: "t1" } }),
  signOut: async () => {},
  getSession: async () => null,
  resetPassword: async () => {},
});

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
  title: "ui-auth/LoginForm",
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark", values: [{ name: "dark", value: "#0c1120" }] },
  },
};

export default meta;

type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {
  args: {
    adapter: createMockAdapter({}),
  },
};

export const Loading: Story = {
  args: {
    adapter: createMockAdapter({
      signIn: async () => {
        await new Promise((r) => setTimeout(r, 5000));
        return { success: true, session: { userId: "u1", email: "u@example.com", tenantId: "t1" } };
      },
    }),
  },
};

export const WithError: Story = {
  args: {
    adapter: createMockAdapter({
      signIn: async () => ({ success: false, error: "Invalid email or password" }),
    }),
  },
};

export const ValidationInteraction: Story = {
  args: {
    adapter: createMockAdapter({}),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText(/email/i);
    const submitButton = canvas.getByRole("button", { name: /sign in/i });
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.click(submitButton);
    await expect(canvas.getByRole("alert")).toHaveTextContent(/valid email|invalid|required/i);
  },
};
