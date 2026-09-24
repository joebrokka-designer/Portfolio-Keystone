import type { CSSProperties } from "react";
import type { TokenPath, TokenTypeMap } from "../../dist/index";

type Kebab<S extends string> = S extends `${infer A}.${infer B}` ? `${A}-${Kebab<B>}` : S;

/** Any token whose $type is typography, including component tokens like kpi.value.typography. */
export type AnyTypographyToken = { [P in TokenPath]: TokenTypeMap[P] extends "typography" ? P : never }[TokenPath];

/**
 * Style properties for a typography token. The `font` shorthand can't carry letter spacing or
 * numeric features, so those come from their own variables. Numeric styles set "tnum" here,
 * which keeps digits in even columns.
 */
export function typography<T extends AnyTypographyToken>(token: T): CSSProperties {
  const name = `--adjoin-${token.replaceAll(".", "-") as Kebab<T>}`;
  return {
    font: `var(${name})`,
    letterSpacing: `var(${name}-letter-spacing)`,
    fontFeatureSettings: `var(${name}-font-feature-settings)`,
  };
}
