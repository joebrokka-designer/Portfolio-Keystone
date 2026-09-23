// A consumer component using token paths from TypeScript.
// Every path is checked against TokenPath: a typo or a renamed token is a compile error.
import { cssVar, resolve, type ColorToken } from "../../../dist/index";

type Tone = "danger" | "warning" | "success" | "info";

// Template literal types build the token path from the tone, and TS verifies each one exists.
const background = (tone: Tone) => cssVar(`color.background.feedback.${tone}`);

export const dangerBanner = {
  background: cssVar("color.background.feedback.danger"),
  borderColor: cssVar("alert.danger.border"),
  color: cssVar("alert.danger.text"),
};

export const toneBackgrounds = (["danger", "warning", "success", "info"] as const).map(background);

// Canvas and chart libraries can't read CSS vars, so they take resolved values.
export const chartSeries: ColorToken[] = ["color.mark.categorical.1", "color.mark.categorical.2", "color.mark.categorical.3"];
export const darkSeriesColors = chartSeries.map(t => resolve(t, { theme: "dark" }));
