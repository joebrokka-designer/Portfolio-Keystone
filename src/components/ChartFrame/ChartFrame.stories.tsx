import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ChartFrame } from "./ChartFrame";

const meta = {
  title: "Components/ChartFrame",
  component: ChartFrame,
  decorators: [Story => <div style={{ maxWidth: 480 }}><Story /></div>],
} satisfies Meta<typeof ChartFrame>;

export default meta;
type Story = StoryObj<typeof ChartFrame>;

export const Ready: Story = {
  args: {
    status: "ready",
    title: "Revenue by week",
    plot: <div style={{ height: "8em", background: "var(--adjoin-color-background-surface-sunken)", borderRadius: 4 }} />,
    legend: [{ label: "This year", series: "1" }, { label: "Last year", series: "2" }],
  },
};
export const Loading: Story = { args: { status: "loading", title: "Revenue by week" } };
export const Empty: Story = { args: { status: "empty", title: "Revenue by week", reason: "No orders in this date range" } };
export const ErrorRetryable: Story = {
  name: "Error, can retry",
  args: { status: "error", title: "Revenue by week", message: "The warehouse timed out", retryable: true, onRetry: fn() },
};
export const ErrorFinal: Story = {
  name: "Error, can't retry",
  args: { status: "error", title: "Revenue by week", message: "You don't have access to this dataset", retryable: false },
};
