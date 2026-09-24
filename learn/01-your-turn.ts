// Your turn: QueryStatus, the strip above a chart that says what the query is doing.
// Two states are done for you. Fill in the other three by copying the pattern.
// After each step, save and run `npm run learn` in the terminal.

// ---------------------------------------------------------------------------
// PART 1: describe each state
// ---------------------------------------------------------------------------

export type QueryStatusProps =
  // DONE: idle means nothing has run yet, so it has no other fields.
  | { status: "idle" }

  // DONE: running has a start time. `progress?` has a ? because it's optional.
  | { status: "running"; startedAt: Date; progress?: number }

  // succeeded has `rowCount` (a number) and `durationMs` (a number).
  | { status: "succeeded"; rowCount: number; durationMs: number }

  // failed has `message` (text) and `retryable` (true or false).
  | { status: "failed"; message: string; retryable: boolean }

  // cancelled has `cancelledBy`, which can only be the word "user" or the word "timeout".
  | { status: "cancelled"; cancelledBy: "user" | "timeout" }
  ;

// ---------------------------------------------------------------------------
// PART 2: examples that should work
// ---------------------------------------------------------------------------

export const good: QueryStatusProps[] = [
  { status: "idle" },
  { status: "running", startedAt: new Date() },
  { status: "running", startedAt: new Date(), progress: 0.4 },
  { status: "succeeded", rowCount: 1204, durationMs: 380 },
  { status: "failed", message: "Timed out", retryable: true },
  { status: "cancelled", cancelledBy: "user" },
];

// ---------------------------------------------------------------------------
// PART 3: examples that must NOT work
// Each line below is a mistake. The @ts-expect-error line above it says
// "this next line should be an error". If it isn't, `npm run learn` complains.
// ---------------------------------------------------------------------------

export const bad: QueryStatusProps[] = [
  // @ts-expect-error: running needs a start time
  { status: "running" },
  // @ts-expect-error: idle has no progress
  { status: "idle", progress: 0.5 },
  // @ts-expect-error: failed has no rowCount
  { status: "failed", message: "Timed out", retryable: true, rowCount: 10 },
  // @ts-expect-error: cancelledBy can only be "user" or "timeout"
  { status: "cancelled", cancelledBy: "admin" },
];
