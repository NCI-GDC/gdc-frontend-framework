import { FilterSet } from "@gff/core";

export interface SaveCohortModalProps {
  opened: boolean;
  initialName?: string;
  onClose: () => void;
  cohortId?: string;
  filters: FilterSet;
  caseFilters?: FilterSet;
  createStaticCohort?: boolean;
  setAsCurrent?: boolean;
  saveAs?: boolean;
}

export interface CohortState {
  showReplaceCohort: boolean;
  cohortReplaced: boolean;
  enteredName?: string;
  cohortSavedMessage?: string[];
}
