# novasphere

Open-source, AI-native SaaS dashboard template with **Liquid Glass** aesthetics, **Generative UI** (Bento Grid), and a pluggable **agent copilot**. Built as a pnpm workspace monorepo; each package is independently publishable and usable on its own. Runs fully offline by default (Ollama + Qwen2.5 0.5B); external AI (Claude, OpenAI) is opt-in via env.

## Quick start

```bash
git clone https://github.com/your-org/novasphere.git
cd novasphere
pnpm install
ollama pull qwen2.5:0.5b   # optional — for local AI; demo works with mock
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000). The demo app runs at `apps/demo`.

## Monorepo structure

```
novasphere/
├── apps/
│   └── demo/                 # Next.js 16 App Router demo (not published)
├── packages/
│   ├── tokens/               # @novasphere/tokens — design tokens, Tailwind 4 @theme
│   ├── agent-core/           # @novasphere/agent-core — AI adapter system
│   ├── tenant-core/          # @novasphere/tenant-core — multi-tenancy
│   ├── ui-glass/             # @novasphere/ui-glass — Liquid Glass components
│   ├── ui-bento/             # @novasphere/ui-bento — Bento Grid layout
│   ├── ui-charts/            # @novasphere/ui-charts — chart components
│   ├── ui-agent/             # @novasphere/ui-agent — Copilot Panel UI
│   ├── ui-auth/               # @novasphere/ui-auth — auth UI (adapter-based)
│   └── ui-shell/             # @novasphere/ui-shell — app shell (Sidebar, Topbar)
├── .storybook/               # Shared Storybook config
├── pnpm-workspace.yaml
└── package.json
```

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| **@novasphere/tokens** | Design token foundation (CSS vars + Tailwind preset). Zero runtime deps. | [![npm](https://img.shields.io/npm/v/@novasphere/tokens.svg)](https://www.npmjs.com/package/@novasphere/tokens) |
| **@novasphere/agent-core** | AI adapter system: interface, factory, Ollama / WebLLM / Claude / OpenAI / Mock adapters. | [![npm](https://img.shields.io/npm/v/@novasphere/agent-core.svg)](https://www.npmjs.com/package/@novasphere/agent-core) |
| **@novasphere/tenant-core** | Multi-tenancy: TenantConfig, registry, resolver. Framework-agnostic. | [![npm](https://img.shields.io/npm/v/@novasphere/tenant-core.svg)](https://www.npmjs.com/package/@novasphere/tenant-core) |
| **@novasphere/ui-glass** | Liquid Glass components (GlassCard, GlassPanel, AmbientBackground, GrainOverlay) + primitives. | [![npm](https://img.shields.io/npm/v/@novasphere/ui-glass.svg)](https://www.npmjs.com/package/@novasphere/ui-glass) |
| **@novasphere/ui-bento** | Bento Grid: BentoGrid, BentoCard, BentoSpan; drag-to-reorder; layout config–driven. | [![npm](https://img.shields.io/npm/v/@novasphere/ui-bento.svg)](https://www.npmjs.com/package/@novasphere/ui-bento) |
| **@novasphere/ui-charts** | Glass-styled Recharts: SparklineChart, DonutChart, AreaChart, HeatmapChart. | [![npm](https://img.shields.io/npm/v/@novasphere/ui-charts.svg)](https://www.npmjs.com/package/@novasphere/ui-charts) |
| **@novasphere/ui-agent** | Copilot Panel UI: messages, input, suggestions, adapter status. Uses AgentAdapter only. | [![npm](https://img.shields.io/npm/v/@novasphere/ui-agent.svg)](https://www.npmjs.com/package/@novasphere/ui-agent) |
| **@novasphere/ui-auth** | Auth UI (LoginForm, UserMenu, AuthGuard) wired to an AuthAdapter. | [![npm](https://img.shields.io/npm/v/@novasphere/ui-auth.svg)](https://www.npmjs.com/package/@novasphere/ui-auth) |
| **@novasphere/ui-shell** | App shell: AppShell, Sidebar, Topbar, NavItem, BreadcrumbBar. Tenant-aware. | [![npm](https://img.shields.io/npm/v/@novasphere/ui-shell.svg)](https://www.npmjs.com/package/@novasphere/ui-shell) |

Each package has its own README and, where applicable, Storybook. From repo root:

- `pnpm dev` — run demo app
- `pnpm storybook` — run Storybook (default port 6002, ui-glass)
- `pnpm build` — build all packages
- `pnpm test` — run all package tests

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, adding adapters, bento modules, tenants, commit format, and the changeset workflow.

## License

MIT.
