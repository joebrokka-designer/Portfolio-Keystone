#!/usr/bin/env node
// Adjoin token CI gate. Validates structure, resolves every reference in every
// theme × density permutation, and enforces the naming and tier rules from the
// taxonomy doc. Exits 1 on any error. `--json` prints machine-readable results.
import { loadResolver, flatten, resolveAll, checkValue, permutations, permKey, Report, cssName, publicPath } from "./lib/tokens.mjs";

const RESOLVER = process.argv.find(a => a.endsWith(".resolver.json")) ?? "tokens/adjoin.resolver.json";
const JSON_OUT = process.argv.includes("--json");

// ---- rules (mirrors "Grammar and lint rules" in the taxonomy doc) ----
const TIER_OF_SET = { primitives: "primitive", "semantic-static": "semantic", components: "component" };
const MODIFIER_SCOPE = { theme: { only: ["color"] }, density: { never: ["color"] } };
const COLOR_PROPERTIES = ["background", "text", "border", "icon", "mark"];
const COLOR_CONCEPTS = ["surface", "action", "feedback", "insight", "selection", "focus", "delta", "categorical", "sequential", "diverging", "target", "reference", "annotation", "missing"];
const WEIGHT_WORDS = ["default", "subtle", "strong", "disabled", "inverse", "link"];
const COMPONENT_PROPERTIES = ["background", "text", "border", "icon", "color", "padding-inline", "padding-block", "gap", "height", "radius", "typography", "stroke-width"];
const STATES = ["hover", "pressed", "selected", "emphasis", "on-emphasis"];
// Heading levels are ordinal (h1–h3), so they may use numbers like primitives and mark scales.
const NUMERIC_OK = ["palette.", "scale.", "color.mark.", "typography.heading."];
const SEGMENT = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const NUMERIC = /^\d+(-\d+)?$/;

const report = new Report();
let all, perms;
const { layers } = loadResolver(RESOLVER, report);
if (!layers) finish();

const tierOf = t => t.origin.kind === "modifier" ? "semantic" : (TIER_OF_SET[t.origin.name] ?? "semantic");
perms = permutations(layers);
const pathsByContext = {};
let reference; // the default permutation, used for per-token rules

for (const p of perms) {
  const tokens = flatten(layers, p, report);
  const resolved = resolveAll(tokens, report, permKey(p));
  for (const [path, t] of tokens) checkValue(t, resolved.get(path), report);
  reference ??= tokens;
  for (const [path, t] of tokens) if (t.origin.kind === "modifier") {
    const key = `${t.origin.name}:${t.origin.context}`;
    (pathsByContext[key] ??= new Set()).add(path);
  }
}

// ---- per-token rules on the union of all permutations ----
all = new Map();
for (const p of perms) for (const [k, t] of flatten(layers, p, new Report())) if (!all.has(k)) all.set(k, t);

