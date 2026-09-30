// Behavior layer: which level shows what. Colors and type come only from ConfidenceBadge.styles.ts.
import type { HighConfidence, LowConfidence, MediumConfidence } from "../../foundations/brands";
import { levelStyle, styles, type Level } from "./ConfidenceBadge.styles";

/**
 * How much to trust a model score or a forecast.
 *
 * Usage:
 * - The level and the score are the same stamp. `toHighConfidence` only accepts 0.8 to 1,
 *   `toMediumConfidence` only accepts 0.5 up to 0.8, and `toLowConfidence` only accepts below 0.5.
 *   A high label on a low score does not compile.
 * - `low` requires a `reason`. A low score with nothing to say leaves the reader guessing.
 * - `high` and `medium` have no reason: a caveat belongs on the low path only.
 *
 * There is no `className` or `style` prop. The label color is the feedback token for the level,
 * and the percentage uses `color.text.default`.
 */
export type ConfidenceBadgeProps =
  | { level: "high"; score: HighConfidence }
  | { level: "medium"; score: MediumConfidence }
  | { level: "low"; score: LowConfidence; reason: string };

const LABEL = { high: "High", medium: "Medium", low: "Low" } satisfies Record<Level, string>;

export function ConfidenceBadge(props: ConfidenceBadgeProps) {
  const percent = new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 0 }).format(props.score);
  return (
    <p style={styles.badge}>
      <span style={levelStyle(props.level)}>{LABEL[props.level]} confidence</span>
      <span>{percent}</span>
      {props.level === "low" && <span style={styles.reason}>{props.reason}</span>}
    </p>
  );
}
