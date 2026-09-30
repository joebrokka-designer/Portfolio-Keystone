import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ProvenancePopover } from "./ProvenancePopover";

const retrievedAt = new Date("2026-09-23T18:40:00");

const meta = {
  title: "Components/ProvenancePopover",
  component: ProvenancePopover,
} satisfies Meta<typeof ProvenancePopover>;

export default meta;
type Story = StoryObj<typeof ProvenancePopover>;

export const Available: Story = {
  args: { status: "available", label: "Revenue", source: "Billing warehouse", dataset: "orders.daily", retrievedAt, expanded: false, onToggle: fn() },
};
export const Expanded: Story = {
  name: "Available, open",
  args: { status: "available", label: "Revenue", source: "Billing warehouse", dataset: "orders.daily", retrievedAt, expanded: true, onToggle: fn() },
};
export const Unavailable: Story = {
  args: { status: "unavailable", label: "Forecast", reason: "This number was typed in; no query recorded it." },
};
