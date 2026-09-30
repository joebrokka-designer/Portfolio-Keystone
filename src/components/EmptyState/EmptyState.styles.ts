// Styles layer: which token paints which part. No logic, no raw values.
import type { CSSProperties } from "react";
import { cssVar } from "../../../dist/index";
import { typography } from "../../foundations/typography";

export const styles = {
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: cssVar("space.stack.xs"),
    padding: cssVar("space.inset.lg"),
    borderRadius: cssVar("radius.container"),
    border: `${cssVar("size.stroke.default")} solid ${cssVar("color.border.subtle")}`,
    background: cssVar("color.background.surface.default"),
    margin: 0,
  },
  title: { ...typography("typography.heading.3"), color: cssVar("color.text.default"), margin: 0 },
  description: { ...typography("typography.body.small"), color: cssVar("color.text.subtle"), margin: 0 },
  action: {
    ...typography("typography.label.small"),
    alignSelf: "flex-start",
    color: cssVar("color.text.action.secondary"),
    background: cssVar("color.background.action.secondary"),
    border: `${cssVar("size.stroke.default")} solid ${cssVar("color.border.action.secondary")}`,
    borderRadius: cssVar("radius.control"),
    paddingInline: cssVar("space.inset.sm"),
    height: cssVar("size.control.height.sm"),
    cursor: "pointer",
  },
} satisfies Record<string, CSSProperties>;
