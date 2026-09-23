// Adjoin token engine: loads a DTCG 2025.10 resolver, flattens each permutation,
// resolves aliases, and checks values. Zero dependencies on purpose, so CI can run it
// anywhere and every rule is readable in one place.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";

export const TYPES = ["color", "dimension", "number", "fontWeight", "fontFamily", "typography", "duration", "cubicBezier", "shadow", "border", "strokeStyle", "transition", "gradient"];
const COLOR_SPACES = ["srgb", "srgb-linear", "display-p3", "a98-rgb", "prophoto-rgb", "rec2020", "xyz-d50", "xyz-d65", "lab", "lch", "oklab", "oklch", "hsl", "hwb"];
const ALIAS = /^\{([^{}]+)\}$/;

export class Report {
  constructor() { this.errors = []; this.warnings = []; }
  error(code, message, where = {}) { this.errors.push({ code, message, ...where }); }
  warn(code, message, where = {}) { this.warnings.push({ code, message, ...where }); }
  get ok() { return this.errors.length === 0; }
}

const readJSON = (file, report) => {
  try { return JSON.parse(readFileSync(file, "utf8")); }
  catch (e) { report.error("json", `Cannot read ${file}: ${e.message}`, { file }); return null; }
};

// ---------- resolver ----------
export function loadResolver(resolverPath, report = new Report()) {
  const doc = readJSON(resolverPath, report);
  const base = dirname(resolverPath);
  if (!doc) return { report };
  if (doc.version !== "2025.10") report.error("resolver.version", `Resolver version must be "2025.10", got ${JSON.stringify(doc.version)}`, { file: resolverPath });
  if (!Array.isArray(doc.resolutionOrder)) { report.error("resolver.order", "resolutionOrder must be an array", { file: resolverPath }); return { report }; }

  const loadSources = (sources, label) => (sources || []).map(s => {
    if (!s || typeof s.$ref !== "string") { report.error("resolver.source", `${label}: every source must be a {"$ref": "..."} object`, { file: resolverPath }); return null; }
    if (s.$ref.startsWith("#")) { report.error("resolver.source", `${label}: sources must point at token files, not ${s.$ref}`, { file: resolverPath }); return null; }
    const file = join(base, s.$ref);
    if (!existsSync(file)) { report.error("resolver.missing", `${label}: source file not found: ${s.$ref}`, { file: resolverPath }); return null; }
    const tree = readJSON(file, report);
    return tree ? { file: relative(process.cwd(), file), tree } : null;
  }).filter(Boolean);

  const layers = [];
  for (const [i, item] of doc.resolutionOrder.entries()) {
    const ref = item?.$ref;
    const m = typeof ref === "string" && ref.match(/^#\/(sets|modifiers)\/([^/]+)$/);
    if (!m) { report.error("resolver.order", `resolutionOrder[${i}] must be {"$ref": "#/sets/<name>"} or {"$ref": "#/modifiers/<name>"}`, { file: resolverPath }); continue; }
    const [, kind, name] = m;
    const def = doc[kind]?.[name];
    if (!def) { report.error("resolver.pointer", `resolutionOrder[${i}] points at ${ref}, which does not exist`, { file: resolverPath }); continue; }
    if (kind === "sets") layers.push({ kind: "set", name, sources: loadSources(def.sources, `set "${name}"`) });
    else {
      const contexts = {};
      for (const [ctx, srcs] of Object.entries(def.contexts || {})) contexts[ctx] = loadSources(srcs, `modifier "${name}" context "${ctx}"`);
      if (!Object.keys(contexts).length) report.error("resolver.modifier", `modifier "${name}" has no contexts`, { file: resolverPath });
      if (def.default !== undefined && !(def.default in contexts)) report.error("resolver.modifier", `modifier "${name}" default "${def.default}" is not one of its contexts`, { file: resolverPath });
      layers.push({ kind: "modifier", name, contexts, default: def.default ?? Object.keys(contexts)[0] });
    }
  }
  return { doc, layers, report };
}

export function permutations(layers) {
  const mods = layers.filter(l => l.kind === "modifier");
  let out = [{}];
  for (const m of mods) out = out.flatMap(p => Object.keys(m.contexts).map(c => ({ ...p, [m.name]: c })));
  return out;
}
export const defaultInputs = layers => Object.fromEntries(layers.filter(l => l.kind === "modifier").map(m => [m.name, m.default]));
export const permKey = p => Object.entries(p).map(([k, v]) => `${k}=${v}`).join(",");

// ---------- parsing ----------
// Walks one file and returns a flat map path -> token record. Group $type is inherited.
function parseTree(tree, file, origin, report) {
  const out = new Map();
  const walk = (node, path, inheritedType) => {
    if (typeof node !== "object" || node === null || Array.isArray(node)) { report.error("structure", `${path.join(".") || "(root)"} must be an object`, { file }); return; }
    const type = node.$type ?? inheritedType;
    if (node.$type !== undefined && !TYPES.includes(node.$type)) report.error("structure.type", `Unknown $type "${node.$type}"`, { file, path: path.join(".") });
    const children = Object.keys(node).filter(k => !k.startsWith("$") || k === "$root");
    if ("$value" in node) {
      if (children.length) report.error("structure.token-group", `"${path.join(".")}" has a $value and child keys; a node is a token or a group, not both (use $root)`, { file, path: path.join(".") });
      out.set(path.join("."), { path: path.join("."), value: node.$value, type, declaredType: node.$type, description: node.$description, deprecated: node.$deprecated, extensions: node.$extensions, file, origin });
      return;
    }
    for (const k of children) {
      if (/[.{}]/.test(k)) report.error("structure.name", `Key "${k}" may not contain ".", "{" or "}"`, { file, path: path.join(".") });
      walk(node[k], [...path, k], type);
    }
  };
  walk(tree, [], undefined);
  return out;
}

// Flatten one permutation. Later layers override earlier ones (last occurrence wins).
export function flatten(layers, inputs, report) {
  const tokens = new Map();
  const add = (src, origin) => { for (const [p, t] of parseTree(src.tree, src.file, origin, report)) tokens.set(p, t); };
  for (const l of layers) {
    if (l.kind === "set") l.sources.forEach(s => add(s, { kind: "set", name: l.name }));
    else {
      const ctx = inputs[l.name];
      if (!(ctx in l.contexts)) { report.error("resolver.input", `No context "${ctx}" for modifier "${l.name}"`); continue; }
      l.contexts[ctx].forEach(s => add(s, { kind: "modifier", name: l.name, context: ctx }));
    }
  }
  return tokens;
}

// ---------- alias resolution ----------
export function resolveAll(tokens, report, label = "") {
  const resolved = new Map();
  const stack = [];
  const deref = (path, from) => {
    if (resolved.has(path)) return resolved.get(path);
    const t = tokens.get(path);
    if (!t) return undefined;
    if (stack.includes(path)) { report.error("reference.cycle", `Circular reference: ${[...stack, path].join(" → ")}`, { file: t.file, path }); return undefined; }
    stack.push(path);
    const r = resolveValue(t.value, t);
    stack.pop();
    const type = t.type ?? r?.type;
    const out = r && { value: r.value, type, chain: r.chain };
    resolved.set(path, out);
    return out;
  };
  const resolveValue = (value, t) => {
    if (typeof value === "string") {
      const m = value.match(ALIAS);
      if (m) {
        const target = m[1];
        if (!tokens.has(target)) {
          report.error("reference.unresolved", `${t.path} → {${target}} does not resolve${label ? ` (${label})` : ""}${suggest(target, tokens)}`, { file: t.file, path: t.path, target });
          return undefined;
        }
        const tt = tokens.get(target);
        if (tt.deprecated) report.warn("reference.deprecated", `${t.path} references deprecated {${target}}${typeof tt.deprecated === "string" ? `: ${tt.deprecated}` : ""}`, { file: t.file, path: t.path, target });
        const r = deref(target);
        return r && { value: r.value, type: r.type, chain: [target, ...(r.chain || [])] };
      }
      return { value, chain: [] };
    }
    if (value && typeof value === "object" && !Array.isArray(value) && t.type === "typography") {
      const out = {}; let ok = true;
      for (const [k, v] of Object.entries(value)) { const r = resolveValue(v, t); if (!r) { ok = false; continue; } out[k] = r.value; }
      return ok ? { value: out, chain: [] } : undefined;
    }
    return { value, chain: [] };
  };
  for (const p of tokens.keys()) deref(p);
  return resolved;
}

function suggest(target, tokens) {
  const near = nearest(target, [...tokens.keys()].filter(p => p.split(".")[0] === target.split(".")[0]), 2);
  return near.length ? `. Did you mean ${near.map(n => `{${n}}`).join(" or ")}?` : "";
}

// Closest names by edit distance, for "did you mean" hints.
export function nearest(name, candidates, n = 2) {
  const dist = (a, b) => {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let prev = row[0]; row[0] = i;
      for (let j = 1; j <= b.length; j++) { const tmp = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = tmp; }
    }
    return row[b.length];
  };
  return candidates.map(c => [c, dist(name, c)]).sort((a, b) => a[1] - b[1]).slice(0, n).filter(([, d]) => d <= Math.max(6, name.length / 3)).map(([c]) => c);
}

