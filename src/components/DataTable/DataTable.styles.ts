// Styles layer: which token paints which part. No logic, no raw values.
import type { CSSProperties } from "react";
import { cssVar } from "../../../dist/index";
import { typography } from "../../foundations/typography";

export const styles = {
  frame: {
    background: cssVar("color.background.surface.default"),
    border: `${cssVar("size.stroke.default")} solid ${cssVar("color.border.subtle")}`,
    borderRadius: cssVar("radius.container"),
    overflow: "hidden",
  },
  caption: {
    ...typography("typography.label.default"),
    color: cssVar("color.text.subtle"),
    textAlign: "left",
    padding: cssVar("space.inset.md"),
  },
  table: { width: "100%", borderCollapse: "collapse" },
  headerCell: {
    ...typography("table.header.typography"),
    color: cssVar("table.header.text"),
    background: cssVar("table.header.background"),
    textAlign: "left",
    padding: `${cssVar("table.cell.padding-block")} ${cssVar("table.cell.padding-inline")}`,
    borderBottom: `${cssVar("size.stroke.default")} solid ${cssVar("table.row.border")}`,
  },
  headerNumber: { textAlign: "right" },
  cell: {
    ...typography("typography.body.small"),
    color: cssVar("color.text.default"),
    height: cssVar("table.row.height"),
    padding: `${cssVar("table.cell.padding-block")} ${cssVar("table.cell.padding-inline")}`,
    borderBottom: `${cssVar("size.stroke.default")} solid ${cssVar("table.row.border")}`,
  },
  numberCell: {
    ...typography("table.cell.numeric.typography"),
    textAlign: "right",
  },
  note: {
    ...typography("typography.body.small"),
    color: cssVar("color.text.subtle"),
    margin: 0,
    padding: cssVar("space.inset.md"),
  },
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
