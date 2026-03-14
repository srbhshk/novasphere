# Contributing to novasphere

## Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/your-org/novasphere.git
   cd novasphere
   pnpm install
   ```

2. **Environment**  
   Copy `apps/demo/.env.example` to `apps/demo/.env.local` and adjust if needed. No API keys are required to run the demo (mock adapter is used when no keys are set).

3. **Local AI (optional)**  
   For the Ollama adapter:
   ```bash
   ollama pull qwen2.5:0.5b
   ```
   Then run the demo with `pnpm dev`; the copilot will use Ollama when reachable.

4. **Build and test**
   ```bash
   pnpm build          # build all packages
   pnpm typecheck     # typecheck all
   pnpm lint          # lint all
   pnpm test          # run package tests
   pnpm storybook     # Storybook (default: ui-glass on 6002)
   pnpm test:e2e      # Playwright E2E (against apps/demo)
   ```

---

## Adding a new AI adapter

Adapters live in `packages/agent-core`. The contract is `AgentAdapter` in `adapter.interface.ts`.

1. **Implement the interface**  
   Create `packages/agent-core/src/adapters/<name>.adapter.ts`:
   - Implement `AgentAdapter`: `type`, `modelName`, `init()`, `chat()`, `streamChat()`, `getStatus()`, `destroy()`.
   - Use `getPrompt()` from `../prompts` for task prompts; do not hardcode prompts in the adapter.

2. **Register in the factory**  
   In `packages/agent-core/src/adapter.factory.ts`:
   - Import the new adapter.
   - In `createAdapterByType()`, add a case for the new `AdapterType` (and add the type to `agent.types.ts` if it’s a new provider).
   - For auto resolution, add a try/fallback in `createAdapter()` in the order you want (e.g. after Ollama, before Mock).

3. **Config and env**  
   - Extend `AdapterFactoryConfig` with any new options (e.g. API key, base URL).
   - Document new env vars in `apps/demo/.env.example` (never commit secrets). The app reads env and passes config into `createAdapter()`.

4. **Documentation**  
   Update this file and the agent-core README with the new adapter and any env vars.

---

## Adding a new bento module

Bento modules are React components that render inside a grid cell. The demo app wires layout config to module components.

1. **Define the module component**  
   It can live in `apps/demo` (e.g. a new component under `src/`) or in a package if it’s reusable. It must accept `BentoCardModuleProps` (from `@novasphere/ui-bento`):
   ```ts
   type BentoCardModuleProps = { config: BentoCardConfig; ... }
   ```

2. **Register in the demo**  
   In the demo app, the Bento grid is fed a `layout` (array of `BentoLayoutConfig`) and a `modules` map (moduleId → component). Add your component to that map and use its `moduleId` in the layout config for the cards that should render it.

3. **Layout config**  
   Each card in `layout` has `id`, `colSpan`, `rowSpan`, `moduleId`, `title`, `visible`, `order`. Add entries that reference your new `moduleId`. You can persist layout in the layout store and/or let the agent emit new layout via `onLayoutChange`.

---

## Adding a new tenant

Tenants are defined in `@novasphere/tenant-core`. For the static registry:

1. **Edit the registry**  
   In `packages/tenant-core/src/tenant.registry.ts`, add a new entry to `TENANT_REGISTRY`:
   ```ts
   export const TENANT_REGISTRY: Record<string, TenantConfig> = {
     demo: { ... },
     acme: {
       id: "acme",
       name: "Acme Corp",
       features: { bentoReorder: true, generativeLayout: true, multiTenant: false, authEnabled: false },
       navItems: [
         { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/acme/dashboard" },
         // ...
       ],
     },
   };
   ```

2. **Types**  
   If you need new fields on `TenantConfig`, add them in `packages/tenant-core/src/tenant.types.ts` and keep the registry entries typed accordingly.

3. **Demo routing**  
   The demo app uses `[tenant]` routes. Ensure the new tenant id is a valid segment (e.g. `/acme/dashboard`). Middleware and tenant resolution are in `apps/demo` and use the resolver from `@novasphere/tenant-core`.

---

## Adding navigation and menu options

To add or change navigation and menu options, update the tenant registry: edit `navItems` (and optionally `children` for second-level pages) in `packages/tenant-core/src/tenant.registry.ts`. Breadcrumbs are computed automatically from the current path and support up to two levels. You do not need to wire breadcrumbs per route or per layout. See **@novasphere/ui-shell** README, section “Navigation and breadcrumbs”, for details.

---

## Commit format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>
```

- **Types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`
- **Scopes:** `tokens`, `ui-glass`, `ui-bento`, `ui-charts`, `ui-agent`, `ui-auth`, `ui-shell`, `agent-core`, `tenant-core`, `demo`, `e2e`, `ci`, `dx`, `deps`, `changeset`
- **Breaking changes:** add `!` after the scope, e.g. `feat(agent-core)!: change streamChat signature`

**Examples:**

- `feat(ui-bento): add drag-to-reorder with Framer Motion`
- `fix(agent-core): handle Ollama 2s timeout gracefully`
- `feat(ui-auth): add TenantSwitcher component`
- `chore(deps): update @mlc-ai/web-llm to 0.2.4`
- `feat(agent-core)!: change AgentAdapter interface — streamChat signature`

Keep the subject line in imperative mood, lowercase, and under about 72 characters. Add a body when you need to explain why or document breaking changes.

---

## Changeset workflow

Every PR that changes a **publishable package** (anything under `packages/` that is versioned and published) must include a changeset.

1. **Create a changeset**
   ```bash
   pnpm changeset
   ```
   - Choose the packages you changed.
   - Choose the bump type: major / minor / patch.
   - Write a short summary that will appear in the changelog.

2. **Commit the changeset**
   - A new file under `.changeset/` will be created (e.g. `quick-dragons-dance.md`). Commit it with your PR.

3. **On merge to main**
   - The release workflow will consume changesets, update versions and changelogs, and publish to npm. The demo app (`apps/demo`) is not published and does not need a changeset.

If you forget a changeset, CI or a maintainer will ask you to add one before merging.
