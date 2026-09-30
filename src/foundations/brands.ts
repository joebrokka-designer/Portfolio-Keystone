// Foundations: checked values. A component that takes one of these can trust it without re-checking.
// Each brand has exactly one checker, and the checker is the only place that applies the stamp.

/** A number from 0 to 1. Use for progress and shares of a whole. */
export type Fraction = number & { readonly __brand: "Fraction" };

/** A confidence score from 0.8 to 1. Only `toHighConfidence` can apply this stamp. */
export type HighConfidence = Fraction & { readonly __confidence: "high" };
/** A confidence score from 0.5 up to, but not including, 0.8. */
export type MediumConfidence = Fraction & { readonly __confidence: "medium" };
/** A confidence score below 0.5. */
export type LowConfidence = Fraction & { readonly __confidence: "low" };

/** A whole number, zero or more. Use for row counts and item counts. */
export type Count = number & { readonly __brand: "Count" };

/** A finite number. Use for any metric value from a query: NaN and Infinity never reach the screen. */
export type Measure = number & { readonly __brand: "Measure" };

export function toFraction(n: number): Fraction {
  if (!(n >= 0 && n <= 1)) throw new RangeError(`Expected a fraction from 0 to 1, got ${n}`);
  return n as Fraction;
}

export function toHighConfidence(n: number): HighConfidence {
  const score = toFraction(n);
  if (score < 0.8) throw new RangeError(`Expected a high confidence score from 0.8 to 1, got ${n}`);
  return score as HighConfidence;
}

export function toMediumConfidence(n: number): MediumConfidence {
  const score = toFraction(n);
  if (score < 0.5 || score >= 0.8) throw new RangeError(`Expected a medium confidence score from 0.5 to 0.8, got ${n}`);
  return score as MediumConfidence;
}

export function toLowConfidence(n: number): LowConfidence {
  const score = toFraction(n);
  if (score >= 0.5) throw new RangeError(`Expected a low confidence score below 0.5, got ${n}`);
  return score as LowConfidence;
}

export function toCount(n: number): Count {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`Expected a count, got ${n}`);
  return n as Count;
}

export function toMeasure(n: number): Measure {
  if (!Number.isFinite(n)) throw new RangeError(`Expected a finite number, got ${n}`);
  return n as Measure;
}
