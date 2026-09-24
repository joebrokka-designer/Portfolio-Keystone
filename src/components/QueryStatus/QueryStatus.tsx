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
  // STEP 1: succeeded. Delete the // at the start of the next line.
  //   Notice rowCount is a Count (lesson 4) and durationMs is a Measure, not plain numbers.
  // | { status: "succeeded"; rowCount: Count; durationMs: Measure }

  // STEP 3: failed. Copy your "failed" line from learn/01-your-turn.ts and paste it here.

  // STEP 5: cancelled. Copy your "cancelled" line from learn/01-your-turn.ts and paste it here.
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

    // STEP 2: after STEP 1, delete the // at the start of the next two lines.
    //   It shows "1,204 rows in 0.4 s". formatRows and formatDuration are at the bottom of this file.
    // case "succeeded":
    //   return <Line tone="success" text={`${formatRows(props.rowCount)} in ${formatDuration(props.durationMs)}`} />;

    // STEP 4: after STEP 3, delete the // on the next three lines, then replace ___ with the right tone.
    //   The tones are: "neutral", "info", "success", "danger". Which one means "something went wrong"?
    // case "failed":
    //   return <Line tone=___ text={props.retryable ? `${props.message}. Try again.` : props.message} />;

    // STEP 6: after STEP 5, write this case yourself. Copy the pattern above.
    //   - Use the "neutral" tone: a cancelled query isn't an error.
    //   - For the text: if props.cancelledBy is "user", show "Cancelled". Otherwise show "Stopped: took too long".
    //     Hint: the failed case above uses  something ? "if yes" : "if no". So does this one, with
    //     props.cancelledBy === "user"  as the something.

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

