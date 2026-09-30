import { useState, type CSSProperties } from "react";
import { toCount, toFraction, toHighConfidence, toLowConfidence, toMeasure, toMediumConfidence } from "../foundations/brands";
import { ChartFrame, type ChartFrameProps } from "../components/ChartFrame/ChartFrame";
import { ConfidenceBadge, type ConfidenceBadgeProps } from "../components/ConfidenceBadge/ConfidenceBadge";
import { DataTable, type DataTableProps } from "../components/DataTable/DataTable";
import { EmptyState, type EmptyStateProps } from "../components/EmptyState/EmptyState";
import { FilterBar, type FilterBarProps } from "../components/FilterBar/FilterBar";
import { MetricCard, type MetricCardProps } from "../components/MetricCard/MetricCard";
import { ProvenancePopover, type ProvenancePopoverProps } from "../components/ProvenancePopover/ProvenancePopover";
import { QueryStatus, type QueryStatusProps } from "../components/QueryStatus/QueryStatus";

const noop = () => {};
const retrievedAt = new Date("2026-09-23T18:40:00");

const tableColumns = [
  { id: "region", header: "Region", kind: "text" as const },
  { id: "revenue", header: "Revenue", kind: "number" as const, format: "currency:USD" as const },
] as const;
const tableRows = [
  { id: "west", cells: [{ columnId: "region", kind: "text" as const, value: "West" }, { columnId: "revenue", kind: "number" as const, value: toMeasure(84200) }] },
  { id: "east", cells: [{ columnId: "region", kind: "text" as const, value: "East" }, { columnId: "revenue", kind: "number" as const, value: toMeasure(44200) }] },
] as const;

const metric: Record<string, MetricCardProps> = {
  ready: { status: "ready", label: "Revenue", value: toMeasure(128400), format: "currency:USD", comparison: { delta: toMeasure(0.082), baseline: "vs. last month", polarity: "up-is-good" } },
  loading: { status: "loading", label: "Revenue" },
  empty: { status: "empty", label: "Revenue", reason: "No orders in this date range" },
  error: { status: "error", label: "Revenue", error: "The sales warehouse didn't respond. Try again in a minute." },
};

const query: Record<string, QueryStatusProps> = {
  idle: { status: "idle" },
  running: { status: "running", startedAt: retrievedAt, progress: toFraction(0.4) },
  succeeded: { status: "succeeded", rowCount: toCount(1204), durationMs: toMeasure(380) },
  "failed, can retry": { status: "failed", message: "The warehouse timed out", retryable: true, onRetry: noop },
  "failed, can't retry": { status: "failed", message: "You don't have access to this dataset", retryable: false },
  "cancelled by user": { status: "cancelled", cancelledBy: "user" },
  "cancelled, took too long": { status: "cancelled", cancelledBy: "timeout" },
};

const table: Record<string, DataTableProps> = {
  ready: { status: "ready", caption: "Revenue by region", columns: tableColumns, rows: tableRows },
  loading: { status: "loading", caption: "Revenue by region" },
  empty: { status: "empty", caption: "Revenue by region", columns: tableColumns, reason: "No orders in this date range" },
  "error, can retry": { status: "error", caption: "Revenue by region", message: "The warehouse timed out", retryable: true, onRetry: noop },
  "error, can't retry": { status: "error", caption: "Revenue by region", message: "You don't have access to this dataset", retryable: false },
};

const chart: Record<string, ChartFrameProps> = {
  ready: {
    status: "ready",
    title: "Revenue by week",
    plot: <div style={{ height: "8em", background: "var(--adjoin-color-background-surface-sunken)", borderRadius: "var(--adjoin-radius-control)" }} />,
    legend: [{ label: "This year", series: "1" }, { label: "Last year", series: "2" }],
  },
  loading: { status: "loading", title: "Revenue by week" },
  empty: { status: "empty", title: "Revenue by week", reason: "No orders in this date range" },
  "error, can retry": { status: "error", title: "Revenue by week", message: "The warehouse timed out", retryable: true, onRetry: noop },
  "error, can't retry": { status: "error", title: "Revenue by week", message: "You don't have access to this dataset", retryable: false },
};

const filters: Record<string, FilterBarProps> = {
  idle: { status: "idle", available: [{ id: "region", label: "Region" }, { id: "plan", label: "Plan" }], onApply: noop },
  filtered: {
    status: "filtered",
    applied: [{ id: "region", label: "Region", value: "West" }],
    available: [{ id: "plan", label: "Plan" }],
    onApply: noop,
    onRemove: noop,
    onClear: noop,
  },
  loading: { status: "loading" },
};

const empty: Record<string, EmptyStateProps> = {
  "no data": { reason: "no-data", title: "No orders yet", description: "Orders placed this month will show up here." },
  "no results": { reason: "no-results", title: "No matching rows", description: "Those filters removed every row.", onClearFilters: noop },
  "no access": { reason: "no-access", title: "You can't view this dataset", description: "Ask an admin for access to the sales warehouse." },
  "failed, can retry": { reason: "failed", title: "The query didn't finish", description: "The warehouse timed out.", retryable: true, onRetry: noop },
  "failed, can't retry": { reason: "failed", title: "This query can't run", description: "The dataset was removed.", retryable: false },
};

