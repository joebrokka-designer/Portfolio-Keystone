// Your turn: the arrow and number on a MetricCard that show which way a metric moved.
// Your Phase 1 tokens have these (check tokens/theme/light.tokens.json if you're curious):
//   color.text.delta.increase    color.text.delta.decrease    color.text.delta.unchanged
//   color.icon.delta.increase    color.icon.delta.decrease    color.icon.delta.unchanged
// After each step, save and run `npm run learn`. No output means it passed.

import { cssVar } from "../dist/index";

// STEP 1: list the three directions, using the same pattern as `Tone` in lesson 2.
// Delete the // at the start of the next line and replace ___ with the three words, separated by |
// export type Direction = ___;

// STEP 2: fill in the blanks so each color is built from the direction.
// Delete the // at the start of the next five lines, then replace each ___ with  ${direction}
// export function deltaColors(direction: Direction) {
//   return {
//     text: cssVar(`color.text.delta.___`),
//     icon: cssVar(`color.icon.delta.___`),
//   };
// }

// STEP 3: one example that should work. Delete the // on the next line.
// export const good = deltaColors("increase");

// STEP 4: agents often write "up" and "down". Prove that fails: delete the // on the next two lines.
// // @ts-expect-error: the direction is "increase", not "up"
// export const bad = deltaColors("up");

// STEP 5 (a small puzzle): add a `border` line inside deltaColors, just like `text` and `icon`:
//     border: cssVar(`color.border.delta.${direction}`),
// Run `npm run learn` and read the error. What is TypeScript telling you about your tokens?
// Paste the error to Claude, then take the line back out.
