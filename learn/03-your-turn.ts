// Your turn: the fonts each part of a chart uses.
// These are real typography tokens from Phase 1:
//   typography.label.small    typography.label.default    typography.body.small
//   typography.numeric.table  typography.numeric.kpi      typography.heading.3
// After each step, save and run `npm run learn`. No output means it passed.

import type { TypographyToken } from "../dist/index";

// STEP 1: finish the object. Replace each ___ with a typography token from the list above,
// in quotes. Pick by meaning: which one would you use for axis labels? For the chart title?
// Delete the // at the start of the next six lines first.
// const chartText = {
//   title: ___,
//   axisLabel: ___,
//   legend: ___,
//   tooltipValue: ___,
// } satisfies Record<string, TypographyToken>;

// STEP 2: this should work, because `title` is in your object. Delete the //.
// export const titleFont = chartText.title;

// STEP 3: agents often call it "axisLabels" with an s. Prove that fails: delete the // on both lines.
// // @ts-expect-error: the name is axisLabel, not axisLabels
// export const wrongName = chartText.axisLabels;

// STEP 4: now misspell one of your tokens on purpose (for example "typography.lable.small")
// and run `npm run learn`. Read the error, then fix the spelling.

// STEP 5 (think about it): put a color token in, like  legend: "color.text.subtle",
// and run it. Why is it good that a *color* is rejected here, even though it's spelled right?
// Then put your typography token back.