const seenCss = new Map(), seenPublic = new Map();
for (const [path, t] of all) {
  const where = { file: t.file, path };
  const tier = tierOf(t);
  const segs = path.split(".");
  for (const s of segs) {
    if (s === "$root") continue;
    if (NUMERIC.test(s)) { if (!NUMERIC_OK.some(p => path.startsWith(p))) report.error("name.numeric", `${path}: numeric segments are only allowed in primitives, color.mark scales and heading levels`, where); }
    else if (!SEGMENT.test(s)) report.error("name.case", `${path}: segment "${s}" must be lowercase kebab-case`, where);
  }
  if (tier === "semantic" && segs[0] === "color") {
    if (!COLOR_PROPERTIES.includes(segs[1])) report.error("name.property", `${path}: second segment must be one of ${COLOR_PROPERTIES.join(", ")}`, where);
    if (!COLOR_CONCEPTS.includes(segs[2]) && !WEIGHT_WORDS.includes(segs[2])) report.error("name.concept", `${path}: third segment "${segs[2]}" is not a known concept or weight word`, where);
  }
  if (tier === "component") {
    const s = segs.filter(x => x !== "$root");
    const last = s.at(-1), prev = s.at(-2);
    if (!COMPONENT_PROPERTIES.includes(last) && !(STATES.includes(last) && COMPONENT_PROPERTIES.includes(prev)))
      report.error("name.component-property", `${path}: must end in a property (${COMPONENT_PROPERTIES.join(", ")}) or property.state`, where);
  }
  // raw values and alias direction
  if (tier !== "primitive") {
    const refs = aliasesIn(t.value);
    if (refs === null) report.error("tier.raw-value", `${path}: ${tier} tokens must alias other tokens, not hold raw values`, where);
    for (const r of refs ?? []) {
      const target = all.get(r); if (!target) continue;
      const tt = tierOf(target);
      if (tier === "component" && tt !== "semantic") report.error("tier.direction", `${path}: component tokens may only alias semantic tokens, not ${tt} {${r}}`, where);
      if (tier === "semantic" && tt === "component") report.error("tier.direction", `${path}: semantic tokens may not alias component tokens ({${r}})`, where);
    }
  }
  if (tier === "semantic" && !t.description) report.error("doc.description", `${path}: semantic tokens need a $description written for an agent`, where);
  // output name collisions
  if (tier !== "primitive") {
    const pub = publicPath(path);
    if (seenPublic.has(pub) && seenPublic.get(pub) !== path) report.error("name.collision", `${path} and ${seenPublic.get(pub)} both publish as "${pub}"`, where);
    seenPublic.set(pub, path);
  }
  const css = cssName(path);
  if (seenCss.has(css) && seenCss.get(css) !== path) report.error("name.collision", `${path} and ${seenCss.get(css)} both emit ${css}`, where);
  seenCss.set(css, path);
}

// ---- mode rules ----
for (const l of layers.filter(l => l.kind === "modifier")) {
  const ctxs = Object.keys(l.contexts);
  const union = new Set(ctxs.flatMap(c => [...(pathsByContext[`${l.name}:${c}`] ?? [])]));
  for (const c of ctxs) {
    const have = pathsByContext[`${l.name}:${c}`] ?? new Set();
    for (const p of union) if (!have.has(p)) report.error("mode.missing", `${p} is defined in some ${l.name} contexts but not in "${c}"`, { path: p });
    const scope = MODIFIER_SCOPE[l.name];
    for (const p of have) {
      const cat = p.split(".")[0];
      if (scope?.only && !scope.only.includes(cat)) report.error("mode.scope", `${l.name}:${c} defines ${p}; ${l.name} may only define ${scope.only.join(", ")}.*`, { path: p });
      if (scope?.never?.includes(cat)) report.error("mode.scope", `${l.name}:${c} defines ${p}; ${l.name} must never define ${cat}.*`, { path: p });
    }
  }
}

finish();

function aliasesIn(v) {
  if (typeof v === "string") { const m = v.match(/^\{([^{}]+)\}$/); return m ? [m[1]] : null; }
  if (v && typeof v === "object" && !Array.isArray(v) && !("colorSpace" in v) && !("unit" in v)) {
    const out = []; for (const x of Object.values(v)) { const r = aliasesIn(x); if (r === null) return null; out.push(...r); } return out;
  }
  return null;
}

function finish() {
  const dedupe = list => [...new Map(list.map(e => [e.code + e.message.replace(/ \([^)]*=[^)]*\)/, ""), { ...e, message: e.message.replace(/ \((theme|density)=[^)]*\)/, "") }])).values()];
  const errors = dedupe(report.errors), warnings = dedupe(report.warnings);
  if (JSON_OUT) { console.log(JSON.stringify({ ok: !errors.length, errors, warnings, permutations: perms?.length ?? 0 }, null, 2)); process.exit(errors.length ? 1 : 0); }
  const gh = process.env.GITHUB_ACTIONS === "true";
  for (const w of warnings) console.log(gh ? `::warning file=${w.file ?? RESOLVER}::${w.message}` : `warning  ${w.code}  ${w.message}`);
  for (const e of errors) console.log(gh ? `::error file=${e.file ?? RESOLVER}::${e.message}` : `error    ${e.code}  ${e.message}${e.file ? `\n         in ${e.file}` : ""}`);
  console.log(`\n${errors.length ? "✗" : "✓"} ${all?.size ?? 0} tokens, ${perms?.length ?? 0} permutations, ${errors.length} errors, ${warnings.length} warnings`);
  process.exit(errors.length ? 1 : 0);
}
