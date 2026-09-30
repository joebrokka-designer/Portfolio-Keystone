import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { toMeasure } from "../../foundations/brands";
import { DataTable } from "./DataTable";

const columns = [
  { id: "region", header: "Region", kind: "text" },
  { id: "revenue", header: "Revenue", kind: "number", format: "currency:USD" },
] as const;

const rows = [
  { id: "west", cells: [{ columnId: "region", kind: "text", value: "West" }, { columnId: "revenue", kind: "number", value: toMeasure(84200) }] },
  { id: "east", cells: [{ columnId: "region", kind: "text", value: "East" }, { columnId: "revenue", kind: "number", value: toMeasure(44200) }] },
] as const;

const meta = {
  title: "Components/DataTable",
  component: DataTable,
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Ready: Story = { args: { status: "ready", caption: "Revenue by region", columns, rows } };
export const Loading: Story = { args: { status: "loading", caption: "Revenue by region" } };
export const Empty: Story = { args: { status: "empty", caption: "Revenue by region", columns, reason: "No orders in this date range" } };
export const ErrorRetryable: Story = {
  name: "Error, can retry",
  args: { status: "error", caption: "Revenue by region", message: "The warehouse timed out", retryable: true, onRetry: fn() },
};
export const ErrorFinal: Story = {
  name: "Error, can't retry",
  args: { status: "error", caption: "Revenue by region", message: "You don't have access to this dataset", retryable: false },
};
