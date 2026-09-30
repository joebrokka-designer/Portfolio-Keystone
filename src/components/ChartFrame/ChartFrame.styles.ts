// Styles layer: which token paints which part. No logic, no raw values.
import type { CSSProperties } from "react";
import { cssVar } from "../../../dist/index";
import { typography } from "../../foundations/typography";

export const styles = {
  frame: {
    display: "flex",
    flexDirection: "column",
    gap: cssVar("space.stack.sm"),
    background: cssVar("color.background.surface.default"),
    border: `${cssVar("size.stroke.default")} solid ${cssVar("color.border.subtle")}`,
    borderRadius: cssVar("radius.container"),
    padding: cssVar("chart.plot.padding-inline"),
    margin: 0,
  },
  title: { ...typography("typography.heading.3"), color: cssVar("color.text.default"), margin: 0 },
  plot: { minHeight: "12em" },
  legend: {
    ...typography("chart.legend.label.typography"),
    display: "flex",
    flexWrap: "wrap",
    gap: cssVar("chart.legend.gap"),
    margin: 0,
    padding: 0,
    listStyle: "none",
    color: cssVar("color.text.default"),
  },
  swatch: { width: "0.7em", height: "0.7em", borderRadius: cssVar("chart.bar.radius"), display: "inline-block" },
  legendItem: { display: "flex", alignItems: "center", gap: cssVar("space.inline.xs") },
  note: { ...typography("typography.body.small"), color: cssVar("color.text.subtle"), margin: 0 },
  retry: {
    ...typography("typography.label.small"),
    color: cssVar("color.text.action.secondary"),
    background: cssVar("color.background.action.secondary"),
    border: `${cssVar("size.stroke.default")} solid ${cssVar("color.border.action.secondary")}`,
    borderRadius: cssVar("radius.control"),
    paddingInline: cssVar("space.inset.sm"),
    height: cssVar("size.control.height.sm"),
    cursor: "pointer",
    marginLeft: cssVar("space.inline.sm"),
  },
} satisfies Record<string, CSSProperties>;
