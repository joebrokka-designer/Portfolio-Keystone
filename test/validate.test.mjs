// Proves the CI gate catches each class of mistake. Each case copies the real tokens,
// breaks one thing, and asserts validate.mjs reports the expected error code.
import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function run(mutate) {
  const dir = mkdtempSync(join(tmpdir(), "adjoin-"));
  cpSync("tokens", join(dir, "tokens"), { recursive: true });
  const edit = (file, fn) => { const p = join(dir, "tokens", file); const d = JSON.parse(readFileSync(p, "utf8")); fn(d); writeFileSync(p, JSON.stringify(d)); };
  mutate?.(edit);
  const r = spawnSync("node", ["scripts/validate.mjs", join(dir, "tokens/adjoin.resolver.json"), "--json"], { encoding: "utf8" });
  return JSON.parse(r.stdout);
}
const codes = r => r.errors.map(e => e.code);

test("the real tokens pass", () => { const r = run(); assert.equal(r.ok, true, JSON.stringify(r.errors, null, 2)); assert.equal(r.permutations, 6); });

test("renaming a semantic token breaks the component that aliases it", () => {
  const r = run(e => ["theme/light.tokens.json", "theme/dark.tokens.json"].forEach(f => e(f, d => {
    const fb = d.color.background.feedback; fb.critical = fb.danger; delete fb.danger;
  })));
  assert.ok(codes(r).includes("reference.unresolved"));
  assert.match(r.errors[0].message, /alert\.danger\.background/);
});

test("a raw value in the semantic tier fails", () => {
  const r = run(e => e("theme/light.tokens.json", d => { d.color.text.default.$value = { colorSpace: "srgb", components: [0, 0, 0], hex: "#000000" }; }));
  assert.ok(codes(r).includes("tier.raw-value"));
});

test("a component aliasing a primitive fails", () => {
  const r = run(e => e("components.tokens.json", d => { d.kpi.background.$value = "{palette.white}"; }));
  assert.ok(codes(r).includes("tier.direction"));
});

test("theme may not define spacing", () => {
  const r = run(e => ["theme/light.tokens.json", "theme/dark.tokens.json"].forEach(f => e(f, d => { d.space = { $type: "dimension", gutter: { $value: "{scale.space.8}", $description: "x" } }; })));
  assert.ok(codes(r).includes("mode.scope"));
});

test("a token defined in light but not dark fails", () => {
  const r = run(e => e("theme/dark.tokens.json", d => { delete d.color.text.link; }));
  assert.ok(codes(r).includes("mode.missing"));
});

test("semantic tokens need a description", () => {
  const r = run(e => e("theme/light.tokens.json", d => { delete d.color.text.subtle.$description; }));
  assert.ok(codes(r).includes("doc.description"));
});

test("circular references are caught", () => {
  const r = run(e => ["theme/light.tokens.json", "theme/dark.tokens.json"].forEach(f => e(f, d => {
    d.color.text.default.$value = "{color.text.subtle}"; d.color.text.subtle.$value = "{color.text.default}";
  })));
  assert.ok(codes(r).includes("reference.cycle"));
});

test("a node cannot be both token and group", () => {
  const r = run(e => e("components.tokens.json", d => { d.kpi.background.hover = { $type: "color", $value: "{color.background.surface.hover}" }; }));
  assert.ok(codes(r).includes("structure.token-group"));
});

test("dimensions need px or rem", () => {
  const r = run(e => e("primitives.tokens.json", d => { d.scale.space["8"].$value.unit = "em"; }));
  assert.ok(codes(r).includes("value.shape"));
});

test("property-first naming is enforced", () => {
  const r = run(e => ["theme/light.tokens.json", "theme/dark.tokens.json"].forEach(f => e(f, d => { d.color.fill = { thing: { $value: "{palette.white}", $description: "x" } }; })));
  assert.ok(codes(r).includes("name.property"));
});

test("a deprecated alias keeps CI green but warns", () => {
  const r = run(e => ["theme/light.tokens.json", "theme/dark.tokens.json"].forEach(f => e(f, d => {
    const fb = d.color.background.feedback;
    fb.critical = fb.danger;
    fb.danger = {
      $root: { $value: "{color.background.feedback.critical.$root}", $deprecated: "Renamed to color.background.feedback.critical.", $description: "Deprecated alias." },
      emphasis: { $value: "{color.background.feedback.critical.emphasis}", $deprecated: "Renamed to color.background.feedback.critical.emphasis.", $description: "Deprecated alias." },
    };
  })));
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  assert.ok(r.warnings.some(w => w.code === "reference.deprecated"));
});
