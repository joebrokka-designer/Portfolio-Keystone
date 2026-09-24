// Lesson 1: discriminated unions.
// Goal: illegal prop *combinations* don't compile, not just illegal values.
// Run `npm run learn`. A clean run means every @ts-expect-error below really is an error.
// Delete one of those comments to see the message TypeScript gives an agent.

// ---- The loose version: every prop optional, every combination "valid" ----

type LooseMetricCardProps = {
  label: string;
  status: "loading" | "error" | "empty" | "ready";
  value?: number;
  error?: string;
  delta?: number;
  baseline?: string;
};

// All of these compile, and all of them are bugs an agent will happily write.
export const loose: LooseMetricCardProps[] = [
  { label: "Revenue", status: "loading", value: 1200 },   // a value while loading?
  { label: "Revenue", status: "ready" },                  // ready, but no value
  { label: "Revenue", status: "ready", value: 1200, delta: -0.12 }, // down 12%... compared with what?
  { label: "Revenue", status: "error" },                  // an error with nothing to say
];

// ---- The contract version: one shape per state, `status` is the discriminant ----

/** How a change should be read. Down is not automatically bad: churn going down is good news. */
type Polarity = "up-is-good" | "down-is-good" | "neutral";

/** A delta is meaningless without its baseline, so they travel together or not at all. */
type Comparison = {
  delta: number;        // fraction: -0.12 means down 12%
  baseline: string;     // "vs. last week", shown next to the delta
  polarity: Polarity;
};

export type MetricCardProps =
  | { status: "loading"; label: string }
  | { status: "error"; label: string; error: string }
  | { status: "empty"; label: string; reason: string }
  | { status: "ready"; label: string; value: number; format: "number" | "currency" | "percent"; comparison?: Comparison };

export const ok: MetricCardProps[] = [
  { status: "loading", label: "Revenue" },
  { status: "ready", label: "Revenue", value: 1200, format: "currency" },
  { status: "ready", label: "Churn", value: 0.031, format: "percent", comparison: { delta: -0.12, baseline: "vs. last month", polarity: "down-is-good" } },
  { status: "empty", label: "Revenue", reason: "No orders in this date range" },
];

// Each of the loose bugs is now a compile error.
export const broken: MetricCardProps[] = [
  // @ts-expect-error: `value` doesn't exist while loading
  { status: "loading", label: "Revenue", value: 1200 },
  // @ts-expect-error: ready requires `value` and `format`
  { status: "ready", label: "Revenue" },
  // @ts-expect-error: a comparison needs its baseline and polarity
  { status: "ready", label: "Revenue", value: 1200, format: "currency", comparison: { delta: -0.12 } },
  // @ts-expect-error: an error state must say what went wrong
  { status: "error", label: "Revenue" },
];

// ---- Narrowing: checking `status` tells TypeScript which shape you have ----

export function describe(props: MetricCardProps): string {
  switch (props.status) {
    case "loading": return `${props.label}: loading`;
    case "error": return `${props.label}: ${props.error}`;      // props.error exists here, and only here
    case "empty": return `${props.label}: ${props.reason}`;
    case "ready": return `${props.label}: ${props.value}`;
    default: return assertNever(props);
  }
}

// If someone adds a fifth status ("stale", say) and forgets a case above, `props` is no longer
// `never` here and the build fails. The union can't grow without every consumer being updated.
function assertNever(x: never): never {
  throw new Error(`Unhandled state: ${JSON.stringify(x)}`);
}
