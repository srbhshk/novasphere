// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — AuthAdapter interface
// Contract that auth providers (Clerk, NextAuth, Supabase, etc.) must implement.

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  name: string;
};

export type AuthSession = {
  userId: string;
  email: string;
  tenantId: string;
};

export type AuthResult = {
  success: boolean;
  error?: string;
  session?: AuthSession;
};

/**
 * Adapter interface for authentication. Teams implement this to wire
 * their auth provider (Clerk, NextAuth, Supabase Auth, etc.) to the UI.
 */
export interface AuthAdapter {
  signIn(credentials: SignInCredentials): Promise<AuthResult>;
  signUp(credentials: SignUpCredentials): Promise<AuthResult>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  resetPassword(email: string): Promise<void>;
}
