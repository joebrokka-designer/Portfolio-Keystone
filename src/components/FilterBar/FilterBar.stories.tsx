import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { FilterBar } from "./FilterBar";

const available = [
  { id: "region", label: "Region" },
  { id: "plan", label: "Plan" },
];

const meta = {
  title: "Components/FilterBar",
  component: FilterBar,
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Loading: Story = { args: { status: "loading" } };
export const Idle: Story = { args: { status: "idle", available, onApply: fn() } };
export const Filtered: Story = {
  args: {
    status: "filtered",
    applied: [{ id: "region", label: "Region", value: "West" }],
    available: [{ id: "plan", label: "Plan" }],
    onApply: fn(),
    onRemove: fn(),
    onClear: fn(),
  },
};
