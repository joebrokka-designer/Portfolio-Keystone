// Foundations: checked values. A component that takes one of these can trust it without re-checking.
// Each brand has exactly one checker, and the checker is the only place that applies the stamp.

/** A number from 0 to 1. Use for progress, shares of a whole and confidence. */
export type Fraction = number & { readonly __brand: "Fraction" };

/** A whole number, zero or more. Use for row counts and item counts. */
export type Count = number & { readonly __brand: "Count" };

/** A finite number. Use for any metric value from a query: NaN and Infinity never reach the screen. */
export type Measure = number & { readonly __brand: "Measure" };

export function toFraction(n: number): Fraction {
  if (!(n >= 0 && n <= 1)) throw new RangeError(`Expected a fraction from 0 to 1, got ${n}`);
  return n as Fraction;
}

export function toCount(n: number): Count {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`Expected a count, got ${n}`);
  return n as Count;
}

export function toMeasure(n: number): Measure {
  if (!Number.isFinite(n)) throw new RangeError(`Expected a finite number, got ${n}`);
  return n as Measure;
}
