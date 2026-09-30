import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  decorators: [Story => <div style={{ maxWidth: 420 }}><Story /></div>],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoData: Story = {
  args: { reason: "no-data", title: "No orders yet", description: "Orders placed this month will show up here." },
};
export const NoResults: Story = {
  args: { reason: "no-results", title: "No matching rows", description: "Those filters removed every row.", onClearFilters: fn() },
};
export const NoAccess: Story = {
  args: { reason: "no-access", title: "You can't view this dataset", description: "Ask an admin for access to the sales warehouse." },
};
export const FailedRetryable: Story = {
  name: "Failed, can retry",
  args: { reason: "failed", title: "The query didn't finish", description: "The warehouse timed out.", retryable: true, onRetry: fn() },
};
export const FailedFinal: Story = {
  name: "Failed, can't retry",
  args: { reason: "failed", title: "This query can't run", description: "The dataset was removed.", retryable: false },
};
