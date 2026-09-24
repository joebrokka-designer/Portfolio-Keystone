// Your turn: a Count, for things like rowCount. A count must be a whole number, zero or more.
// (1204 rows is fine. 3.5 rows or -2 rows is a bug.)
// After each step, save and run `npm run learn`. No output means it passed.

// STEP 1: make the stamped type. Copy the pattern from Fraction in lesson 4.
// Delete the // at the start of the next line, and replace ___ with the word  "Count"  (in quotes).
// export type Count = number & { readonly __brand: ___ };

// STEP 2: the checker. It must refuse anything that's not a whole number, or that is below zero.
// The first half is written for you:  !Number.isInteger(n)  means "n is NOT a whole number".
// The || means "or". Replace ___ with the check for "n is below zero".
// Delete the // at the start of the next four lines.
// export function toCount(n: number): Count {
//   if (!Number.isInteger(n) || ___) throw new RangeError(`Expected a count, got ${n}`);
//   return n as Count;
// }

// STEP 3: use it. Delete the // on the next line.
// type Succeeded = { status: "succeeded"; rowCount: Count; durationMs: number };

// STEP 4: one that works (goes through the checker) and one that must fail (a plain number).
// Delete the // on the next three lines.
// export const good: Succeeded = { status: "succeeded", rowCount: toCount(1204), durationMs: 380 };
// // @ts-expect-error: 1204 hasn't been through toCount, so it isn't a Count
// export const bad: Succeeded = { status: "succeeded", rowCount: 1204, durationMs: 380 };

// STEP 5 (think about it): durationMs is still a plain number. Should it be stamped too?
// What would its checker refuse? There's no single right answer; say why.
