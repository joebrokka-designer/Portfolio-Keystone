// Behavior layer: which state shows what. Colors and type come only from ChartFrame.styles.ts.
import type { ReactNode } from "react";
import { cssVar } from "../../../dist/index";
import { styles } from "./ChartFrame.styles";

/** A series color that exists as a categorical mark token. "other" is the overflow bucket. */
export type SeriesId = "1" | "2" | "3" | "4" | "5" | "6" | "other";

/** One legend entry. The series id picks the mark color, so a legend can't invent a seventh hue. */
export type LegendItem = { label: string; series: SeriesId };

/**
 * The frame around a chart: title, plot, and legend. The plot itself is drawn by the caller.
 *
 * Usage:
 * - Use `loading` while the query runs, `empty` when it succeeded with nothing to plot, and
 *   `error` when it failed. The plot only exists in `ready`, so a loading frame can't pretend
 *   to show a chart.
 * - A legend only exists beside a plot. Pass it on `ready`.
 * - `error` with `retryable: true` requires `onRetry`. A final failure has no button.
 *
 * There is no `className` or `style` prop. The frame's look is the `chart.*` tokens.
 */
export type ChartFrameProps =
  | { status: "loading"; title: string }
  | { status: "empty"; title: string; reason: string }
  | { status: "error"; title: string; message: string; retryable: true; onRetry: () => void }
  | { status: "error"; title: string; message: string; retryable: false }
  | { status: "ready"; title: string; plot: ReactNode; legend?: readonly LegendItem[] };

export function ChartFrame(props: ChartFrameProps) {
  return (
    <section style={styles.frame} aria-busy={props.status === "loading"} aria-label={props.title}>
      <h2 style={styles.title}>{props.title}</h2>
      <Body {...props} />
    </section>
  );
}

function Body(props: ChartFrameProps) {
  switch (props.status) {
    case "loading":
      return <p style={styles.note} role="status">Loading chart…</p>;
    case "empty":
      return <p style={styles.note}>{props.reason}</p>;
    case "error":
      return (
        <p style={styles.note} role="alert">
          {props.message}
          {props.retryable && <button type="button" style={styles.retry} onClick={props.onRetry}>Try again</button>}
        </p>
      );
    case "ready":
      return (
        <>
          <div style={styles.plot}>{props.plot}</div>
          {props.legend && props.legend.length > 0 && (
            <ul style={styles.legend}>
              {props.legend.map(item => (
                <li key={item.label} style={styles.legendItem}>
                  <span style={{ ...styles.swatch, background: cssVar(`color.mark.categorical.${item.series}`) }} aria-hidden />
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </>
      );
    default:
      return assertNever(props);
  }
}

function assertNever(x: never): never {
  throw new Error(`Unhandled ChartFrame state: ${JSON.stringify(x)}`);
}
