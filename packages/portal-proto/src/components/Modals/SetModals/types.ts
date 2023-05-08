import { Operation, FilterSet, FilterGroup } from "@gff/core";

export interface InputModalProps {
  readonly updateFilters: (
    field: string,
    operation: Operation,
    groups?: FilterGroup[],
  ) => void;
  readonly existingFiltersHook: () => FilterSet;
  readonly useAddNewFilterGroups: () => (groups: FilterGroup[]) => void;
}

export interface SavedSetModalProps extends InputModalProps {
  readonly modalTitle: string;
  readonly inputInstructions: string;
  readonly selectSetInstructions: string;
}
