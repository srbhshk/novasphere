/**
 * nova.config.ts
 *
 * Top-level configuration for the novasphere monorepo.
 * Future versions of the novasphere CLI will generate this file.
 * Change values here to customise the demo app and package defaults.
 *
 * Rules (from .cursor/rules/novasphere-rules.mdc Section 18):
 * - This is the ONLY place top-level values are defined.
 * - Components and packages read config via useNovaConfig() in apps/demo — they never import this file directly.
 * - Packages accept config values as props — they are never hardwired to nova.config.ts.
 * - Adding a feature flag: add here, add to NovaConfig type, add a Storybook story variant, document in README.
 */

export const novaConfig = {
  project: {
    name: 'novasphere',
    version: '0.1.0',
  },
  theme: {
    accentColor: '#4f8ef7', // primary brand colour
    accentColor2: '#a78bfa', // secondary
    accentColor3: '#34d399', // success / positive
    glassBlur: 'lg', // 'sm' | 'md' | 'lg'
    borderRadius: 'md', // 'sm' | 'md' | 'lg' | 'xl'
    darkMode: false, // false = light mode default
  },
  agent: {
    adapter: 'auto', // 'auto'|'ollama'|'webllm'|'claude'|'openai'|'mock'
    name: 'Nova', // display name of the copilot
    avatarEmoji: '🤖',
    ollamaModel: 'qwen2.5:0.5b',
    showAdapterStatus: true, // show engine badge in CopilotPanel
  },
  tenant: {
    mode: 'static', // 'static' | 'dynamic'
    defaultTenantId: 'demo',
  },
  features: {
    bentoReorder: true, // drag-to-reorder bento cards
    generativeLayout: true, // agent can restructure layout
    multiTenant: false, // tenant switching UI
    authEnabled: false, // show auth UI in demo
  },
} as const

export type NovaConfig = typeof novaConfig
