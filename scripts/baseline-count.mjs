#!/usr/bin/env node
// Counts type errors in the baseline agent's dashboard, and groups them by kind.
// Only errors in src/dashboard/ count: the rest of the repo is known to pass.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const FILE = "src/dashboard/Dashboard.tsx";
if (!existsSync(FILE)) { console.error(`${FILE} doesn't exist yet. Run the baseline prompt first.`); process.exit(1); }

spawnSync("node", ["scripts/build.mjs"], { stdio: "ignore" });
const r = spawnSync("npx", ["tsc", "-p", "src", "--pretty", "false"], { encoding: "utf8" });
const errors = r.stdout.split("\n").filter(l => l.startsWith("src/dashboard/") && l.includes("error TS"));

const byCode = {};
for (const l of errors) { const code = l.match(/error (TS\d+)/)[1]; (byCode[code] ??= []).push(l); }

console.log(`\n${errors.length} type error${errors.length === 1 ? "" : "s"} in ${FILE}\n`);
for (const [code, list] of Object.entries(byCode).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${String(list.length).padStart(3)}  ${code}  e.g. ${list[0].replace(/^.*error TS\d+: /, "").slice(0, 110)}`);
}
