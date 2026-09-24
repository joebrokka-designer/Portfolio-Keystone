// The contract, as code: things an agent might write, and whether they compile.
// `npm run typecheck:components` fails if any @ts-expect-error line stops being an error.
import { toMeasure } from "../../foundations/brands";
import { MetricCard } from "./MetricCard";

export const valid = [
  <MetricCard status="loading" label="Revenue" />,
  <MetricCard status="empty" label="Revenue" reason="No orders in this date range" />,
  <MetricCard status="error" label="Revenue" error="The sales warehouse didn't respond. Try again in a minute." />,
  <MetricCard status="ready" label="Revenue" value={toMeasure(128400)} format="currency:USD" />,
  <MetricCard
    status="ready" label="Churn" value={toMeasure(0.031)} format="percent"
    comparison={{ delta: toMeasure(-0.12), baseline: "vs. last month", polarity: "down-is-good" }}
  />,
];

export const invalid = [
  // @ts-expect-error: a loading card has no value (lesson 1)
  <MetricCard status="loading" label="Revenue" value={toMeasure(0)} />,
  // @ts-expect-error: a ready card needs a format
  <MetricCard status="ready" label="Revenue" value={toMeasure(128400)} />,
  // @ts-expect-error: money without a currency (lesson 2: the code is part of the format)
  <MetricCard status="ready" label="Revenue" value={toMeasure(128400)} format="currency" />,
  // @ts-expect-error: BTC isn't a supported currency
  <MetricCard status="ready" label="Revenue" value={toMeasure(128400)} format="currency:BTC" />,
  // @ts-expect-error: a raw number from an API hasn't been checked (lesson 4)
  <MetricCard status="ready" label="Revenue" value={128400} format="number" />,
  // @ts-expect-error: a delta without its baseline
  <MetricCard status="ready" label="Churn" value={toMeasure(0.031)} format="percent" comparison={{ delta: toMeasure(-0.12), polarity: "down-is-good" }} />,
  // @ts-expect-error: no className escape hatch
  <MetricCard status="loading" label="Revenue" className="text-red-500" />,
  // @ts-expect-error: no inline style escape hatch
  <MetricCard status="loading" label="Revenue" style={{ color: "red" }} />,
];
