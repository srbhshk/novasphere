# @novasphere/ui-auth

Authentication UI components that work with any auth provider. The UI is wired to an `AuthAdapter` interface; you implement the adapter for your provider (Clerk, NextAuth, Supabase Auth, etc.) and pass it into the components.

## Install

```bash
npm install @novasphere/ui-auth @novasphere/ui-glass @novasphere/tenant-core @novasphere/tokens
```

Peer dependencies: `react`, `react-dom`, `react-hook-form`, `zod`.

## Usage

Implement `AuthAdapter` (signIn, signUp, signOut, getSession, resetPassword), then use the forms and guards.

```tsx
import { LoginForm, UserMenu, AuthGuard, type AuthAdapter } from "@novasphere/ui-auth";

const myAdapter: AuthAdapter = {
  signIn: async ({ email, password }) => {
    const res = await fetch("/api/auth/signin", { method: "POST", body: JSON.stringify({ email, password }) });
    const data = await res.json();
    return data.ok ? { success: true, session: data.session } : { success: false, error: data.error };
  },
  signUp: async () => ({ success: false, error: "Not implemented" }),
  signOut: async () => {},
  getSession: async () => null,
  resetPassword: async () => {},
};

export function LoginPage() {
  return <LoginForm adapter={myAdapter} onSuccess={(s) => console.log("Signed in", s)} />;
}

export function Layout({ children }) {
  return (
    <AuthGuard adapter={myAdapter} fallback={<LoginForm adapter={myAdapter} />}>
      <UserMenu adapter={myAdapter} />
      {children}
    </AuthGuard>
  );
}
```

## Exports

| Export | Description |
|--------|-------------|
| `LoginForm` | Email/password form; `adapter`, optional `onSuccess` |
| `UserMenu` | User dropdown; `adapter` |
| `AuthGuard` | Wraps children; shows `fallback` when unauthenticated |
| `AuthAdapter`, `AuthResult`, `AuthSession`, `SignInCredentials`, `SignUpCredentials` | Adapter and auth types |
| `loginFormSchema`, `signupFormSchema` | Zod schemas |
| `LoginFormValues`, `SignupFormValues` | Inferred form types |

## Storybook

[Storybook — ui-auth](https://github.com/your-org/novasphere#storybook) (run `pnpm storybook` from repo root; ui-auth on port 6006).
