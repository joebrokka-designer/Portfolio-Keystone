import { useState, type CSSProperties, type ReactNode } from "react";
import {
  ChartFrame,
  ConfidenceBadge,
  DataTable,
  FilterBar,
  MetricCard,
  ProvenancePopover,
  QueryStatus,
  toCount,
  toHighConfidence,
  toMeasure,
  toMediumConfidence,
  type AppliedFilter,
  type AvailableFilter,
  type Column,
  type DataRow,
  type LegendItem,
} from "../index";

const AVAILABLE_FILTERS: readonly AvailableFilter[] = [
  { id: "region", label: "Region" },
  { id: "segment", label: "Segment" },
  { id: "channel", label: "Channel" },
  { id: "rep", label: "Rep" },
];

const FILTER_VALUES: Record<string, string> = {
  region: "North America",
  segment: "Enterprise",
  channel: "Direct",
  rep: "All reps",
};

const INITIAL_APPLIED: readonly [AppliedFilter, ...AppliedFilter[]] = [
  { id: "region", label: "Region", value: "North America" },
  { id: "segment", label: "Segment", value: "Enterprise" },
];

const TABLE_COLUMNS = [
  { id: "account", header: "Account", kind: "text" as const },
  { id: "stage", header: "Stage", kind: "text" as const },
  { id: "arr", header: "ARR", kind: "number" as const, format: "currency:USD" as const },
  { id: "winRate", header: "Win rate", kind: "number" as const, format: "percent" as const },
  { id: "deals", header: "Open deals", kind: "number" as const, format: "number" as const },
] as const satisfies readonly [Column, ...Column[]];

const TABLE_ROWS = [
  {
    id: "acme",
    cells: [
      { columnId: "account", kind: "text" as const, value: "Acme Robotics" },
      { columnId: "stage", kind: "text" as const, value: "Negotiation" },
      { columnId: "arr", kind: "number" as const, value: toMeasure(312000) },
      { columnId: "winRate", kind: "number" as const, value: toMeasure(0.64) },
      { columnId: "deals", kind: "number" as const, value: toMeasure(4) },
    ],
  },
  {
    id: "northwind",
    cells: [
      { columnId: "account", kind: "text" as const, value: "Northwind Health" },
      { columnId: "stage", kind: "text" as const, value: "Proposal" },
      { columnId: "arr", kind: "number" as const, value: toMeasure(188500) },
      { columnId: "winRate", kind: "number" as const, value: toMeasure(0.51) },
      { columnId: "deals", kind: "number" as const, value: toMeasure(7) },
    ],
  },
  {
    id: "globex",
    cells: [
      { columnId: "account", kind: "text" as const, value: "Globex Logistics" },
      { columnId: "stage", kind: "text" as const, value: "Discovery" },
      { columnId: "arr", kind: "number" as const, value: toMeasure(96500) },
      { columnId: "winRate", kind: "number" as const, value: toMeasure(0.38) },
      { columnId: "deals", kind: "number" as const, value: toMeasure(3) },
    ],
  },
  {
    id: "initech",
    cells: [
      { columnId: "account", kind: "text" as const, value: "Initech SaaS" },
      { columnId: "stage", kind: "text" as const, value: "Closed won" },
      { columnId: "arr", kind: "number" as const, value: toMeasure(245000) },
      { columnId: "winRate", kind: "number" as const, value: toMeasure(0.72) },
      { columnId: "deals", kind: "number" as const, value: toMeasure(2) },
    ],
  },
  {
    id: "umbrella",
    cells: [
      { columnId: "account", kind: "text" as const, value: "Umbrella Retail" },
      { columnId: "stage", kind: "text" as const, value: "Negotiation" },
      { columnId: "arr", kind: "number" as const, value: toMeasure(142000) },
      { columnId: "winRate", kind: "number" as const, value: toMeasure(0.57) },
      { columnId: "deals", kind: "number" as const, value: toMeasure(5) },
    ],
  },
] as const satisfies readonly [DataRow, ...DataRow[]];

const CHART_LEGEND: readonly LegendItem[] = [
  { label: "Closed ARR", series: "1" },
  { label: "Pipeline ARR", series: "2" },
];

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"] as const;
const CLOSED_BARS = [0.42, 0.55, 0.48, 0.68, 0.61, 0.78] as const;
const PIPELINE_BARS = [0.7, 0.62, 0.74, 0.58, 0.81, 0.66] as const;

const retrievedAt = new Date("2026-09-29T14:22:00");

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--adjoin-space-stack-md)",
    padding: "var(--adjoin-space-inset-lg)",
    maxWidth: "72rem",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--adjoin-space-stack-xs)",
  },
  title: {
    margin: 0,
    font: "var(--adjoin-typography-heading-1)",
    color: "var(--adjoin-color-text-default)",
  },
  subtitle: {
    margin: 0,
    font: "var(--adjoin-typography-body-default)",
    color: "var(--adjoin-color-text-subtle)",
  },
  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "var(--adjoin-space-inset-md)",
  },
  metricBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--adjoin-space-stack-xs)",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "var(--adjoin-space-inset-sm)",
  },
  split: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
    gap: "var(--adjoin-space-inset-md)",
    alignItems: "start",
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--adjoin-space-stack-sm)",
  },
  plot: {
    display: "flex",
    alignItems: "flex-end",
    gap: "0.75rem",
    height: "12rem",
    padding: "var(--adjoin-space-inset-sm) 0",
  },
  month: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.35rem",
    minWidth: 0,
  },
  bars: {
    display: "flex",
    alignItems: "flex-end",
    gap: "0.2rem",
    width: "100%",
    height: "100%",
  },
  barClosed: {
    flex: 1,
    borderRadius: "var(--adjoin-radius-control) var(--adjoin-radius-control) 0 0",
    background: "var(--adjoin-color-mark-categorical-1)",
  },
  barPipeline: {
    flex: 1,
    borderRadius: "var(--adjoin-radius-control) var(--adjoin-radius-control) 0 0",
    background: "var(--adjoin-color-mark-categorical-2)",
  },
  monthLabel: {
    font: "var(--adjoin-typography-label-small)",
    letterSpacing: "var(--adjoin-typography-label-small-letter-spacing)",
    color: "var(--adjoin-color-text-subtle)",
  },
} satisfies Record<string, CSSProperties>;

