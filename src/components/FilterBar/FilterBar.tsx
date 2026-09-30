// Behavior layer: which state shows what. Colors and type come only from FilterBar.styles.ts.
import { styles } from "./FilterBar.styles";

/** A filter the reader can turn on. It has no value yet. */
export type AvailableFilter = { id: string; label: string };
/** A filter that is on. The value is what the chip shows, so an applied filter can't be blank. */
export type AppliedFilter = { id: string; label: string; value: string };

/**
 * The row of filter chips above a chart or table.
 *
 * Usage:
 * - Use `loading` while the list of filters is still arriving.
 * - Use `idle` when none are applied. There is no Clear button, because there is nothing to clear.
 * - Use `filtered` once at least one filter is on. That state requires `onClear` and `onRemove`,
 *   and `applied` cannot be empty: an empty applied list is `idle`.
 *
 * There is no `className` or `style` prop. Chip color comes from the `filter.chip.*` tokens.
 */
export type FilterBarProps =
  | { status: "loading" }
  | { status: "idle"; available: readonly AvailableFilter[]; onApply: (id: string) => void }
  | {
      status: "filtered";
      applied: readonly [AppliedFilter, ...AppliedFilter[]];
      available: readonly AvailableFilter[];
      onApply: (id: string) => void;
      onRemove: (id: string) => void;
      onClear: () => void;
    };

export function FilterBar(props: FilterBarProps) {
  switch (props.status) {
    case "loading":
      return <p style={styles.note} role="status">Loading filters…</p>;
    case "idle":
      return (
        <div style={styles.bar} role="group" aria-label="Filters">
          {props.available.map(filter => (
            <button key={filter.id} type="button" style={styles.chip} onClick={() => props.onApply(filter.id)}>
              {filter.label}
            </button>
          ))}
        </div>
      );
    case "filtered":
      return (
        <div style={styles.bar} role="group" aria-label="Filters">
          {props.applied.map(filter => (
            <button key={filter.id} type="button" style={{ ...styles.chip, ...styles.applied }} aria-pressed onClick={() => props.onRemove(filter.id)}>
              {filter.label}: {filter.value}
            </button>
          ))}
          {props.available.map(filter => (
            <button key={filter.id} type="button" style={styles.chip} onClick={() => props.onApply(filter.id)}>
              {filter.label}
            </button>
          ))}
          <button type="button" style={styles.clear} onClick={props.onClear}>Clear</button>
        </div>
      );
    default:
      return assertNever(props);
  }
}

function assertNever(x: never): never {
  throw new Error(`Unhandled FilterBar state: ${JSON.stringify(x)}`);
}
