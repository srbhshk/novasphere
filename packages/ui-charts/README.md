# @novasphere/ui-charts

Glass-styled chart components built on Recharts. SparklineChart, DonutChart, AreaChart, and HeatmapChart with typed data props and built-in loading, empty, and error states.

## Install

```bash
npm install @novasphere/ui-charts @novasphere/ui-glass @novasphere/tokens recharts
```

## Usage

Import the chart you need and pass typed data. Each chart handles `loading` and empty data internally.

```tsx
import {
  SparklineChart,
  DonutChart,
  AreaChart,
  HeatmapChart,
  type SparklineDataPoint,
  type DonutSegment,
  type AreaDataPoint,
  type HeatmapCell,
} from "@novasphere/ui-charts";

const sparkData: SparklineDataPoint[] = [{ value: 10 }, { value: 20 }, { value: 15 }];
const donutData: DonutSegment[] = [{ label: "A", value: 40 }, { label: "B", value: 60 }];
const areaData: AreaDataPoint[] = [{ label: "Mon", value: 4000 }, { label: "Tue", value: 3000 }];

export function Metrics() {
  return (
    <>
      <SparklineChart data={sparkData} height={80} />
      <DonutChart segments={donutData} size={120} />
      <AreaChart data={areaData} height={200} />
      <HeatmapChart cells={[]} loading={false} />
    </>
  );
}
```

## Exports

| Export | Description |
|--------|-------------|
| `SparklineChart` | Line/area sparkline; `data`, `height`, `color`, `loading`, `empty` |
| `DonutChart` | Donut chart; `segments`, `size`, `loading`, `empty` |
| `AreaChart` | Area chart; `data`, `height`, `loading`, `empty` |
| `HeatmapChart` | Heatmap grid; `cells`, `loading`, `empty` |
| `SparklineDataPoint`, `DonutSegment`, `AreaDataPoint`, `HeatmapCell` | Data types |
| `SparklineChartProps`, `DonutChartProps`, `AreaChartProps`, `HeatmapChartProps` | Component prop types |

## Storybook

[Storybook — ui-charts](https://github.com/your-org/novasphere#storybook) (run `pnpm storybook` from repo root; ui-charts on port 6004).
