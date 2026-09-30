// The contract, as code: things an agent might write, and whether they compile.
import { ProvenancePopover } from "./ProvenancePopover";

const retrievedAt = new Date("2026-09-23T18:40:00");

export const valid = [
  <ProvenancePopover status="unavailable" label="Forecast" reason="No query recorded this number." />,
  <ProvenancePopover status="available" label="Revenue" source="Billing warehouse" dataset="orders.daily" retrievedAt={retrievedAt} expanded={false} onToggle={() => {}} />,
  <ProvenancePopover status="available" label="Revenue" source="Billing warehouse" dataset="orders.daily" retrievedAt={retrievedAt} expanded onToggle={() => {}} />,
];

export const invalid = [
  // @ts-expect-error: an unavailable number can't open a panel
  <ProvenancePopover status="unavailable" label="Forecast" reason="No query." expanded />,
  // @ts-expect-error: the button needs a function to call
  <ProvenancePopover status="available" label="Revenue" source="Billing warehouse" dataset="orders.daily" retrievedAt={retrievedAt} expanded={false} />,
  // @ts-expect-error: a source without its dataset and retrieval time
  <ProvenancePopover status="available" label="Revenue" source="Billing warehouse" expanded={false} onToggle={() => {}} />,
  // @ts-expect-error: no className escape hatch
  <ProvenancePopover status="unavailable" label="Forecast" reason="No query." className="text-xs" />,
];
