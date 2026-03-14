// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — LoginForm
// Login form with email/password, React Hook Form + zod, and AuthAdapter integration.

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { GlassCard, Input, Button, Label } from "@novasphere/ui-glass";
import type { AuthAdapter, AuthSession } from "../auth.adapter.interface";
import { loginFormSchema, type LoginFormValues } from "../schemas/login.schema";
import { cn } from "../lib/utils";

export type LoginFormProps = {
  /** Auth adapter that performs sign-in. */
  adapter: AuthAdapter;
  /** Called with session on successful sign-in. */
  onSuccess?: (session: AuthSession) => void;
  /** Optional class name for the card wrapper. */
  className?: string;
};

/**
 * Login form: email and password with show/hide toggle, submits via adapter.signIn,
 * shows inline error or calls onSuccess. Uses GlassCard and shadcn inputs from ui-glass.
 */
export default function LoginForm({
  adapter,
  onSuccess,
  className,
}: LoginFormProps): React.ReactElement {
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    // Cast: zod types can differ between zod and @hookform/resolvers; schema is correct at runtime.
    resolver: zodResolver(loginFormSchema as unknown as Parameters<typeof zodResolver>[0]),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setSubmitError(null);
    const result = await adapter.signIn({
      email: values.email,
      password: values.password,
    });
    if (result.success && result.session) {
      onSuccess?.(result.session);
    } else {
      setSubmitError(result.error ?? "Sign in failed");
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void handleSubmit(onSubmit)(e).catch(() => {
      // Resolver rejects on validation failure; errors are shown via formState.errors
    });
  };

  return (
    <GlassCard variant="medium" className={cn("w-full max-w-sm p-6", className)}>
      <form onSubmit={onFormSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        {submitError && (
          <p className="text-sm text-destructive" role="alert">
            {submitError}
          </p>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </GlassCard>
  );
}
