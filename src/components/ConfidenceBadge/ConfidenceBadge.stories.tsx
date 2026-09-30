import type { Meta, StoryObj } from "@storybook/react-vite";
import { toHighConfidence, toLowConfidence, toMediumConfidence } from "../../foundations/brands";
import { ConfidenceBadge } from "./ConfidenceBadge";

const meta = {
  title: "Components/ConfidenceBadge",
  component: ConfidenceBadge,
} satisfies Meta<typeof ConfidenceBadge>;

export default meta;
type Story = StoryObj<typeof ConfidenceBadge>;

export const High: Story = { args: { level: "high", score: toHighConfidence(0.92) } };
export const Medium: Story = { args: { level: "medium", score: toMediumConfidence(0.71) } };
export const Low: Story = { args: { level: "low", score: toLowConfidence(0.38), reason: "Only 12 matching rows" } };
