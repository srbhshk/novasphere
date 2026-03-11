# @novasphere/ui-glass

Liquid Glass component system and the core visual aesthetic of novasphere. It provides glass-styled cards, panels, ambient background, and grain overlay, plus shadcn-based primitives (Button, Input, Label, Popover, Avatar) so you can build consistent UI in any React app.

## Install

```bash
npm install @novasphere/ui-glass @novasphere/tokens
```

## Usage

Use the design tokens in your app (e.g. in `globals.css` and `tailwind.config.ts`), then render glass components:

```tsx
import { GlassCard, GlassPanel, AmbientBackground, GrainOverlay } from "@novasphere/ui-glass";

export function Dashboard() {
  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <GrainOverlay />
      <GlassCard variant="medium" className="p-6">
        <h2>Overview</h2>
        <p>Content in a glass card.</p>
      </GlassCard>
      <GlassPanel variant="strong" header={<span>Header</span>}>
        Panel body content
      </GlassPanel>
    </div>
  );
}
```

## Exports

| Export | Description |
|--------|-------------|
| `GlassCard` | Glass-styled card with `variant`: `subtle` \| `medium` \| `strong`, optional `highlight` |
| `GlassPanel` | Glass panel with optional `header` / `footer`, `variant` as above |
| `AmbientBackground` | Animated gradient background layer |
| `GrainOverlay` | Grain texture overlay |
| `Input`, `Button`, `Label` | Form primitives (shadcn) |
| `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor` | Popover primitive |
| `Avatar`, `AvatarImage`, `AvatarFallback` | Avatar primitive |
| `GlassCardProps`, `GlassCardVariant`, `GlassPanelProps`, `GlassPanelVariant` | Types |

## Storybook

[Storybook — ui-glass](https://github.com/your-org/novasphere#storybook) (run `pnpm storybook` from repo root; ui-glass is on port 6002).
