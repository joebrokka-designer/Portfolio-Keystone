// Your turn: the arrow and number on a MetricCard that show which way a metric moved.
// Your Phase 1 tokens have these (check tokens/theme/light.tokens.json if you're curious):
//   color.text.delta.increase    color.text.delta.decrease    color.text.delta.unchanged
//   color.icon.delta.increase    color.icon.delta.decrease    color.icon.delta.unchanged
// After each step, save and run `npm run learn`. No output means it passed.

import { cssVar } from "../dist/index";

// The three directions, using the same pattern as `Tone` in lesson 2.
export type Direction = "increase" | "decrease" | "unchanged";

// Each color is built from the direction.
export function deltaColors(direction: Direction) {
  return {
    text: cssVar(`color.text.delta.${direction}`),
    icon: cssVar(`color.icon.delta.${direction}`),
  };
}

// One example that should work.
export const good = deltaColors("increase");

// Agents often write "up" and "down". Prove that fails.
// @ts-expect-error: the direction is "increase", not "up"
export const bad = deltaColors("up");
