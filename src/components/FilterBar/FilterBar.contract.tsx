// The contract, as code: things an agent might write, and whether they compile.
import { FilterBar } from "./FilterBar";

const available = [{ id: "region", label: "Region" }];

export const valid = [
  <FilterBar status="loading" />,
  <FilterBar status="idle" available={available} onApply={() => {}} />,
  <FilterBar status="filtered" applied={[{ id: "region", label: "Region", value: "West" }]} available={[]} onApply={() => {}} onRemove={() => {}} onClear={() => {}} />,
];

export const invalid = [
  // @ts-expect-error: idle has nothing to clear
  <FilterBar status="idle" available={available} onApply={() => {}} onClear={() => {}} />,
  // @ts-expect-error: filtered with no applied filter is the idle state
  <FilterBar status="filtered" applied={[]} available={available} onApply={() => {}} onRemove={() => {}} onClear={() => {}} />,
  // @ts-expect-error: an applied filter needs the value it shows
  <FilterBar status="filtered" applied={[{ id: "region", label: "Region" }]} available={[]} onApply={() => {}} onRemove={() => {}} onClear={() => {}} />,
  // @ts-expect-error: a filtered bar needs a way to clear
  <FilterBar status="filtered" applied={[{ id: "region", label: "Region", value: "West" }]} available={[]} onApply={() => {}} onRemove={() => {}} />,
  // @ts-expect-error: no className escape hatch
  <FilterBar status="loading" className="gap-2" />,
];
