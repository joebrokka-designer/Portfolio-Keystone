// The contract, as code: things an agent might write, and whether they compile.
// `npm run typecheck:components` fails if any @ts-expect-error line stops being an error.
import { toCount, toFraction, toMeasure } from "../../foundations/brands";
import { QueryStatus } from "./QueryStatus";

export const valid = [
  <QueryStatus status="idle" />,
  <QueryStatus status="running" startedAt={new Date()} progress={toFraction(0.4)} />,
  <QueryStatus status="succeeded" rowCount={toCount(1204)} durationMs={toMeasure(380)} />,
  <QueryStatus status="failed" message="The warehouse timed out" retryable={true} onRetry={() => {}} />,
  <QueryStatus status="failed" message="You don't have access to this dataset" retryable={false} />,
  <QueryStatus status="cancelled" cancelledBy="user" />,
];

export const invalid = [
  // @ts-expect-error: a retryable failure needs something to call when "Try again" is clicked
  <QueryStatus status="failed" message="The warehouse timed out" retryable={true} />,
  // @ts-expect-error: a final failure can't offer a retry
  <QueryStatus status="failed" message="You don't have access" retryable={false} onRetry={() => {}} />,
  // @ts-expect-error: a failed query has no rows
  <QueryStatus status="failed" message="Timed out" retryable={false} rowCount={toCount(10)} />,
  // @ts-expect-error: progress must go through toFraction, so 1.5 can't sneak in
  <QueryStatus status="running" startedAt={new Date()} progress={1.5} />,
  // @ts-expect-error: rows must be counted by toCount
  <QueryStatus status="succeeded" rowCount={1204} durationMs={toMeasure(380)} />,
  // @ts-expect-error: only a person or a timeout can cancel a query
  <QueryStatus status="cancelled" cancelledBy="admin" />,
  // @ts-expect-error: no className escape hatch
  <QueryStatus status="idle" className="mt-4" />,
];
