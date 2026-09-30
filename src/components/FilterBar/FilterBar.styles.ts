// Styles layer: which token paints which part. No logic, no raw values.
import type { CSSProperties } from "react";
import { cssVar } from "../../../dist/index";
import { typography } from "../../foundations/typography";

export const styles = {
  bar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: cssVar("space.inline.sm"),
    margin: 0,
  },
  chip: {
    ...typography("typography.label.default"),
    color: cssVar("filter.chip.text"),
    background: cssVar("filter.chip.background"),
    border: `${cssVar("size.stroke.default")} solid transparent`,
    borderRadius: cssVar("filter.chip.radius"),
    height: cssVar("filter.chip.height"),
    paddingInline: cssVar("space.inset.sm"),
    cursor: "pointer",
  },
  applied: {
    background: cssVar("filter.chip.background.selected"),
    borderColor: cssVar("filter.chip.border.selected"),
  },
  clear: {
    ...typography("typography.label.small"),
    color: cssVar("color.text.action.secondary"),
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  note: { ...typography("typography.body.small"), color: cssVar("color.text.subtle"), margin: 0 },
} satisfies Record<string, CSSProperties>;
