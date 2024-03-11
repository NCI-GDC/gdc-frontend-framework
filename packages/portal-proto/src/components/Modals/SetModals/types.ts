import { Operation, FilterSet } from "@gff/core";

export interface InputModalProps {
  readonly updateFilters: (field: string, operation: Operation) => void;
  readonly existingFiltersHook: () => FilterSet;
  readonly opened: boolean;
}

export interface SavedSetModalProps extends InputModalProps {
  readonly modalTitle: string;
  readonly inputInstructions: string;
  readonly selectSetInstructions: string;
}
