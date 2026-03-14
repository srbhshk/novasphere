# Novasphere Monorepo — Comprehensive Code Audit

**Date:** 2025-03-14  
**Scope:** Full codebase state report (Phase 1), code review against cursor rules (Phase 2), verdict (Phase 3).

---

## PHASE 1: CODEBASE STATE REPORT

### 1.1 File Tree

Command run:
```bash
find . -type f \
  -not -path '*/node_modules/*' \
  -not -path '*/.next/*' \
  -not -path '*/dist/*' \
  -not -path '*/.git/*' \
  -not -path '*/playwright-report/*' \
  -not -path '*/test-results/*' \
  -not -name '*.tsbuildinfo' \
  -not -name 'pnpm-lock.yaml' \
  | sort
```

Output (excerpt — full run includes .turbo cache; key paths below):

- `.changeset/config.json`, `next16-tailwind4-upgrade.md`, `sidebar-sticky-expand-click.md`
- `.cursor/rules/novasphere-rules.mdc`
- `.eslintrc.json`, `.gitignore`, `.prettierrc`
- `.github/workflows/ci.yml`
- `.storybook/main.ts`, `preview.ts`, `storybook.css`
- `apps/demo/` — middleware, next.config, postcss, tsconfig, .env.example; `src/app/` (layout, page, (dashboard)/layout, [tenant]/page, dashboard/page, agents, analytics, pipelines, settings), `src/components/`, `src/hooks/`, `src/lib/`, `src/mocks/`, `src/store/`, `src/styles/globals.css`
- `nova.config.ts`, `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `turbo.json`
- `packages/agent-core/` — src: adapter.*, agent.*, context.types, prompts, adapters/*, index
- `packages/tenant-core/` — src: tenant.*, breadcrumb.resolver*, index
- `packages/tokens/` — src: index, tailwind.preset, tokens.css
- `packages/ui-agent/` — CopilotPanel, AgentMessage, SuggestionChips, TypingIndicator, AdapterStatusBadge, AdapterInfoPopover, agent.store
- `packages/ui-auth/` — AuthGuard, LoginForm, UserMenu, auth.*, schemas/*
- `packages/ui-bento/` — BentoGrid, BentoCard, BentoSpan, bento.types, variants
- `packages/ui-charts/` — SparklineChart, DonutChart, AreaChart, HeatmapChart, ChartEmpty, ChartSkeleton, chart.types
- `packages/ui-glass/` — GlassCard, GlassPanel, AmbientBackground, GrainOverlay, ui/*
- `packages/ui-shell/` — AppShell, Sidebar, Topbar, NavItem, BreadcrumbBar, variants
- `tests/e2e/copilot.spec.ts`, `playwright.config.ts`

### 1.2 CI Health

| Command | Exit code | Last 30 lines (summary) |
|--------|-----------|-------------------------|
| `pnpm -r build` | 0 | All packages built (tsup); apps/demo Next.js build succeeded. |
| `pnpm -r typecheck` | 0 | All 10 workspace projects typecheck passed. |
| `pnpm -r lint` | 0 | All 10 projects lint passed. |
| `pnpm -r test` | 0 | agent-core 6, ui-glass 24, ui-auth 15, ui-bento 9, ui-charts 25, ui-agent 22, ui-shell 13; demo echoes "No unit tests". All passed. |

### 1.3 Package Exports

- **tokens**: `"."` → dist/index.{js,cjs}, types; `"./tokens.css"` → dist/tokens.css. Index: novaspherePreset, tokens object, Tokens type.
- **agent-core**: Single entry; index exports types, ADAPTER_TYPE, PROMPTS, getPrompt, errors, adapters (Mock, Ollama, WebLLM, Claude, OpenAI), createAdapter, isServerSide, AdapterFactoryConfig.
- **tenant-core**: Single entry; index exports TenantConfig etc., TENANT_REGISTRY, resolveTenant, TenantNotFoundError, getBreadcrumbs.
- **ui-glass**: Single entry; index exports GlassCard, GlassPanel, AmbientBackground, GrainOverlay, Input, Button, Label, Popover, Avatar.
- **ui-bento**: Single entry; index exports BentoGrid, BentoCard, BentoSpan, BentoLayoutConfig, BentoCardConfig, etc.
- **ui-charts**: Single entry; index exports chart components and chart types.
- **ui-agent**: Single entry; index exports CopilotPanel, AgentMessage, SuggestionChips, TypingIndicator, AdapterStatusBadge, AdapterInfoPopover, useAgentStore, store types.
- **ui-auth**: Single entry; index exports AuthGuard, LoginForm, UserMenu, auth types/schemas.
- **ui-shell**: Single entry; index exports AppShell, Sidebar, Topbar, NavItem, BreadcrumbBar and their props.

### 1.4 Key Implementation Files (summary)

- **tsconfig.base.json**: strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitReturns, noFallthroughCasesInSwitch, noUnusedLocals, noUnusedParameters; ESNext, bundler, declaration + declarationMap + sourceMap.
- **package.json (root)**: scripts dev/build/typecheck/lint/test/test:e2e/storybook/changeset/release; devDeps turbo, tailwind, changesets, eslint, playwright, storybook.
- **nova.config.ts**: project, theme (accentColor, glassBlur, borderRadius, darkMode, fontFamily), agent, tenant, features; `as const`.
- **.github/workflows/ci.yml**: Build → typecheck (needs build), lint, test (needs build); Node 20, pnpm, upload/download dist artifact.
- **packages/tokens**: tokens.css defines --ns-* (color, glass, radius, motion, shadow, noise); theme variants silicon-frost, subnet-deep, spectral-edge. tailwind.preset maps to same vars.
- **packages/agent-core**: agent.types (AgentMessage, AgentResponse, SuggestionChip, ADAPTER_TYPE); adapter.interface (init, chat, streamChat, getStatus, destroy); adapter.factory (createAdapter, isServerSide, order Ollama → WebLLM → Claude/OpenAI server-only → Mock); ollama.adapter (INIT_TIMEOUT_MS 2000, health /api/tags, chat/stream no timeout); mock.adapter (streamChat simulates tokens via word chunks + delay); prompts (layout_restructure, intent_classify, anomaly_summarise, action_suggest, metric_explain).
- **packages/ui-glass GlassCard**: variant subtle/medium/strong, highlight sheen, cn()+module.css; CSS uses var(--ns-*).
- **packages/ui-bento BentoGrid**: layout + modules + onReorder; Reorder.Group when onReorder; visibleCards filtered/sorted; renderCard uses modules[moduleId] or fallback span.
- **packages/ui-agent CopilotPanel**: adapter, getContext, onLayoutChange, onAgentResponse, onUserMessage; tryParseLayoutJson; streamChat + finaliseStream; AdapterStatusBadge, messages, typing, download bar.
- **packages/ui-agent agent.store**: messages, status, adapterType/Model, downloadProgress, streamingContent; addMessage, setStatus, setAdapter, appendStreamToken, finaliseStream.
- **packages/ui-shell AppShell**: tenant, currentPath, title, breadcrumbs, sidebarUserSlot, topbarRightSlot; AmbientBackground, GrainOverlay, Topbar, Sidebar, main.
- **apps/demo layout.tsx**: imports @/styles/globals.css, ThemeProvider, getAppFont from @nova/config; metadata, viewport; html+body with font classes.
- **apps/demo (dashboard)/[tenant]/page.tsx**: redirect to `/${tenant}/dashboard`.
- **apps/demo lib/generative-ui/classifier.ts**: keyword detectKeywordIntent then classifyWithOllama; callOllama 3000ms timeout, temperature 0, max_tokens 20; fallback INTENT.CONVERSATIONAL; LAYOUT_DESCRIPTIONS.
- **apps/demo lib/generative-ui/intents.ts**: INTENT const, KEYWORD_TRIGGERS, detectKeywordIntent; LAYOUT_PRESETS (Partial) with 6-card scheme (revenue-metric, users-metric, …); getLayoutForIntent.
- **apps/demo lib/generative-ui/layouts.ts**: LAYOUT_PRESETS (full Record) with 12-card scheme (revenue, users, donut, heatmap, quota, globe, anomaly-banner, agent-insight, …); getLayout(intent); uses HeatmapModule, QuotaModule.
- **apps/demo store/layout.store.ts**: INITIAL_LAYOUT 6 cards (revenue-metric, users-metric, ai-calls-metric, churn-metric, activity-feed, area-chart); setLayout, resetLayout.
- **apps/demo mocks/metrics.mock.ts**: MOCK_METRICS (revenue, users, ai-calls, churn) with sparkline helpers.

### 1.5 Dependency Graph (@novasphere imports in packages)

- **ui-glass**: (none — tokens only via Tailwind/CSS in app)
- **ui-bento**: `@novasphere/ui-glass` (GlassCard)
- **ui-charts**: `@novasphere/ui-glass`, `@novasphere/tokens`
- **ui-agent**: `@novasphere/ui-glass`, `@novasphere/agent-core`
- **ui-auth**: `@novasphere/ui-glass`
- **ui-shell**: `@novasphere/tenant-core`, `@novasphere/ui-glass`
- **agent-core**, **tenant-core**, **tokens**: no @novasphere imports

### 1.6 Test Coverage Summary

- **agent-core**: 6 tests (MockAdapter, factory); ~4.3s.
- **ui-glass**: 4 files, 24 tests; ~1s.
- **ui-auth**: 3 files, 15 tests; ~3.3s.
- **ui-bento**: 2 files, 9 tests; ~3s.
- **ui-charts**: 6 files, 25 tests; ~3s.
- **ui-agent**: 6 files, 22 tests; ~3s.
- **ui-shell**: 4 files, 13 tests; ~0.8s.
- **tenant-core**: test script `vitest run --passWithNoTests`; has breadcrumb.resolver.test.
- **tokens**: `passWithNoTests`.
- **apps/demo**: echo "No unit tests in app (E2E in tests/e2e)".

---

## PHASE 2: COMPREHENSIVE CODE REVIEW

### R1 — TypeScript Strictness

- **any types**: None found in production code.
- **as casts**: Multiple uses; several are legitimate (e.g. `as const`, React.CSSProperties, JSON.parse result). Concerning: `webllm.adapter.ts` line 85 `as unknown as MLCEngine` (dynamic engine type); `LoginForm.tsx` line 43 `zodResolver(loginFormSchema as unknown as Parameters<typeof zodResolver>[0])` (workaround); `api/agent/route.ts` lines 102–104, 127, 132, 138, 149, 153 (context and adapter config casts); `classifier.ts` line 77 `data as OllamaChatResponse`; CopilotPanel `parsed as BentoCardConfig[]` / `as SuggestionChip[]` after validation. **Recommendation**: Add one-line comments where “as” is used to justify safety; avoid casting request body to adapter config without Zod.
- **@ts-ignore / @ts-expect-error**: None found.
- **Exported types**: Exported functions and components have explicit param types and return types (e.g. JSX.Element, Promise\<AgentResponse\>). No implicit any on public APIs.
- **Package boundary types**: agent-core and ui-bento types (BentoCardConfig, BentoLayoutConfig) are used consistently; context.types BentoCardConfig aligns with ui-bento.

**Scorecard R1: 8/10** — Strict and typed; some `as` casts need comments or replacement with validation.

---

### R2 — Package Boundary Violations

- **tokens**: No imports from other packages. OK.
- **agent-core**: No ui-* imports. OK.
- **tenant-core**: No ui-* imports. OK.
- **ui-glass**: Only internal + Radix; no ui-bento, ui-agent, ui-auth, ui-shell, ui-charts. OK.
- **Circular dependencies**: `madge --circular` on all package src dirs: no circular dependency found.
- **Cross-package relative imports**: No `../../` crossing package boundaries; packages use `@novasphere/*` in app and in package tests/stories where applicable.

**Scorecard R2: 10/10** — DAG respected, no forbidden or circular imports.

---

### R3 — CSS Token Discipline

- **Hardcoded colors outside tokens.css**:  
  - **tokens/src/index.ts**: Hex/rgba in `tokens` object are intentional mirrors of CSS vars for TS usage; acceptable.  
  - **ui-glass GlassCard.module.css**: Line 54 `rgba(255, 255, 255, 0.08)` in highlight gradient — should use a token (e.g. --ns-glass-highlight or similar).  
  - **ui-shell Sidebar.module.css**: Lines 49–51 box-shadow rgba(0,0,0,…), rgba(255,255,255,0.06) — shadows not in tokens; consider --ns-shadow-*.  
  - **ui-shell NavItem.module.css**: Line 24 `rgba(79, 142, 247, 0.2)` — hardcoded accent; should use var(--ns-color-accent) or --ns-glow-accent.  
  - **ui-shell Topbar.module.css**: Lines 8, 74 `rgba(0, 0, 0, 0.25)` — tokenise.  
  - **ui-bento BentoCard.module.css**: Line 12 `rgba(0, 0, 0, 0.35)` — tokenise.  
  - **BentoGrid.tsx**: Line 93 inline `boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)"` — should use CSS var or token.  
  - **AmbientBackground.module.css**: Multiple rgba and hex (#020617, #e0e7ff, etc.) for gradients and themes — these are complex; ideally reference tokens or centralise in tokens.css.  
  - **GlassPanel.stories.tsx**: `#0c1120`, `rgba(255,255,255,0.1)` for Storybook — acceptable for stories.
- **Spacing/radius/blur**: Components use var(--ns-radius-*), var(--ns-blur-*), var(--ns-duration-*). OK.
- **Token names**: No use of non-existent --ns-* in reviewed files.
- **--ns- prefix**: Used consistently in tokens.css and in component CSS.

**Scorecard R3: 7/10** — Tokens used well in most places; several hardcoded colors/shadows in CSS and one inline style.

---

### R4 — React Correctness

- **List keys**: BentoGrid and CopilotPanel use `config.id` and `msg.id` for keys. OK.
- **useEffect deps**: CopilotPanel init effect depends on [adapter, setAdapter, setStatus]; handleSend has full dependency list; scroll effect [messages, streamingContent, scrollToBottom]. OK. Dashboard handleUserMessage in useCallback [setLayout, showToast]; time-intent effect [addAgentMessage, setLayout]. OK.
- **State mutations**: Layout updates use setLayout(newLayout); agent store uses spreads and new arrays. No direct mutation of state objects.
- **"use client"**: Used where needed (BentoGrid, CopilotPanel, AppShell, dashboard page). Layout and tenant page are server. OK.
- **Server components**: Dashboard layout is RSC; it does not import client-only code. Root layout imports ThemeProvider (client); that’s the boundary. OK.
- **Memoization**: No obvious heavy list/item components that would require React.memo; BentoGrid visibleCards useMemo, handleReorder useCallback. Acceptable.

**Scorecard R4: 9/10** — No list-key or mutation issues; effects and client boundaries are correct.

---

### R5 — AI Adapter Correctness

- **OllamaAdapter timeout**: Init uses INIT_TIMEOUT_MS 2000 and AbortController; chat() and streamChat() do **not** apply a timeout — only init is 2000ms. Spec says timeout_ms: 2000 for health; chat/stream can hang indefinitely. **Fix**: Add request timeout (e.g. 30s) for chat/stream or document that only init is limited.
- **Factory order**: createAdapter('auto') tries Ollama → WebLLM → Mock. Claude/OpenAI are not tried in auto (they require keys). Matches “Ollama → WebLLM → Mock” for auto. Explicit type claude/openai gated by isServerSide(). OK.
- **Claude/OpenAI server-only**: isServerSide() check before creating; client gets Mock with warning. OK.
- **AgentAdapter implementation**: Ollama, Mock, WebLLM (in repo) implement init, chat, streamChat, getStatus, destroy. OK.
- **Errors**: Ollama uses OllamaNotReachableError, AgentNetworkError, AgentParseError from agent.errors. OK.
- **MockAdapter streamChat**: Simulates streaming by splitting content into chunks and calling onToken with 60ms delay; multiple onToken calls. OK.

**Scorecard R5: 8/10** — One gap: chat/stream in Ollama (and likely others) have no timeout.

---

### R6 — Generative UI Pipeline

- **classifier.ts 2-stage**: Stage 1 detectKeywordIntent(message); stage 2 classifyWithOllama(message). OK.
- **Ollama classification**: temperature: 0, max_tokens: 20. OK.
- **Fallback**: On null content or no match, returns INTENT.CONVERSATIONAL. OK.
- **INTENT vs LAYOUT_PRESETS**: intents.ts defines LAYOUT_PRESETS (Partial) with 6-card ids (revenue-metric, …). layouts.ts defines LAYOUT_PRESETS (full Record) with 12-card ids (revenue, users, donut, heatmap, quota, globe, anomaly-banner, agent-insight). Dashboard uses **getLayout from layouts.ts**, not getLayoutForIntent from intents. So all intents are represented in layouts.ts LAYOUT_PRESETS. OK.
- **moduleIds vs MODULE_REGISTRY**: layouts.ts uses MetricCard, ActivityFeed, AreaChartModule, DonutChartModule, HeatmapModule, QuotaModule, GlobeModule, AnomalyBanner, AgentInsightCard. Dashboard MODULE_REGISTRY has MetricCard, ActivityFeed, AreaChartModule, AnomalyBanner, AgentInsightCard, DonutChartModule, GlobeModule — **missing HeatmapModule and QuotaModule**. Presets that show heatmap or quota will render those cells as literal "HeatmapModule" / "QuotaModule" text. **Bug.**
- **Intent keys vs layout keys**: Intent keys (e.g. CEO_VIEW) match LAYOUT_PRESETS keys in both intents.ts and layouts.ts. OK.
- **layout.store INITIAL_LAYOUT vs layouts.ts**: Store initial layout has 6 cards (revenue-metric, users-metric, …). layouts.ts DEFAULT has 12 cards with ids "revenue", "users", etc. So initial state and “default layout” from layouts.ts are **different shapes**. If the app never applies DEFAULT from layouts, this is only a consistency/confusion issue; if it does, the first paint and “default” preset differ.

**Scorecard R6: 6/10** — Pipeline and intents are correct; MODULE_REGISTRY vs layouts.ts and initial vs default layout are wrong or inconsistent.

---

### R7 — Demo App Wiring

- **BentoGrid**: Receives `layout={layout}`, `modules={MODULE_REGISTRY}`, `onReorder={handleReorder}`. OK.
- **onLayoutChange**: CopilotPanel has onLayoutChange={handleLayoutChange}; handleLayoutChange calls setLayout(newLayout). When adapter returns layout JSON (e.g. Mock), tryParseLayoutJson runs and onLayoutChange(layout) is called. When adapterType !== 'mock', onUserMessage={handleUserMessage} and handleUserMessage calls setLayout(getLayout(intent)). So both paths update layout. OK.
- **MODULE_REGISTRY**: Missing HeatmapModule and QuotaModule used in layouts.ts. **Fix**: Add HeatmapModule and QuotaModule to MODULE_REGISTRY (or remove those modules from layouts.ts and use 6-card scheme from intents.ts).
- **TanStack Query**: useMetricsList used; DashboardProviders (from layout) should wrap with QueryClientProvider — not read in full; dashboard uses useMetricsList and data?.data. Assume provider is in DashboardProviders. OK.
- **Zustand**: useLayoutStore, useTenantStore, useAgentStore; setLayout/setAdapter etc. used in callbacks; no direct mutation outside actions. OK.
- **Tenant routing**: [tenant] param; layout resolves tenant via resolveTenant(headersList.get('x-tenant-id') ?? DEFAULT_TENANT_ID). Middleware not fully read; tenant resolution exists. OK.
- **Logic in app vs package**: Generative UI (classifyIntent, getLayout, generateExplanation) lives in apps/demo; that’s acceptable as “app orchestration”. No business logic that clearly belongs in a package was found in the app.

**Scorecard R7: 7/10** — Wiring is correct except MODULE_REGISTRY vs layouts and optional initial/default layout alignment.

---

### R8 — Build & Bundle Health

- **tsup**: All packages use tsup; CJS and ESM output; declaration files. OK.
- **exports.types**: All package exports include `"types": "./dist/index.d.ts"`. tokens also has `"./tokens.css"`. OK.
- **sideEffects**: Not set in reviewed package.json files; consider `"sideEffects": false` for tree-shaking where applicable.
- **Peer deps**: React, react-dom, framer-motion, recharts, zustand, etc. in peerDependencies; not duplicated in dependencies. OK.
- **pnpm-workspace.yaml**: `packages: - "apps/*" - "packages/*"`. All packages under packages/ are workspace members. OK.
- **tokens.css**: Exported as `"./tokens.css": "./dist/tokens.css"`; tsup copies tokens.css to dist. OK.

**Scorecard R8: 9/10** — Build and exports are in good shape; sideEffects could be added.

---

### R9 — Security & Hygiene

- **API keys**: agent/route.ts uses process.env.ANTHROPIC_API_KEY, OPENAI_API_KEY; route is server-side. createAdapter in dashboard runs in client; keys are not passed to client (factory uses env only on server for claude/openai). OK.
- **console.log**: No sensitive console.log found in reviewed files.
- **.env in git**: `git ls-files | grep .env` → only `apps/demo/.env.example`. OK.
- **TODO/FIXME/HACK**: Grep in packages/ and apps/demo/src for TODO|FIXME|HACK|XXX found no matches. OK.

**Scorecard R9: 10/10** — No issues found.

---

### R10 — Demo Readiness

- **pnpm dev**: Not run in this audit; manual check required.
- **Findings from code**:  
  - With **Mock** adapter: “Show me the CEO view” returns RESTRUCTURE_LAYOUT_JSON from mock; CopilotPanel parses it and calls onLayoutChange; that layout uses MetricCard, ActivityFeed, AreaChartModule (all in MODULE_REGISTRY). So layout change works.  
  - With **onUserMessage** (non-mock): handleUserMessage calls getLayout(intent) from **layouts.ts**; presets include HeatmapModule and QuotaModule; MODULE_REGISTRY does not — those cells show as text.  
  - Anomaly detector: useAnomalyDetector(handleAnomaly, { isDemoMode }); handleAnomaly calls setLayout(getLayout(scenario.intent)) and addAgentMessage. Depends on getLayout from layouts.ts — same Heatmap/Quota gap.  
  - Time-based intent on load (getTimeIntent, 1.5s delay) also uses getLayout(timeIntent) from layouts.ts — same issue.

**Scorecard R10: 6/10** — Demo works for Mock path and 6-card flows; 12-card presets with Heatmap/Quota will show broken cells unless MODULE_REGISTRY is completed or layouts simplified.

---

## PHASE 3: VERDICT

### 1. Scorecard (1–10)

| Criterion | Score | Note |
|-----------|-------|------|
| R1 TypeScript strictness | 8 | No any; some `as` casts need comments or validation |
| R2 Package boundaries | 10 | DAG respected, no violations |
| R3 CSS tokens | 7 | Hardcoded colors/shadows in several CSS and one inline style |
| R4 React correctness | 9 | Keys, effects, mutations, client boundaries OK |
| R5 AI adapters | 8 | Chat/stream timeout missing in Ollama |
| R6 Generative UI | 6 | MODULE_REGISTRY vs layouts.ts; two layout schemes |
| R7 Demo wiring | 7 | Same registry/layout mismatch; otherwise correct |
| R8 Build & bundle | 9 | sideEffects could be set |
| R9 Security & hygiene | 10 | No issues |
| R10 Demo readiness | 6 | Works for mock/6-card; 12-card presets break on Heatmap/Quota |

### 2. Ranked Issues by Severity

**CRITICAL**  
- None that block the minimal demo (mock adapter + 6-card layout).

**HIGH**  
- **Generative UI / MODULE_REGISTRY vs layouts.ts**: Dashboard uses getLayout() from layouts.ts (12-card presets with HeatmapModule, QuotaModule) but MODULE_REGISTRY does not include HeatmapModule or QuotaModule. Any intent that shows those (e.g. ENGINEER_VIEW, FOCUS_ENGINEERING, ANOMALY_INFRA) renders those cells as raw text. **Fix**: Either add HeatmapModule and QuotaModule components and register them in MODULE_REGISTRY, or switch dashboard to use intents.ts getLayoutForIntent + 6-card presets and drop layouts.ts (or align layouts.ts with the 6-card set and remove Heatmap/Quota from presets).
- **Two layout schemes**: layout.store INITIAL_LAYOUT (6 cards, ids like revenue-metric) vs layouts.ts DEFAULT (12 cards, ids like revenue). Confusing and can cause bugs when mixing. **Fix**: Unify on one scheme: either 6-card + intents.ts presets everywhere, or 12-card + full MODULE_REGISTRY and set INITIAL_LAYOUT to match layouts.ts DEFAULT.

**MEDIUM**  
- **OllamaAdapter chat/stream timeout**: No timeout on chat() and streamChat(); only init is 2000ms. **Fix**: Add configurable timeout (e.g. 30s) and AbortController for chat/stream.
- **Type assertions**: Several `as` casts (agent route, CopilotPanel, webllm, LoginForm) should have short comments or be replaced with Zod/guards where possible.
- **Hardcoded colors/shadows**: GlassCard highlight, Sidebar/Topbar/NavItem/BentoCard shadows, BentoGrid inline boxShadow, AmbientBackground gradients — move to tokens or document as intentional exceptions.

**LOW**  
- **sideEffects: false**: Add to packages that have no side effects.
- **Vitest CJS deprecation**: Test runs show “The CJS build of Vite's Node API is deprecated” — consider ESM Vitest config.
- **CI**: Lint job does not depend on build; typecheck/test do. Fine; optional: run typecheck without artifact for faster feedback.

### 3. Top 3 Fixes Before New Features

1. **Unify layout and MODULE_REGISTRY**: Decide either (a) 6-card world: use intents.ts LAYOUT_PRESETS + getLayoutForIntent, INITIAL_LAYOUT as single source, remove or don’t use layouts.ts for dashboard, or (b) 12-card world: add HeatmapModule and QuotaModule to the app and MODULE_REGISTRY, and set INITIAL_LAYOUT to match layouts.ts DEFAULT. Then use a single getLayout/getLayoutForIntent and one preset file.
2. **OllamaAdapter timeouts**: Add a configurable timeout (and AbortController) for chat() and streamChat() so long-running Ollama calls don’t hang the UI.
3. **Tokenise or document hardcoded CSS**: Replace or document the remaining hardcoded rgba/hex in ui-shell, ui-bento, ui-glass (and one BentoGrid inline style); add shadow/glow tokens if needed.

### 4. Overall Assessment

The base is **strong enough to build a product on**: boundaries are clear, TypeScript is strict, adapters and stores are well structured, and the demo works for the Mock adapter and the 6-card layout path. The main **structural** problem is the **dual layout system** (intents.ts 6-card vs layouts.ts 12-card) and **incomplete MODULE_REGISTRY** for the 12-card presets. Fixing that (either by completing the registry and aligning initial layout, or by standardising on the 6-card scheme) is necessary before relying on “CEO view” / “engineer view” etc. in production or in demos with real adapters. After that, adding chat/stream timeouts and tightening tokens/casts will make the base more robust and maintainable. No fundamental re-architecture is required.
