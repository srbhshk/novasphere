// SPDX-License-Identifier: MIT
// @novasphere/ui-auth — UserMenu
// Avatar and name with dropdown: Profile, Settings, Sign Out. Uses Popover from ui-glass.

"use client";

import * as React from "react";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Avatar,
  AvatarFallback,
} from "@novasphere/ui-glass";
import type { AuthAdapter, AuthSession } from "../auth.adapter.interface";
import { cn } from "../lib/utils";

export type UserMenuProps = {
  /** Current session when signed in, null when signed out. */
  session: AuthSession | null;
  /** Auth adapter for signOut. */
  adapter: AuthAdapter;
  /** Optional class name for the trigger wrapper. */
  className?: string;
};

/**
 * User menu: avatar + name when signed in, dropdown with Profile, Settings, Sign Out.
 * Sign Out calls adapter.signOut(). When session is null, renders a compact signed-out state.
 */
export default function UserMenu({
  session,
  adapter,
  className,
}: UserMenuProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = async (): Promise<void> => {
    setSigningOut(true);
    try {
      await adapter.signOut();
      setOpen(false);
    } finally {
      setSigningOut(false);
    }
  };

  if (!session) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)} aria-label="Not signed in">
        Not signed in
      </div>
    );
  }

  const initials = session.email.slice(0, 2).toUpperCase();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn("gap-2", className)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="truncate max-w-[120px]">{session.email}</span>
          <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <nav aria-label="User menu">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            onClick={() => setOpen(false)}
            aria-label="Profile"
          >
            <User className="h-4 w-4" aria-hidden />
            Profile
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            onClick={() => setOpen(false)}
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" aria-hidden />
            Settings
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent text-destructive"
            onClick={handleSignOut}
            disabled={signingOut}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </nav>
      </PopoverContent>
    </Popover>
  );
}
