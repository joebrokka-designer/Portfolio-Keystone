// Behavior layer: which state shows what. Colors and type come only from MetricCard.styles.ts.
import { cssVar } from "../../../dist/index";
import type { Measure } from "../../foundations/brands";
import { styles } from "./MetricCard.styles";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY";

/**
 * How to display the value.
 * - `"number"`: a plain count or amount, grouped by locale (12,480).
 * - `"percent"`: the value is a fraction, so pass 0.124 to show 12.4%.
 * - `"currency:USD"` and the like: money. The currency code is part of the format, so it can't be forgotten.
 */
export type ValueFormat = "number" | "percent" | `currency:${CurrencyCode}`;

/**
 * Whether going up is good news. It changes the words a screen reader hears, never the color:
 * direction is shown by the arrow and sign, because "down" is not the same as "danger".
 */
export type Polarity = "up-is-good" | "down-is-good" | "neutral";

/** A change against a baseline. The delta is meaningless without the baseline, so they travel together. */
export type Comparison = {
  /** Relative change as a fraction: -0.12 means down 12%. */
  delta: Measure;
  /** What the change is measured against, written as it should read: "vs. last month". */
  baseline: string;
  polarity: Polarity;
};

/**
 * One headline number with its label, and optionally how it changed.
 *
 * Usage:
 * - Use for a single number someone checks at a glance: revenue, active users, churn. For
 *   several related numbers, use several cards in a row, not one card with a list.
 * - Always pass the state the data is actually in. Show `loading` while the query runs;
 *   never show a zero as a placeholder, because zero is a real value.
 * - Use `empty` when the query succeeded but there is nothing to count ("No orders in this
 *   date range"), and `error` when it failed. They mean different things to the reader.
 * - Values come from `toMeasure()`, so a NaN from a bad query fails loudly instead of rendering.
 *
 * There is no `className` or `style` prop. The card's look is part of the design system;
 * to change it, change the `kpi.*` tokens.
 */
export type MetricCardProps =
  | { status: "loading"; label: string }
  | { status: "error"; label: string; /** What went wrong, in words the reader can act on. */ error: string }
  | { status: "empty"; label: string; /** Why there's no number, e.g. "No orders in this date range". */ reason: string }
  | { status: "ready"; label: string; value: Measure; format: ValueFormat; comparison?: Comparison };

export function MetricCard(props: MetricCardProps) {
  return (
    <section style={styles.card} aria-busy={props.status === "loading"}>
      <p style={styles.label}>{props.label}</p>
      <Body {...props} />
    </section>
  );
}

function Body(props: MetricCardProps) {
  switch (props.status) {
    case "loading":
      return <div style={styles.placeholder} role="status" aria-label="Loading" />;
    case "error":
      return <p style={styles.note} role="alert"><span style={styles.errorIcon} aria-hidden>!</span> {props.error}</p>;
    case "empty":
      return <p style={styles.note}>{props.reason}</p>;
    case "ready":
      return (
        <>
          <p style={styles.value}>{formatValue(props.value, props.format)}</p>
          {props.comparison && <Delta {...props.comparison} />}
        </>
      );
    default:
      return assertNever(props);
  }
}

type Direction = "increase" | "decrease" | "unchanged";
const ARROWS = { increase: "▲", decrease: "▼", unchanged: "–" } satisfies Record<Direction, string>;

function Delta({ delta, baseline, polarity }: Comparison) {
  const direction: Direction = delta > 0 ? "increase" : delta < 0 ? "decrease" : "unchanged";
  const amount = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 }).format(Math.abs(delta));
  return (
    <p style={styles.delta} aria-label={spoken(direction, amount, baseline, polarity)}>
      <span style={{ color: cssVar(`color.icon.delta.${direction}`) }} aria-hidden>{ARROWS[direction]}</span>
      <span style={{ color: cssVar(`color.text.delta.${direction}`) }}>{amount}</span>
      <span style={styles.note}>{baseline}</span>
    </p>
  );
}

function spoken(direction: Direction, amount: string, baseline: string, polarity: Polarity): string {
  if (direction === "unchanged") return `Unchanged ${baseline}`;
  const verb = direction === "increase" ? "Up" : "Down";
  const good = (direction === "increase") === (polarity === "up-is-good");
  const judgement = polarity === "neutral" ? "" : good ? ", an improvement" : ", a decline";
  return `${verb} ${amount} ${baseline}${judgement}`;
}

function formatValue(value: Measure, format: ValueFormat): string {
  if (format === "number") return new Intl.NumberFormat().format(value);
  if (format === "percent") return new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 }).format(value);
  const currency = format.slice("currency:".length);
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function assertNever(x: never): never {
  throw new Error(`Unhandled MetricCard state: ${JSON.stringify(x)}`);
}