function RevenuePlot() {
  return (
    <div style={styles.plot} role="img" aria-label="Closed ARR and pipeline ARR by month from April through September">
      {MONTHS.map((month, index) => (
        <div key={month} style={styles.month}>
          <div style={styles.bars}>
            <div style={{ ...styles.barClosed, height: `${CLOSED_BARS[index] * 100}%` }} />
            <div style={{ ...styles.barPipeline, height: `${PIPELINE_BARS[index] * 100}%` }} />
          </div>
          <span style={styles.monthLabel}>{month}</span>
        </div>
      ))}
    </div>
  );
}

export function MetricsDashboard() {
  const [applied, setApplied] = useState<readonly AppliedFilter[]>(INITIAL_APPLIED);
  const [revenueSourceOpen, setRevenueSourceOpen] = useState(false);
  const [forecastSourceOpen, setForecastSourceOpen] = useState(false);

  const appliedIds = new Set(applied.map(filter => filter.id));
  const available = AVAILABLE_FILTERS.filter(filter => !appliedIds.has(filter.id));

  const applyFilter = (id: string) => {
    const filter = AVAILABLE_FILTERS.find(item => item.id === id);
    if (!filter || appliedIds.has(id)) return;
    setApplied(current => [...current, { id: filter.id, label: filter.label, value: FILTER_VALUES[id] ?? "All" }]);
  };

  const removeFilter = (id: string) => {
    setApplied(current => current.filter(filter => filter.id !== id));
  };

  const clearFilters = () => {
    setApplied([]);
  };

  let filterBar: ReactNode;
  if (applied.length === 0) {
    filterBar = <FilterBar status="idle" available={AVAILABLE_FILTERS} onApply={applyFilter} />;
  } else {
    const [first, ...rest] = applied;
    filterBar = (
      <FilterBar
        status="filtered"
        applied={[first, ...rest]}
        available={available}
        onApply={applyFilter}
        onRemove={removeFilter}
        onClear={clearFilters}
      />
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Sales performance</h1>
        <p style={styles.subtitle}>Enterprise pipeline for the current quarter, refreshed from the CRM warehouse.</p>
      </header>

      {filterBar}

      <QueryStatus status="succeeded" rowCount={toCount(1284)} durationMs={toMeasure(420)} />

      <section style={styles.metrics} aria-label="Headline metrics">
        <div style={styles.metricBlock}>
          <MetricCard
            status="ready"
            label="Closed ARR"
            value={toMeasure(1284000)}
            format="currency:USD"
            comparison={{ delta: toMeasure(0.124), baseline: "vs. last quarter", polarity: "up-is-good" }}
          />
          <div style={styles.metaRow}>
            <ProvenancePopover
              status="available"
              label="Source"
              source="CRM warehouse"
              dataset="sales.closed_arr_daily"
              retrievedAt={retrievedAt}
              expanded={revenueSourceOpen}
              onToggle={() => setRevenueSourceOpen(open => !open)}
            />
          </div>
        </div>

        <div style={styles.metricBlock}>
          <MetricCard
            status="ready"
            label="Pipeline coverage"
            value={toMeasure(3.4)}
            format="number"
            comparison={{ delta: toMeasure(0.08), baseline: "vs. target", polarity: "up-is-good" }}
          />
          <div style={styles.metaRow}>
            <ConfidenceBadge level="high" score={toHighConfidence(0.91)} />
          </div>
        </div>

        <div style={styles.metricBlock}>
          <MetricCard
            status="ready"
            label="Win rate"
            value={toMeasure(0.286)}
            format="percent"
            comparison={{ delta: toMeasure(-0.021), baseline: "vs. last quarter", polarity: "up-is-good" }}
          />
          <div style={styles.metaRow}>
            <ProvenancePopover
              status="available"
              label="Source"
              source="Opportunity history"
              dataset="sales.opportunity_outcomes"
              retrievedAt={retrievedAt}
              expanded={forecastSourceOpen}
              onToggle={() => setForecastSourceOpen(open => !open)}
            />
          </div>
        </div>

        <div style={styles.metricBlock}>
          <MetricCard
            status="ready"
            label="Q4 forecast"
            value={toMeasure(2140000)}
            format="currency:USD"
            comparison={{ delta: toMeasure(0.046), baseline: "vs. plan", polarity: "up-is-good" }}
          />
          <div style={styles.metaRow}>
            <ConfidenceBadge level="medium" score={toMediumConfidence(0.68)} />
          </div>
        </div>
      </section>

      <div style={styles.split}>
        <div style={styles.stack}>
          <ChartFrame
            status="ready"
            title="ARR by month"
            plot={<RevenuePlot />}
            legend={CHART_LEGEND}
          />
        </div>
        <DataTable
          status="ready"
          caption="Top open accounts"
          columns={TABLE_COLUMNS}
          rows={TABLE_ROWS}
        />
      </div>
    </main>
  );
}
