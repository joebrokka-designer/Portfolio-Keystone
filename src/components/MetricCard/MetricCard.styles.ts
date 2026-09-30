// Styles layer: which token paints which part. No logic, no raw values.
// `satisfies` checks every entry is a real style object and keeps the part names exact,
// so the component can only ask for parts that exist.
import type { CSSProperties } from "react";
import { cssVar } from "../../../dist/index";
import { typography } from "../../foundations/typography";

export const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    gap: cssVar("kpi.gap"),
    padding: `${cssVar("space.inset.md")} ${cssVar("kpi.padding-inline")}`,
    background: cssVar("kpi.background"),
    border: `${cssVar("size.stroke.default")} solid ${cssVar("kpi.border")}`,
    borderRadius: cssVar("radius.container"),
    margin: 0,
  },
  label: { ...typography("kpi.label.typography"), color: cssVar("kpi.label.text"), margin: 0 },
  value: { ...typography("kpi.value.typography"), color: cssVar("kpi.value.text"), margin: 0 },
  delta: { ...typography("typography.label.default"), display: "flex", alignItems: "baseline", gap: cssVar("space.inline.xs"), margin: 0 },
  note: { ...typography("typography.body.small"), color: cssVar("color.text.subtle"), margin: 0 },
  errorIcon: { color: cssVar("color.icon.feedback.danger") },
  placeholder: {
    height: "1.5em",
    width: "60%",
    borderRadius: cssVar("radius.control"),
    background: cssVar("color.background.surface.sunken"),
  },
} satisfies Record<string, CSSProperties>;
