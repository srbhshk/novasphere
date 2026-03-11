# @novasphere/ui-bento

Bento Grid layout system. It renders a responsive grid from a `BentoLayoutConfig[]` array and supports drag-to-reorder via Framer Motion. The AI copilot can change the dashboard by emitting a new layout config (Generative UI).

## Install

```bash
npm install @novasphere/ui-bento @novasphere/ui-glass @novasphere/tokens
```

## Usage

Define a layout config and a map of module components; pass them to `BentoGrid`. Optional `onReorder` updates the layout when the user drags cards.

```tsx
import { BentoGrid, BentoCard, type BentoLayoutConfig, type BentoCardModuleProps } from "@novasphere/ui-bento";

function MyModule({ config }: BentoCardModuleProps) {
  return <div className="p-4">{config.title ?? config.moduleId}</div>;
}

const layout: BentoLayoutConfig = [
  { id: "a", colSpan: 4, rowSpan: 1, moduleId: "myModule", title: "Card A", visible: true, order: 0 },
  { id: "b", colSpan: 4, rowSpan: 1, moduleId: "myModule", title: "Card B", visible: true, order: 1 },
  { id: "c", colSpan: 8, rowSpan: 2, moduleId: "myModule", title: "Wide", visible: true, order: 2 },
];

export function Dashboard() {
  const [layoutState, setLayoutState] = useState(layout);
  return (
    <BentoGrid
      layout={layoutState}
      modules={{ myModule: MyModule }}
      onReorder={setLayoutState}
    />
  );
}
```

## Exports

| Export | Description |
|--------|-------------|
| `BentoGrid` | Grid component; accepts `layout`, `modules`, optional `onReorder` |
| `BentoCard` | Single card wrapper; accepts `config`, `children`, optional `isDragging` |
| `BentoSpan` | Grid cell span for empty/custom cells; `colSpan`, `rowSpan`, `children` |
| `BentoLayoutConfig`, `BentoCardConfig`, `BentoCardModuleProps`, `BentoColSpan`, `BentoRowSpan` | Types |
| `BENTO_DEFAULT_COL_SPAN`, `BENTO_DEFAULT_ROW_SPAN` | Constants |

## Storybook

[Storybook — ui-bento](https://github.com/your-org/novasphere#storybook) (run `pnpm storybook` from repo root; ui-bento on port 6003).
