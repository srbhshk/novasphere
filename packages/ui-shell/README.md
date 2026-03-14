# @novasphere/ui-shell

Application shell: Sidebar, Topbar, AppShell, NavItem, and BreadcrumbBar. Tenant-aware (tenant name, logo, nav items from `TenantConfig`). Composes ui-glass and ui-auth for a full dashboard frame.

## Install

```bash
npm install @novasphere/ui-shell @novasphere/ui-glass @novasphere/ui-auth @novasphere/tenant-core @novasphere/tokens
```

Peer dependencies: `react`, `react-dom`, `framer-motion`, `zustand`.

## Usage

Provide tenant config and nav items; wrap your app in `AppShell`. Pass breadcrumbs from `getBreadcrumbs(pathname, tenant, fallbackTitle)` so the topbar shows the current page automatically.

```tsx
import { usePathname } from "next/navigation"; // or your router
import { AppShell } from "@novasphere/ui-shell";
import { getBreadcrumbs, type TenantConfig } from "@novasphere/tenant-core";

const tenant: TenantConfig = {
  id: "acme",
  name: "Acme",
  logoUrl: "/logo.svg",
  navItems: [
    { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/acme/dashboard" },
    { id: "settings", label: "Settings", icon: "Settings", href: "/acme/settings" },
  ],
};

export function Layout({ children }) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname ?? "/", tenant, "Dashboard");
  return (
    <AppShell
      tenant={tenant}
      currentPath={pathname ?? "/"}
      title="Dashboard"
      breadcrumbs={breadcrumbs}
    >
      {children}
    </AppShell>
  );
}
```

`title` is only used as a fallback when the path does not match any nav item (e.g. 404).

## Navigation and breadcrumbs

Navigation and breadcrumbs are driven by a single source of truth: `TenantConfig.navItems` (and optional `children` for a second level). You do not set breadcrumb props per route — they are derived automatically from the current path.

- **Add a top-level section:** Add an entry to `navItems` with `id`, `label`, `icon`, and `href`. The sidebar and breadcrumb will show it; the current page is inferred from the path.
- **Add a second-level page (max 2 levels):** Add a `children` array to that nav item with `{ id, label, href }`. Breadcrumbs will show e.g. **Settings** > **API Keys** when the path matches the child `href`.
- **Breadcrumbs:** Use `getBreadcrumbs(path, tenant, fallbackTitle)` from `@novasphere/tenant-core` and pass the result to `AppShell` as `breadcrumbs`. No per-route or per-layout breadcrumb wiring is required.

## Exports

| Export | Description |
|--------|-------------|
| `AppShell` | Root shell layout; `tenant`, `children`, `currentPath`, `title`, optional `breadcrumbs` |
| `Sidebar` | Sidebar with nav; `tenant` |
| `Topbar` | Top bar; `tenant` |
| `NavItem` | Single nav link; `href`, `label`, `icon` |
| `BreadcrumbBar` | Breadcrumbs; `items` (`label`, `href`) |
| `AppShellProps`, `SidebarProps`, `TopbarProps`, `NavItemProps`, `BreadcrumbBarProps`, `BreadcrumbItem` | Types |

## Storybook

[Storybook — ui-shell](https://github.com/your-org/novasphere#storybook) (run `pnpm storybook` from repo root; ui-shell on port 6007).