const confidence: Record<string, ConfidenceBadgeProps> = {
  high: { level: "high", score: toHighConfidence(0.92) },
  medium: { level: "medium", score: toMediumConfidence(0.71) },
  low: { level: "low", score: toLowConfidence(0.38), reason: "Only 12 matching rows" },
};

const provenanceOptions = ["closed", "open", "unavailable"] as const;

const styles = {
  layout: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 16rem", gap: "var(--adjoin-space-inset-lg)", alignItems: "start" },
  canvas: { display: "flex", flexDirection: "column", gap: "var(--adjoin-space-stack-md)" },
  row: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "var(--adjoin-space-inset-md)" },
  pair: { display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)", gap: "var(--adjoin-space-inset-md)" },
  side: {
    position: "sticky",
    top: "var(--adjoin-space-inset-md)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--adjoin-space-stack-sm)",
    padding: "var(--adjoin-space-inset-md)",
    background: "var(--adjoin-color-background-surface-default)",
    border: "var(--adjoin-size-stroke-default) solid var(--adjoin-color-border-subtle)",
    borderRadius: "var(--adjoin-radius-container)",
  },
  heading: { font: "var(--adjoin-typography-label-default)", letterSpacing: "var(--adjoin-typography-label-default-letter-spacing)", color: "var(--adjoin-color-text-subtle)", margin: 0 },
  field: { display: "flex", flexDirection: "column", gap: "var(--adjoin-space-stack-xs)" },
  label: { font: "var(--adjoin-typography-label-small)", letterSpacing: "var(--adjoin-typography-label-small-letter-spacing)", color: "var(--adjoin-color-text-default)" },
  select: {
    font: "var(--adjoin-typography-body-small)",
    color: "var(--adjoin-color-text-default)",
    background: "var(--adjoin-color-background-surface-default)",
    border: "var(--adjoin-size-stroke-default) solid var(--adjoin-color-border-default)",
    borderRadius: "var(--adjoin-radius-control)",
    padding: "var(--adjoin-space-inset-xs) var(--adjoin-space-inset-sm)",
  },
} satisfies Record<string, CSSProperties>;

function StateSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (next: string) => void }) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{label}</span>
      <select style={styles.select} value={value} onChange={event => onChange(event.target.value)}>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function pick<T>(options: Record<string, T>, key: string): T {
  return options[key] ?? Object.values(options)[0];
}

function provenanceProps(state: string, onToggle: () => void): ProvenancePopoverProps {
  if (state === "unavailable") {
    return { status: "unavailable", label: "Forecast", reason: "This number was typed in; no query recorded it." };
  }
  return {
    status: "available",
    label: "Revenue",
    source: "Billing warehouse",
    dataset: "orders.daily",
    retrievedAt,
    expanded: state === "open",
    onToggle,
  };
}

export function ComponentGallery() {
  const [metricState, setMetricState] = useState("ready");
  const [queryState, setQueryState] = useState("succeeded");
  const [tableState, setTableState] = useState("ready");
  const [chartState, setChartState] = useState("ready");
  const [filterState, setFilterState] = useState("filtered");
  const [emptyState, setEmptyState] = useState("no results");
  const [confidenceState, setConfidenceState] = useState("high");
  const [provenanceState, setProvenanceState] = useState("open");

  return (
    <div style={styles.layout}>
      <div style={styles.canvas}>
        <FilterBar {...pick(filters, filterState)} />
        <QueryStatus {...pick(query, queryState)} />
        <div style={styles.row}>
          <MetricCard {...pick(metric, metricState)} />
          <MetricCard status="ready" label="Churn" value={toMeasure(0.031)} format="percent" comparison={{ delta: toMeasure(-0.12), baseline: "vs. last month", polarity: "down-is-good" }} />
          <div>
            <ConfidenceBadge {...pick(confidence, confidenceState)} />
            <ProvenancePopover {...provenanceProps(provenanceState, () => setProvenanceState(current => current === "open" ? "closed" : "open"))} />
          </div>
        </div>
        <div style={styles.pair}>
          <ChartFrame {...pick(chart, chartState)} />
          <DataTable {...pick(table, tableState)} />
        </div>
        <EmptyState {...pick(empty, emptyState)} />
      </div>
      <aside style={styles.side} aria-label="State preview">
        <p style={styles.heading}>Preview state</p>
        <StateSelect label="FilterBar" value={filterState} options={Object.keys(filters)} onChange={setFilterState} />
        <StateSelect label="QueryStatus" value={queryState} options={Object.keys(query)} onChange={setQueryState} />
        <StateSelect label="MetricCard" value={metricState} options={Object.keys(metric)} onChange={setMetricState} />
        <StateSelect label="ConfidenceBadge" value={confidenceState} options={Object.keys(confidence)} onChange={setConfidenceState} />
        <StateSelect label="ProvenancePopover" value={provenanceState} options={provenanceOptions} onChange={setProvenanceState} />
        <StateSelect label="ChartFrame" value={chartState} options={Object.keys(chart)} onChange={setChartState} />
        <StateSelect label="DataTable" value={tableState} options={Object.keys(table)} onChange={setTableState} />
        <StateSelect label="EmptyState" value={emptyState} options={Object.keys(empty)} onChange={setEmptyState} />
      </aside>
    </div>
  );
}
