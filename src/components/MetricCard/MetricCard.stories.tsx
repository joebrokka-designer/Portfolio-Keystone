import type { Meta, StoryObj } from "@storybook/react-vite";
import { toMeasure } from "../../foundations/brands";
import { MetricCard } from "./MetricCard";

const meta = {
  title: "Components/MetricCard",
  component: MetricCard,
  decorators: [Story => <div style={{ maxWidth: 280 }}><Story /></div>],
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Ready: Story = {
  args: { status: "ready", label: "Revenue", value: toMeasure(128400), format: "currency:USD" },
};

export const WithImprovement: Story = {
  name: "Ready, down is good",
  args: {
    status: "ready", label: "Churn", value: toMeasure(0.031), format: "percent",
    comparison: { delta: toMeasure(-0.12), baseline: "vs. last month", polarity: "down-is-good" },
  },
};

export const WithDecline: Story = {
  name: "Ready, up is good",
  args: {
    status: "ready", label: "Active users", value: toMeasure(12480), format: "number",
    comparison: { delta: toMeasure(-0.04), baseline: "vs. last week", polarity: "up-is-good" },
  },
};

export const Loading: Story = { args: { status: "loading", label: "Revenue" } };

export const Empty: Story = {
  args: { status: "empty", label: "Revenue", reason: "No orders in this date range" },
};

export const ErrorState: Story = {
  name: "Error",
  args: { status: "error", label: "Revenue", error: "The sales warehouse didn't respond. Try again in a minute." },
};

/** How cards are meant to be used: several single numbers in a row, each in its own state. */
export const DashboardRow: Story = {
  name: "In a dashboard row",
  args: Ready.args,
  decorators: [() => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 220px)", gap: 16 }}>
      <MetricCard status="ready" label="Revenue" value={toMeasure(128400)} format="currency:USD"
        comparison={{ delta: toMeasure(0.082), baseline: "vs. last month", polarity: "up-is-good" }} />
      <MetricCard status="ready" label="Churn" value={toMeasure(0.031)} format="percent"
        comparison={{ delta: toMeasure(-0.12), baseline: "vs. last month", polarity: "down-is-good" }} />
      <MetricCard status="loading" label="Active users" />
      <MetricCard status="empty" label="Refunds" reason="No refunds this month" />
    </div>
  )],
};
