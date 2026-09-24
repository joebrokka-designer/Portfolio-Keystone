// Lesson 4: branded types.
// Goal: some values must be *checked* before a component accepts them, like "a number from 0 to 1".
// Read top to bottom. You don't need to change anything in this file.

// ---- The gap from lesson 1 ----
// `progress?: number` accepts 1.5, or -40. A type can say "number", but it can't say
// "a number from 0 to 1", because it never sees the actual number: that comes from the
// query engine while the page is running.

// ---- The fix: a stamp that only the checker can give ----

// A Fraction is a number with an invisible stamp on it. Nothing in the program really
// has this stamp; it only exists so TypeScript can tell "checked" and "unchecked" apart.
export type Fraction = number & { readonly __brand: "Fraction" };

// The only place that hands out the stamp. It checks the number first, and refuses if it's wrong.
export function toFraction(n: number): Fraction {
  if (!(n >= 0 && n <= 1)) throw new RangeError(`Expected a fraction from 0 to 1, got ${n}`);
  return n as Fraction; // `as` applies the stamp. Only do this right after a check.
}

// The component asks for the stamped kind, not a plain number.
type Running = { status: "running"; startedAt: Date; progress?: Fraction };

export const ok: Running = { status: "running", startedAt: new Date(), progress: toFraction(0.4) };

// @ts-expect-error: a plain number hasn't been checked, so it doesn't have the stamp
export const unchecked: Running = { status: "running", startedAt: new Date(), progress: 0.4 };

// A Fraction still works like a normal number everywhere else:
export const percentLabel = `${Math.round(toFraction(0.4) * 100)}%`;

// ---- What this does and doesn't promise ----
// `toFraction(1.5)` still *compiles*. It fails when the page runs, loudly, with a clear
// message, at the moment the bad data arrives, instead of quietly drawing a bar at 150%.
// The promise is: any Fraction that reaches a component has been through the check.
//
// For agents this is the key move. An agent can't take a raw number from an API and push it
// straight into the chart. The type makes it go through toFraction first. Validating data
// is no longer a habit someone has to remember; it's the only route that compiles.
