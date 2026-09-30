// Your turn: the fonts each part of a chart uses.
// These are real typography tokens from Phase 1:
//   typography.label.small    typography.label.default    typography.body.small
//   typography.numeric.table  typography.numeric.kpi      typography.heading.3
// After each step, save and run `npm run learn`. No output means it passed.

import type { TypographyToken } from "../dist/index";

// Pick by meaning: axis ticks are small labels, the chart title is a heading.
const chartText = {
  title: "typography.heading.3",
  axisLabel: "typography.label.small",
  legend: "typography.label.default",
  tooltipValue: "typography.numeric.table",
} satisfies Record<string, TypographyToken>;

// `title` is in the object, so this name is remembered.
export const titleFont = chartText.title;

// Agents often call it "axisLabels" with an s. Prove that fails.
// @ts-expect-error: the name is axisLabel, not axisLabels
export const wrongName = chartText.axisLabels;
