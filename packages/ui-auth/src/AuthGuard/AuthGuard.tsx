// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — AuthGuard
// Checks session on mount; renders children if authenticated, fallback if not. Shows fallback or null while loading.

"use client";

import * as React from "react";
import type { AuthAdapter, AuthSession } from "../auth.adapter.interface";

export type AuthGuardProps = {
  /** Auth adapter to check session. */
  adapter: AuthAdapter;
  /** Content to render when authenticated. */
  children: React.ReactNode;
  /** Optional content to show while loading or when unauthenticated. */
  fallback?: React.ReactNode;
};

/**
 * AuthGuard: on mount calls adapter.getSession(). While loading, renders fallback or null.
 * If session exists, renders children; otherwise renders fallback.
 */
export default function AuthGuard({
  adapter,
  children,
  fallback = null,
}: AuthGuardProps): JSX.Element {
  const [session, setSession] = React.useState<AuthSession | null | undefined>(undefined);

  React.useEffect(() => {
    let cancelled = false;
    adapter.getSession().then((s) => {
      if (!cancelled) setSession(s);
    });
    return () => {
      cancelled = true;
    };
  }, [adapter]);

  if (session === undefined) {
    return <>{fallback}</>;
  }
  if (session === null) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
