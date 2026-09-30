# Baseline: a fresh agent, no help

The Phase 2 test from the curriculum: hand an agent this repo with no MCP server and no rules file, ask for a dashboard, and count the type errors. The number is the baseline that Phase 5 measures improvements against, so every run has to be done the same way.

## Rules for a fair run

- **Fresh session.** A new Claude Code session with no history. Not a session that has seen this repo being built.
- **No help.** No `CLAUDE.md`, `AGENTS.md`, MCP server or rules file in the repo. Check with `ls CLAUDE.md AGENTS.md` (both should be missing).
- **Same prompt.** Paste [prompt.md](prompt.md) exactly. Don't add hints.
- **One pass.** The prompt tells the agent not to run the type checker. We're measuring what it writes first, not what it can fix.
- **Its own branch.** Start from `phase2` on a branch named `baseline-run-N`, so the run never lands on `main`.

## Steps

```bash
git checkout -b baseline-run-1 phase2
```

1. Open a new Claude Code session in this folder and paste the contents of `baseline/prompt.md`.
2. When it's done, count the errors:

```bash
npm run baseline:count
```

3. Add a row to the results table below: date, model, error count, and the most common kinds of error.
4. Commit the dashboard and the results on the run branch.

## Results

| Run | Date | Agent and model | Type errors | Most common kinds |
|---|---|---|---|---|
| 1 | | | | |
