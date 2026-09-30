// The contract, as code: things an agent might write, and whether they compile.
import { toMeasure } from "../../foundations/brands";
import { DataTable } from "./DataTable";

const columns = [{ id: "region", header: "Region", kind: "text" }] as const;
const rows = [{ id: "west", cells: [{ columnId: "region", kind: "text" as const, value: "West" }] }] as const;

export const valid = [
  <DataTable status="loading" caption="Revenue by region" />,
  <DataTable status="empty" caption="Revenue by region" columns={columns} reason="No orders in this date range" />,
  <DataTable status="error" caption="Revenue by region" message="The warehouse timed out" retryable={true} onRetry={() => {}} />,
  <DataTable status="error" caption="Revenue by region" message="You don't have access" retryable={false} />,
  <DataTable status="ready" caption="Revenue by region" columns={[{ id: "revenue", header: "Revenue", kind: "number", format: "currency:USD" }]} rows={[{ id: "west", cells: [{ columnId: "revenue", kind: "number", value: toMeasure(84200) }] }]} />,
];

export const invalid = [
  // @ts-expect-error: a loading table has no rows
  <DataTable status="loading" caption="Revenue" rows={rows} />,
  // @ts-expect-error: ready needs at least one row; no rows is the empty state
  <DataTable status="ready" caption="Revenue" columns={columns} rows={[]} />,
  // @ts-expect-error: a retryable error needs onRetry
  <DataTable status="error" caption="Revenue" message="Timed out" retryable={true} />,
  // @ts-expect-error: a final error can't offer a retry
  <DataTable status="error" caption="Revenue" message="No access" retryable={false} onRetry={() => {}} />,
  // @ts-expect-error: money without a currency
  <DataTable status="ready" caption="Revenue" columns={[{ id: "revenue", header: "Revenue", kind: "number", format: "currency" }]} rows={[{ id: "west", cells: [{ columnId: "revenue", kind: "number", value: toMeasure(1) }] }]} />,
  // @ts-expect-error: a raw number hasn't been through toMeasure
  <DataTable status="ready" caption="Revenue" columns={[{ id: "revenue", header: "Revenue", kind: "number", format: "number" }]} rows={[{ id: "west", cells: [{ columnId: "revenue", kind: "number", value: 84200 }] }]} />,
  // @ts-expect-error: no className escape hatch
  <DataTable status="loading" caption="Revenue" className="mt-4" />,
];
