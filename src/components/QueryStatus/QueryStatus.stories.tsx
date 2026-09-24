import type { Meta, StoryObj } from "@storybook/react-vite";
import { toCount, toFraction, toMeasure } from "../../foundations/brands";
import { QueryStatus } from "./QueryStatus";

const meta = {
  title: "Components/QueryStatus",
  component: QueryStatus,
} satisfies Meta<typeof QueryStatus>;

export default meta;
type Story = StoryObj<typeof QueryStatus>;

export const Idle: Story = { args: { status: "idle" } };

export const Running: Story = { args: { status: "running", startedAt: new Date() } };

export const RunningWithProgress: Story = {
  name: "Running, with progress",
  args: { status: "running", startedAt: new Date(), progress: toFraction(0.4) },
};

export const Succeeded: Story = { args: { status: "succeeded", rowCount: toCount(1204), durationMs: toMeasure(380) } };

export const FailedRetryable: Story = { name: "Failed, can retry", args: { status: "failed", message: "The warehouse timed out", retryable: true } };
export const FailedFinal: Story = { name: "Failed, can't retry", args: { status: "failed", message: "You don't have access to this dataset", retryable: false } };

export const Cancelled: Story = { args: { status: "cancelled", cancelledBy: "user" } };
export const CancelledTimeout: Story = {
  name: "Cancelled, took too long",
  args: { status: "cancelled", cancelledBy: "timeout" },
};

