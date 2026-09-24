// Your turn: QueryStatus, the strip above a chart that says what the query is doing.
//
// The rules:
//   idle       nothing has run yet
//   running    has `startedAt` (a Date); `progress` (0 to 1) is optional because not every engine reports it
//   succeeded  has `rowCount` and `durationMs`
//   failed     has `message`, and `retryable` (a boolean) so the UI knows whether to offer "Retry"
//   cancelled  has `cancelledBy`: either "user" or "timeout"
//
// 1. Replace `unknown` below with a discriminated union, one member per state.
// 2. Fill `good` with one valid example of each state.
// 3. Write at least three cases in `bad`, each with a @ts-expect-error line above it.
//    Pick combinations an agent might plausibly write, like a failed query with a rowCount.
// 4. Run `npm run learn`. It passes when your good cases compile and every bad case fails.
//
// Something to think about: can a type stop `progress: 1.5`? Try it, and note what you find.
// That limit is what branded types (lesson 4) are for.

export type QueryStatusProps = unknown; // TODO

export const good: QueryStatusProps[] = [
  // TODO
];

export const bad: QueryStatusProps[] = [
  // TODO
];
