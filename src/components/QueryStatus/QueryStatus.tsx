// YOUR TURN: QueryStatus, the line above a chart that says what its query is doing.
// Two states work already. You add the other three, one at a time.
//
// For each state you do three things, in this order:
//   A. add its line to the type (Part 1)
//   B. run `npm run typecheck:components` and read the error: TypeScript will point
//      at `assertNever` at the bottom, because you described a state the component doesn't show yet.
//   C. add its case to the switch (Part 2), run again, and the error goes away.
// That error in step B is lesson 1's assertNever, catching a real gap for you.
//
// Storybook updates as you save. Keep it open (`npm run storybook`) to watch each state appear.

import type { ReactNode } from "react";
import type { Count, Fraction, Measure } from "../../foundations/brands";
import { dot, fill, styles, type Tone } from "./QueryStatus.styles";

// ---------------------------------------------------------------------------
// PART 1: the states (your union from lesson 1, now with checked values)
// ---------------------------------------------------------------------------

/**
 * What the query behind a chart or table is doing. Put it directly above the thing it describes.
 *
 * Usage:
 * - Always show it for queries that can take longer than a second, so a blank chart is never a mystery.
 * - Use `failed` with `retryable: true` only when trying again could work (a timeout, a busy warehouse),
 *   and `retryable: false` when it can't (a permission error). The UI offers "Try again" only for the first.
 * - `cancelled` is not a failure: say who stopped it, and don't use the danger color.
 */
export type QueryStatusProps =
  | { status: "idle" }
  | { status: "running"; startedAt: Date; progress?: Fraction }
  // rowCount is a Count (lesson 4) and durationMs is a Measure, not plain numbers.
  | { status: "succeeded"; rowCount: Count; durationMs: Measure }
  | { status: "failed"; message: string; retryable: boolean }
  | { status: "cancelled"; cancelledBy: "user" | "timeout" }
  ;

// ---------------------------------------------------------------------------
// PART 2: what each state shows
// ---------------------------------------------------------------------------

export function QueryStatus(props: QueryStatusProps) {
  switch (props.status) {
    case "idle":
      return <Line tone="neutral" text="Not run yet" />;

    case "running":
      return (
        <Line tone="info" text={props.progress === undefined ? "Running…" : `Running… ${percent(props.progress)}`}>
          {props.progress !== undefined && <span style={styles.track} aria-hidden><span style={fill(props.progress)} /></span>}
        </Line>
      );

    case "succeeded":
      return <Line tone="success" text={`${formatRows(props.rowCount)} in ${formatDuration(props.durationMs)}`} />;

    case "failed":
      return <Line tone="danger" text={props.retryable ? `${props.message}. Try again.` : props.message} />;

    case "cancelled":
      return <Line tone="neutral" text={props.cancelledBy === "user" ? "Cancelled" : "Stopped: took too long"} />;

    default:
      return assertNever(props);
  }
}

// ---------------------------------------------------------------------------
// Helpers (already done)
// ---------------------------------------------------------------------------

function Line({ tone, text, children }: { tone: Tone; text: string; children?: ReactNode }) {
  return (
    <p style={styles.strip} role="status">
      <span style={dot(tone)} aria-hidden />
      <span>{text}</span>
      {children}
    </p>
  );
}

function percent(share: Fraction): string {
  return `${Math.round(share * 100)}%`;
}

function formatRows(n: Count): string {
  return `${n.toLocaleString()} ${n === 1 ? "row" : "rows"}`;
}

function formatDuration(ms: Measure): string {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`;
}

function assertNever(x: never): never {
  throw new Error(`Unhandled QueryStatus state: ${JSON.stringify(x)}`);
}

