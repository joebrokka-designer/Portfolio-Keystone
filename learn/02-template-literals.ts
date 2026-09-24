// Lesson 2: template literal types.
// Goal: a component prop can only be a word that exists as a real Phase 1 token.
// Read top to bottom. You don't need to change anything in this file.

import { cssVar, type TokenPath } from "../dist/index";

// ---- The idea: a string with a blank in it ----

// In ordinary code, backticks build a string with a blank filled in:
//   `Hello, ${name}`  with name = "Joe"  gives  "Hello, Joe"
// TypeScript can do the same thing with *types*. Fill the blank with four words,
// and you get four strings:

type Tone = "danger" | "warning" | "success" | "info";
type FeedbackBackground = `color.background.feedback.${Tone}`;
// FeedbackBackground is now exactly:
//   "color.background.feedback.danger" | "color.background.feedback.warning"
//   | "color.background.feedback.success" | "color.background.feedback.info"
// Hover over FeedbackBackground in Cursor to see it.

// ---- Why it matters: every one of those strings is checked against your tokens ----

// cssVar() from Phase 1 only accepts a real TokenPath. Building the path from the tone
// means TypeScript checks all four combinations, not just the one you happened to test.
export function alertColors(tone: Tone) {
  return {
    background: cssVar(`color.background.feedback.${tone}`),
    text: cssVar(`color.text.feedback.${tone}`),
    border: cssVar(`color.border.feedback.${tone}`),
    icon: cssVar(`color.icon.feedback.${tone}`),
  };
}

// An agent can only pass one of the four tones.
export const ok = alertColors("danger");
// @ts-expect-error: "error" isn't a tone. The agent has to pick "danger" by meaning.
export const typo = alertColors("error");

// ---- What happens when the tone list and the tokens disagree ----

// Someone adds a "neutral" tone to the component, but nobody made neutral feedback tokens.
type ToneWithNeutral = Tone | "neutral";
export function brokenAlert(tone: ToneWithNeutral) {
  // @ts-expect-error: "color.background.feedback.neutral" is not a token
  return cssVar(`color.background.feedback.${tone}`);
}
// That's the Phase 1 rename demo again, one level up: rename `danger` in the tokens,
// and every component that builds a path from its tone stops compiling.

// ---- Bonus (read it, don't write it): let the tokens define the tone list ----

// Above, `Tone` is typed by hand, so it can drift from the tokens. This version reads the
// tone names straight out of TokenPath: "take every path that starts with
// color.background.feedback., keep the part after it, and drop anything with another dot in it."
type TonesFromTokens =
  TokenPath extends infer P
    ? P extends `color.background.feedback.${infer T}`
      ? T extends `${string}.${string}` ? never : T
      : never
    : never;
// Hover over it: "danger" | "warning" | "success" | "info". Add a token and the prop gains a value;
// delete one and the prop loses it. The design system and the component can't disagree.
export const fromTokens: TonesFromTokens = "info";
