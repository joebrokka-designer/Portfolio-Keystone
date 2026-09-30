// The contract, as code: things an agent might write, and whether they compile.
import { EmptyState } from "./EmptyState";

export const valid = [
  <EmptyState reason="no-data" title="No orders yet" description="Orders placed this month will show up here." />,
  <EmptyState reason="no-results" title="No matching rows" description="Those filters removed every row." onClearFilters={() => {}} />,
  <EmptyState reason="no-access" title="You can't view this" description="Ask an admin for access." />,
  <EmptyState reason="failed" title="The query didn't finish" description="The warehouse timed out." retryable={true} onRetry={() => {}} />,
  <EmptyState reason="failed" title="This query can't run" description="The dataset was removed." retryable={false} />,
];

export const invalid = [
  // @ts-expect-error: an empty range has nothing to retry
  <EmptyState reason="no-data" title="No orders" description="Nothing here." onRetry={() => {}} />,
  // @ts-expect-error: filters hid every row, so the reader needs a way to clear them
  <EmptyState reason="no-results" title="No matching rows" description="Filters removed every row." />,
  // @ts-expect-error: no access can't be retried
  <EmptyState reason="no-access" title="No access" description="Ask an admin." onRetry={() => {}} />,
  // @ts-expect-error: a retryable failure needs onRetry
  <EmptyState reason="failed" title="Timed out" description="Try the query again." retryable={true} />,
  // @ts-expect-error: a final failure can't offer a retry
  <EmptyState reason="failed" title="Removed" description="The dataset is gone." retryable={false} onRetry={() => {}} />,
  // @ts-expect-error: no className escape hatch
  <EmptyState reason="no-data" title="Empty" description="Nothing here." className="p-8" />,
];
