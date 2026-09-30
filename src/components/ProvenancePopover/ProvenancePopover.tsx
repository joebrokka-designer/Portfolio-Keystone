// Behavior layer: which state shows what. Colors and type come only from ProvenancePopover.styles.ts.
import { styles } from "./ProvenancePopover.styles";

/**
 * Where a number came from. Open only when the lineage is actually known.
 *
 * Usage:
 * - Use `available` when the source, the dataset, and the retrieval time are all known.
 *   Those three travel together: a source with no time is not provenance.
 * - `expanded` is only on `available`, and that path requires `onToggle`. The button calls it.
 *   An unavailable number cannot open a panel.
 * - Use `unavailable` with a reason when the lineage was not recorded.
 *
 * There is no `className` or `style` prop.
 */
export type ProvenancePopoverProps =
  | { status: "unavailable"; label: string; reason: string }
  | { status: "available"; label: string; source: string; dataset: string; retrievedAt: Date; expanded: boolean; onToggle: () => void };

export function ProvenancePopover(props: ProvenancePopoverProps) {
  switch (props.status) {
    case "unavailable":
      return (
        <p style={styles.unavailable}>
          {props.label}. {props.reason}
        </p>
      );
    case "available":
      return (
        <span style={styles.wrap}>
          <button type="button" style={styles.trigger} aria-expanded={props.expanded} onClick={props.onToggle}>
            {props.label}
          </button>
          {props.expanded && (
            <span style={styles.panel} role="region" aria-label={`Source of ${props.label}`}>
              <span style={styles.meta}>Source: {props.source}</span>
              <span style={styles.meta}>Dataset: {props.dataset}</span>
              <span style={styles.meta}>Retrieved: {props.retrievedAt.toLocaleString()}</span>
            </span>
          )}
        </span>
      );
    default:
      return assertNever(props);
  }
}

function assertNever(x: never): never {
  throw new Error(`Unhandled ProvenancePopover state: ${JSON.stringify(x)}`);
}
