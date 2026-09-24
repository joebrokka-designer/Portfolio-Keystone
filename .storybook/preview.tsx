import type { Preview } from "@storybook/react-vite";
import "../dist/tokens.css";

// Theme and density are toolbar switches. The story renders inside a container that sets both
// attributes, the same way a product page would, so every combination can be checked.
const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: { title: "Theme", icon: "mirror", items: ["light", "dark"], dynamicTitle: true },
    },
    density: {
      description: "Information density",
      toolbar: { title: "Density", icon: "component", items: ["compact", "comfortable", "spacious"], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "light", density: "comfortable" },
  decorators: [
    (Story, { globals }) => (
      <div
        data-theme={globals.theme}
        data-density={globals.density}
        style={{ background: "var(--adjoin-color-background-surface-page)", padding: 24, minHeight: "100vh", boxSizing: "border-box" }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
};

export default preview;
