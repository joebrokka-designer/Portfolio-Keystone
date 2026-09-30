// Styles layer: which token paints which part. No logic, no raw values.
import type { CSSProperties } from "react";
import { cssVar, type ColorToken } from "../../../dist/index";
import { typography } from "../../foundations/typography";

export type Level = "high" | "medium" | "low";

const levelColor = {
  high: "color.text.feedback.success",
  medium: "color.text.feedback.warning",
  low: "color.text.feedback.danger",
} satisfies Record<Level, ColorToken>;

export const styles = {
  badge: {
    ...typography("typography.label.small"),
    color: cssVar("color.text.default"),
    display: "inline-flex",
    alignItems: "baseline",
    gap: cssVar("space.inline.xs"),
    margin: 0,
  },
  reason: { ...typography("typography.body.small"), color: cssVar("color.text.subtle") },
} satisfies Record<string, CSSProperties>;

export const levelStyle = (level: Level): CSSProperties => ({
  color: cssVar(levelColor[level]),
});
