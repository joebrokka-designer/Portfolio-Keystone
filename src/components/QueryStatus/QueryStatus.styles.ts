// Styles layer: which token paints which part. No logic, no raw values.
import type { CSSProperties } from "react";
import { cssVar, type ColorToken } from "../../../dist/index";
import { typography } from "../../foundations/typography";

/** The four looks a status line can have. Each maps to one color, by meaning. */
export type Tone = "neutral" | "info" | "success" | "danger";

const toneColor = {
  neutral: "color.text.subtle",
  info: "color.icon.feedback.info",
  success: "color.icon.feedback.success",
  danger: "color.icon.feedback.danger",
} satisfies Record<Tone, ColorToken>;

export const styles = {
  strip: {
    ...typography("typography.body.small"),
    color: cssVar("color.text.default"),
    display: "flex",
    alignItems: "center",
    gap: cssVar("space.inline.sm"),
    margin: 0,
  },
  track: {
    width: "6em",
    height: "0.4em",
    borderRadius: cssVar("radius.control"),
    background: cssVar("color.background.surface.sunken"),
    overflow: "hidden",
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
  },
} satisfies Record<string, CSSProperties>;

export const dot = (tone: Tone): CSSProperties => ({
  width: "0.5em",
  height: "0.5em",
  borderRadius: "50%",
  flexShrink: 0,
  background: cssVar(toneColor[tone]),
});

export const fill = (share: number): CSSProperties => ({
  width: `${share * 100}%`,
  height: "100%",
  background: cssVar("color.background.action.primary"),
});
