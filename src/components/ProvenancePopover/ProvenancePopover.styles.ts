// Styles layer: which token paints which part. No logic, no raw values.
import type { CSSProperties } from "react";
import { cssVar } from "../../../dist/index";
import { typography } from "../../foundations/typography";

export const styles = {
  wrap: { display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: cssVar("space.stack.xs") },
  trigger: {
    ...typography("typography.label.small"),
    color: cssVar("color.text.link"),
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textDecoration: "underline",
  },
  unavailable: { ...typography("typography.body.small"), color: cssVar("color.text.subtle"), margin: 0 },
  panel: {
    ...typography("typography.body.small"),
    color: cssVar("color.text.default"),
    background: cssVar("color.background.surface.raised"),
    border: `${cssVar("size.stroke.default")} solid ${cssVar("color.border.default")}`,
    borderRadius: cssVar("radius.control"),
    padding: cssVar("space.inset.md"),
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: cssVar("space.stack.xs"),
  },
  meta: { margin: 0 },
} satisfies Record<string, CSSProperties>;
