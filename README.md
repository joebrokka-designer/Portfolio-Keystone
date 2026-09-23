# Adjoin tokens

Design tokens for Adjoin, a design system for data-dense analytics products. The source is DTCG 2025.10; the build emits CSS custom properties, a typed TypeScript module and a `TokenPath` union; CI fails any pull request that leaves a reference dangling.

The naming, tiers and palette decisions live in the Adjoin Token Taxonomy doc. This repo is that doc made executable.

## Layout

```
tokens/
  adjoin.resolver.json        entry point: sets, modifiers and resolution order
  primitives.tokens.json      palette.* and scale.*: raw values, never used by consumers
  semantic.static.tokens.json radius, stroke and opacity: same in every mode
  theme/{light,dark}.tokens.json            color.* only
  density/{compact,comfortable,spacious}.tokens.json   space.*, size.*, typography.* only
  components.tokens.json      chart.*, table.*, kpi.*, filter.*, button.*, alert.*, insight.*
scripts/
  lib/tokens.mjs              resolver loader, alias resolution, value checks
  validate.mjs                the CI gate
  build.mjs                   emits dist/
  lint-css-vars.mjs           catches unknown or primitive var(--adjoin-*) in consumer code
examples/dashboard/           a consumer: CSS and TypeScript that use the tokens
test/                         proves the gate catches each class of mistake
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run validate` | Resolves every token in all 6 theme × density permutations and enforces the taxonomy rules |
| `npm run build` | Writes `dist/tokens.css`, `dist/tokens.d.ts`, `dist/index.ts`, `dist/css-vars.json` |
| `npm run lint:css` | Fails on `var(--adjoin-…)` names that don't exist or that point at primitives |
| `npm run typecheck` | Compiles the example consumer against the generated `TokenPath` |
| `npm test` | 12 cases, each breaking one rule and checking the gate notices |
| `npm run check` | All of the above |

Requires Node 22. The scripts have no dependencies; TypeScript is the only dev dependency.

## How modes work

The resolver defines two modifiers. `theme` (light, dark) may only define `color.*`; `density` (compact, comfortable, spacious) may never define `color.*`. Because they never overlap, the CSS is additive: one block per context, and any combination works by setting both attributes.

```html
<html data-theme="dark" data-density="compact">
```

Modes nest. Component tokens are re-declared on every `[data-theme]` and `[data-density]` container, because a `var()` is computed where it is declared: without that, a dark panel inside a light page would inherit light button colors from `:root`.

## Using tokens

```ts
import { cssVar, resolve, type ColorToken, type TypographyToken } from "@adjoin/tokens";

cssVar("color.background.feedback.danger");    // "var(--adjoin-color-background-feedback-danger)", typed as that exact string
resolve("color.mark.categorical.1", { theme: "dark" }); // "#4fb5f6", for canvas and chart libraries
function Value({ font }: { font: TypographyToken }) {}  // only typography tokens are accepted
```

`TokenPath` excludes `palette.*` and `scale.*`. Every exposed primitive is a place an agent would guess a raw value instead of choosing by meaning.

## The rename demo

The Phase 1 deliverable: rename a semantic token and watch CI fail in three places.

1. On a branch, rename `danger` to `critical` under `color.background.feedback` in both `tokens/theme/*.tokens.json` files. Change nothing else.
2. Open the pull request. All three jobs fail:
   - **Token graph resolves:** `alert.danger.background → {color.background.feedback.danger.$root} does not resolve.` The hint suggests `warning` or `info`, the nearest names by spelling; it can't know you meant a rename.
   - **TypeScript consumers compile:** `alert.ts` fails with `"color.background.feedback.danger"` not assignable to `TokenPath`, including the template-literal call that builds the path from a tone.
   - **CSS references exist:** `alert.css:9 --adjoin-color-background-feedback-danger is not an Adjoin token.` Without this lint the stylesheet would ship and silently render with no background.
3. The follow-up: keep `danger` as a deprecated alias of `critical` (`"$deprecated": "Renamed to …"`). CI goes green with warnings on every remaining use, and `DeprecatedTokenPath` lists what to migrate before the next major version.

## Decisions made while building

These refine the taxonomy doc; each is small, but worth being able to explain.

- **Line height is a ratio.** DTCG `typography.lineHeight` is a unitless number, so the px line heights became three ratios: `tight` 1.2, `snug` 1.33, `normal` 1.45. Some line heights move by up to 1px.
- **Heading levels may be numeric.** `typography.heading.1`–`.3` are ordinal, like h1–h3, so the numeric-segment rule allows them.
- **`annotation` and `missing` are concepts.** They were in the doc's tables but not its concept list; the validator's list is now the source of truth.
- **Every CSS variable is prefixed `--adjoin-`.** It prevents collisions with product CSS and lets the lint check only Adjoin names.
- **Zero-dependency scripts instead of Terrazzo, for now.** They were written where no packages could be installed, and they keep every rule readable in one file. Swapping the CSS output to Terrazzo is a good exercise for comparing the two; the validator stays either way, because the tier and mode rules are Adjoin's, not the tool's.
- **`npm install` in CI, not `npm ci`.** There is no lockfile yet. Run `npm install` once locally, commit `package-lock.json`, then switch the workflow to `npm ci`.
