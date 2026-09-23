#!/usr/bin/env node
// Fails when consumer code references an Adjoin CSS variable that doesn't exist,
// or reaches past the semantic layer to a primitive. CSS fails silently on an unknown
// custom property (it falls back to the initial value), so this lint is the only alarm.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { nearest } from "./lib/tokens.mjs";

const roots = process.argv.slice(2).filter(a => !a.startsWith("-"));
if (!roots.length) roots.push("examples");
if (!existsSync("dist/css-vars.json")) { console.log("✗ dist/css-vars.json missing. Run `npm run build` first."); process.exit(1); }
const vars = JSON.parse(readFileSync("dist/css-vars.json", "utf8"));
const known = new Set(vars.public), primitive = new Set(vars.primitive), deprecated = vars.deprecated ?? {};
const EXT = [".css", ".scss", ".ts", ".tsx", ".js", ".jsx", ".html", ".vue", ".svelte"];
const USE = /var\(\s*(--adjoin-[a-z0-9-]+)/g;
const gh = process.env.GITHUB_ACTIONS === "true";

const files = [];
const walk = d => { for (const f of readdirSync(d)) { if (f === "node_modules" || f === "dist") continue; const p = join(d, f); statSync(p).isDirectory() ? walk(p) : EXT.includes(extname(p)) && files.push(p); } };
roots.forEach(r => existsSync(r) && walk(r));

let errors = 0, warnings = 0;
for (const file of files) {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    for (const m of line.matchAll(USE)) {
      const name = m[1];
      let msg = null;
      if (primitive.has(name)) msg = `${name} is a primitive. Use a semantic token instead; primitives are not part of the public contract.`;
      else if (!known.has(name)) {
        const near = nearest(name, vars.public, 2);
        msg = `${name} is not an Adjoin token.${near.length ? ` Did you mean ${near.join(" or ")}?` : ""}`;
      }
      if (!msg && deprecated[name]) { warnings++; const w = `${name} is deprecated: ${deprecated[name]}`; console.log(gh ? `::warning file=${file},line=${i + 1}::${w}` : `warning  ${file}:${i + 1}  ${w}`); }
      if (msg) { errors++; console.log(gh ? `::error file=${file},line=${i + 1}::${msg}` : `error  ${file}:${i + 1}  ${msg}`); }
    }
  });
}
console.log(`\n${errors ? "✗" : "✓"} ${files.length} files checked, ${errors} unknown or primitive token reference(s), ${warnings} deprecated`);
process.exit(errors ? 1 : 0);
