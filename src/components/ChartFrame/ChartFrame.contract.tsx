// The contract, as code: things an agent might write, and whether they compile.
import { ChartFrame } from "./ChartFrame";

export const valid = [
  <ChartFrame status="loading" title="Revenue by week" />,
  <ChartFrame status="empty" title="Revenue by week" reason="No orders in this date range" />,
  <ChartFrame status="error" title="Revenue by week" message="The warehouse timed out" retryable={true} onRetry={() => {}} />,
  <ChartFrame status="error" title="Revenue by week" message="You don't have access" retryable={false} />,
  <ChartFrame status="ready" title="Revenue by week" plot={<div />} legend={[{ label: "This year", series: "1" }]} />,
];

export const invalid = [
  // @ts-expect-error: a loading chart has no plot
  <ChartFrame status="loading" title="Revenue" plot={<div />} />,
  // @ts-expect-error: a legend without a plot
  <ChartFrame status="empty" title="Revenue" reason="Nothing to plot" legend={[{ label: "This year", series: "1" }]} />,
  // @ts-expect-error: series 7 is not a categorical mark
  <ChartFrame status="ready" title="Revenue" plot={<div />} legend={[{ label: "Other", series: "7" }]} />,
  // @ts-expect-error: a retryable error needs onRetry
  <ChartFrame status="error" title="Revenue" message="Timed out" retryable={true} />,
  // @ts-expect-error: a final error can't offer a retry
  <ChartFrame status="error" title="Revenue" message="No access" retryable={false} onRetry={() => {}} />,
  // @ts-expect-error: no className escape hatch
  <ChartFrame status="loading" title="Revenue" className="h-64" />,
];
