// Behavior layer: which reason shows what. Colors and type come only from EmptyState.styles.ts.
import { styles } from "./EmptyState.styles";

/**
 * What to show when a chart or table has nothing to draw.
 *
 * Usage:
 * - `no-data`: the query worked and the range is simply empty. There is no button, because
 *   retrying the same query won't help.
 * - `no-results`: filters removed every row. This path requires `onClearFilters`.
 * - `no-access`: the reader isn't allowed to see it. There is no retry.
 * - `failed` with `retryable: true` requires `onRetry`. A final failure has no button.
 *
 * There is no `className` or `style` prop.
 */
export type EmptyStateProps =
  | { reason: "no-data"; title: string; description: string }
  | { reason: "no-results"; title: string; description: string; onClearFilters: () => void }
  | { reason: "no-access"; title: string; description: string }
  | { reason: "failed"; title: string; description: string; retryable: true; onRetry: () => void }
  | { reason: "failed"; title: string; description: string; retryable: false };

export function EmptyState(props: EmptyStateProps) {
  return (
    <section style={styles.panel} role={props.reason === "failed" ? "alert" : "status"}>
      <h2 style={styles.title}>{props.title}</h2>
      <p style={styles.description}>{props.description}</p>
      <Action {...props} />
    </section>
  );
}

function Action(props: EmptyStateProps) {
  switch (props.reason) {
    case "no-data":
    case "no-access":
      return null;
    case "no-results":
      return <button type="button" style={styles.action} onClick={props.onClearFilters}>Clear filters</button>;
    case "failed":
      return props.retryable
        ? <button type="button" style={styles.action} onClick={props.onRetry}>Try again</button>
        : null;
    default:
      return assertNever(props);
  }
}

function assertNever(x: never): never {
  throw new Error(`Unhandled EmptyState reason: ${JSON.stringify(x)}`);
}
