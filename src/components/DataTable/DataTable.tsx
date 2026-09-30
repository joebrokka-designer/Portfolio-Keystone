// Behavior layer: which state shows what. Colors and type come only from DataTable.styles.ts.
import type { Measure } from "../../foundations/brands";
import { styles } from "./DataTable.styles";

type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY";
type ValueFormat = "number" | "percent" | `currency:${CurrencyCode}`;

/** A text column. Its cells are words, so they align to the start. */
export type TextColumn = { id: string; header: string; kind: "text" };
/** A number column. The format travels with the column, so a currency column can't forget its code. */
export type NumberColumn = { id: string; header: string; kind: "number"; format: ValueFormat };
export type Column = TextColumn | NumberColumn;

export type TextCell = { columnId: string; kind: "text"; value: string };
export type NumberCell = { columnId: string; kind: "number"; value: Measure };
export type Cell = TextCell | NumberCell;
export type DataRow = { id: string; cells: readonly Cell[] };

/**
 * A table of query results. Columns and rows only exist once there is something to show.
 *
 * Usage:
 * - Use `loading` while the query runs. Show `empty` when it succeeded and returned nothing,
 *   and `error` when it failed. A zero in a cell is a real value, so it belongs in `ready`.
 * - `ready` requires at least one column and one row. No rows is `empty`, which still shows
 *   the headers so the reader knows what the table was going to contain.
 * - `error` with `retryable: true` requires `onRetry`. A permission error is `retryable: false`
 *   and has no button.
 *
 * There is no `className` or `style` prop. The table's look is the `table.*` tokens.
 */
export type DataTableProps =
  | { status: "loading"; caption: string }
  | { status: "empty"; caption: string; columns: readonly [Column, ...Column[]]; reason: string }
  | { status: "error"; caption: string; message: string; retryable: true; onRetry: () => void }
  | { status: "error"; caption: string; message: string; retryable: false }
  | { status: "ready"; caption: string; columns: readonly [Column, ...Column[]]; rows: readonly [DataRow, ...DataRow[]] };

export function DataTable(props: DataTableProps) {
  return (
    <figure style={styles.frame} aria-busy={props.status === "loading"}>
      <figcaption style={styles.caption}>{props.caption}</figcaption>
      <Body {...props} />
    </figure>
  );
}

function Body(props: DataTableProps) {
  switch (props.status) {
    case "loading":
      return <p style={styles.note} role="status">Loading rows…</p>;
    case "empty":
      return (
        <>
          <Grid columns={props.columns} rows={[]} />
          <p style={styles.note}>{props.reason}</p>
        </>
      );
    case "error":
      return (
        <p style={styles.note} role="alert">
          {props.message}
          {props.retryable && <button type="button" style={styles.retry} onClick={props.onRetry}>Try again</button>}
        </p>
      );
    case "ready":
      return <Grid columns={props.columns} rows={props.rows} />;
    default:
      return assertNever(props);
  }
}

function Grid({ columns, rows }: { columns: readonly Column[]; rows: readonly DataRow[] }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.id} scope="col" style={{ ...styles.headerCell, ...(column.kind === "number" ? styles.headerNumber : {}) }}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            {columns.map(column => {
              const cell = row.cells.find(item => item.columnId === column.id);
              return <td key={column.id} style={{ ...styles.cell, ...(column.kind === "number" ? styles.numberCell : {}) }}>{renderCell(column, cell)}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderCell(column: Column, cell: Cell | undefined): string {
  if (!cell || cell.kind !== column.kind) return "—";
  if (cell.kind === "text") return cell.value;
  return formatValue(cell.value, column.kind === "number" ? column.format : "number");
}

function formatValue(value: Measure, format: ValueFormat): string {
  if (format === "number") return new Intl.NumberFormat().format(value);
  if (format === "percent") return new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 }).format(value);
  const currency = format.slice("currency:".length);
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function assertNever(x: never): never {
  throw new Error(`Unhandled DataTable state: ${JSON.stringify(x)}`);
}
