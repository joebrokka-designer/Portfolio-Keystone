// The contract, as code: things an agent might write, and whether they compile.
import { toFraction, toHighConfidence, toLowConfidence, toMediumConfidence } from "../../foundations/brands";
import { ConfidenceBadge } from "./ConfidenceBadge";

export const valid = [
  <ConfidenceBadge level="high" score={toHighConfidence(0.92)} />,
  <ConfidenceBadge level="medium" score={toMediumConfidence(0.71)} />,
  <ConfidenceBadge level="low" score={toLowConfidence(0.38)} reason="Only 12 matching rows" />,
];

export const invalid = [
  // @ts-expect-error: a low score has to say why
  <ConfidenceBadge level="low" score={toLowConfidence(0.38)} />,
  // @ts-expect-error: a caveat belongs on the low path, not on high
  <ConfidenceBadge level="high" score={toHighConfidence(0.92)} reason="Looks fine" />,
  // @ts-expect-error: a plain fraction is not a high score, so 0.2 cannot wear a high label
  <ConfidenceBadge level="high" score={toFraction(0.2)} />,
  // @ts-expect-error: a high score cannot be labeled low
  <ConfidenceBadge level="low" score={toHighConfidence(0.92)} reason="Only 12 matching rows" />,
  // @ts-expect-error: a raw number hasn't been checked
  <ConfidenceBadge level="high" score={0.92} />,
  // @ts-expect-error: no className escape hatch
  <ConfidenceBadge level="high" score={toHighConfidence(0.92)} className="text-green-500" />,
];
