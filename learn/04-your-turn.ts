// Your turn: a Count, for things like rowCount. A count must be a whole number, zero or more.
// (1204 rows is fine. 3.5 rows or -2 rows is a bug.)
// After each step, save and run `npm run learn`. No output means it passed.

// A Count is a number with an invisible stamp. Only toCount can apply it.
export type Count = number & { readonly __brand: "Count" };

// Refuse anything that isn't a whole number, or that is below zero.
export function toCount(n: number): Count {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`Expected a count, got ${n}`);
  return n as Count;
}

type Succeeded = { status: "succeeded"; rowCount: Count; durationMs: number };

// One that works (goes through the checker) and one that must fail (a plain number).
export const good: Succeeded = { status: "succeeded", rowCount: toCount(1204), durationMs: 380 };
// @ts-expect-error: 1204 hasn't been through toCount, so it isn't a Count
export const bad: Succeeded = { status: "succeeded", rowCount: 1204, durationMs: 380 };