// ---------- value checks ----------
const isNum = v => typeof v === "number" && Number.isFinite(v);
export function checkValue(t, r, report) {
  if (!r) return;
  const { type, value } = r; const where = { file: t.file, path: t.path };
  if (!type) { report.error("value.type", `${t.path} has no $type (declare it on the token or a parent group)`, where); return; }
  if (t.declaredType && r.chain.length && r.type && t.declaredType !== r.type) report.error("value.type", `${t.path} is ${t.declaredType} but aliases a ${r.type}`, where);
  const bad = msg => report.error("value.shape", `${t.path}: ${msg}`, where);
  switch (type) {
    case "color":
      if (typeof value !== "object" || value === null) return bad("color must be an object with colorSpace and components");
      if (!COLOR_SPACES.includes(value.colorSpace)) bad(`unknown colorSpace "${value.colorSpace}"`);
      if (!Array.isArray(value.components) || value.components.length !== 3 || !value.components.every(c => isNum(c) || c === "none")) bad("components must be 3 numbers (or \"none\")");
      if (value.alpha !== undefined && !(isNum(value.alpha) && value.alpha >= 0 && value.alpha <= 1)) bad("alpha must be between 0 and 1");
      if (value.hex !== undefined && !/^#[0-9a-fA-F]{6}$/.test(value.hex)) bad("hex fallback must be #rrggbb");
      break;
    case "dimension":
      if (!value || !isNum(value.value) || !["px", "rem"].includes(value.unit)) bad('dimension must be {"value": number, "unit": "px" | "rem"}'); break;
    case "duration":
      if (!value || !isNum(value.value) || !["ms", "s"].includes(value.unit)) bad('duration must be {"value": number, "unit": "ms" | "s"}'); break;
    case "number": if (!isNum(value)) bad("number must be a number"); break;
    case "fontWeight": if (!(isNum(value) && value >= 1 && value <= 1000) && typeof value !== "string") bad("fontWeight must be 1–1000 or a keyword"); break;
    case "fontFamily": if (!(typeof value === "string" || (Array.isArray(value) && value.every(s => typeof s === "string")))) bad("fontFamily must be a string or array of strings"); break;
    case "typography":
      for (const k of ["fontFamily", "fontSize", "fontWeight", "letterSpacing", "lineHeight"]) if (!(k in (value || {}))) bad(`typography is missing ${k}`);
      if (value && !isNum(value.lineHeight)) bad("typography lineHeight must be a unitless number");
      break;
  }
}

// ---------- naming ----------
export const cssName = path => "--adjoin-" + path.split(".").filter(s => s !== "$root").join("-");
export const publicPath = path => path.split(".").filter(s => s !== "$root").join(".");
