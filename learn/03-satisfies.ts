// Lesson 3: `satisfies`.
// Goal: a config object that is checked against a rule AND keeps its exact contents.
// Read top to bottom. You don't need to change anything in this file.

import type { ColorToken } from "../dist/index";

// The config: named color ramps a chart can use. Each ramp is a list of color tokens.

// ---- Attempt 1: no type at all ----
const ramps1 = {
  categorical: ["color.mark.categorical.1", "color.mark.categorical.2", "color.mark.categorical.3"],
  sequential: ["color.mark.sequential.1", "color.mark.sequnetial.2"], // typo! nobody notices
};
// TypeScript remembers the names (categorical, sequential) but checks nothing inside,
// so the misspelled token ships and the chart gets no color.

// ---- Attempt 2: a type label with a colon ----
const ramps2: Record<string, ColorToken[]> = {
  categorical: ["color.mark.categorical.1", "color.mark.categorical.2", "color.mark.categorical.3"],
  sequential: ["color.mark.sequential.1", "color.mark.sequential.2"],
};
// Now every token is checked (a typo would be an error). But the colon *replaces* what
// TypeScript knows with the label: "some names, any names." So this compiles:
export const oops = ramps2.diverging; // no such ramp; this is undefined when the page runs

// ---- Attempt 3: satisfies ----
const ramps = {
  categorical: ["color.mark.categorical.1", "color.mark.categorical.2", "color.mark.categorical.3"],
  sequential: ["color.mark.sequential.1", "color.mark.sequential.2", "color.mark.sequential.3"],
} satisfies Record<string, ColorToken[]>;
// `satisfies` *checks* against the rule, then keeps what TypeScript actually saw.
// Every token is checked, AND the names are remembered exactly:
export const fine = ramps.categorical;
// @ts-expect-error: there is no "diverging" ramp, and TypeScript knows it
export const caught = ramps.diverging;

// The one-line summary:
//   colon      "treat this as the label"       (checks, then forgets the details)
//   satisfies  "make sure this fits the label" (checks, and keeps the details)

// So an agent that asks for a ramp by name gets a list of the real names to choose from,
// and one that invents a name gets an error instead of a blank chart.

export { ramps1, ramps };
