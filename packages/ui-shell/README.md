# @novasphere/ui-shell

Application shell: Sidebar, Topbar, AppShell, NavItem, and BreadcrumbBar. Tenant-aware (tenant name, logo, nav items from `TenantConfig`). Composes ui-glass and ui-auth for a full dashboard frame.

## Install

```bash
npm install @novasphere/ui-shell @novasphere/ui-glass @novasphere/ui-auth @novasphere/tenant-core @novasphere/tokens
```

Peer dependencies: `react`, `react-dom`, `framer-motion`, `zustand`.

## Usage

Provide tenant config and nav items; wrap your app in `AppShell`. Use `Sidebar` and `Topbar` inside it, or let `AppShell` compose them.

```tsx
import { AppShell, Sidebar, Topbar, NavItem, BreadcrumbBar } from "@novasphere/ui-shell";
import type { TenantConfig } from "@novasphere/tenant-core";

const tenant: TenantConfig = {
  id: "acme",
  name: "Acme",
  logoUrl: "/logo.svg",
  navItems: [
    { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/settings", label: "Settings", icon: "Settings" },
  ],
};

export function Layout({ children }) {
  return (
    <AppShell tenant={tenant}>
      <Sidebar tenant={tenant} />
      <div className="flex flex-col flex-1">
        <Topbar tenant={tenant} />
        <BreadcrumbBar items={[{ label: "Dashboard", href: "/" }]} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AppShell>
  );
}
```

## Exports

| Export | Description |
|--------|-------------|
| `AppShell` | Root shell layout; `tenant`, `children` |
| `Sidebar` | Sidebar with nav; `tenant` |
| `Topbar` | Top bar; `tenant` |
| `NavItem` | Single nav link; `href`, `label`, `icon` |
| `BreadcrumbBar` | Breadcrumbs; `items` (`label`, `href`) |
| `AppShellProps`, `SidebarProps`, `TopbarProps`, `NavItemProps`, `BreadcrumbBarProps`, `BreadcrumbItem` | Types |

## Storybook

[Storybook — ui-shell](https://github.com/your-org/novasphere#storybook) (run `pnpm storybook` from repo root; ui-shell on port 6007).
