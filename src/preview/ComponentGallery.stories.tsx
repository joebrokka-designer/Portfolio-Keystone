import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentGallery } from "./ComponentGallery";

const meta = {
  title: "Overview/All components",
  component: ComponentGallery,
} satisfies Meta<typeof ComponentGallery>;

export default meta;
type Story = StoryObj<typeof ComponentGallery>;

export const Gallery: Story = {};
