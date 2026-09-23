import { cssVar, type TypographyToken, type CssVar } from "../../../dist/index";

// A prop constrained to typography tokens only: passing a color token is a type error.
export function metricValueFont(token: TypographyToken = "typography.numeric.kpi"): CssVar {
  return cssVar(token);
}

export const metricCard = {
  background: cssVar("kpi.background"),
  label: cssVar("kpi.label.text"),
  deltaIcon: cssVar("color.icon.delta.increase"),
  missedTarget: cssVar("color.mark.target.missed"),
};
