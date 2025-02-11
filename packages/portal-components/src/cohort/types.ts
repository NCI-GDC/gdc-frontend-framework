import { DataFetchingStatus } from "src/types";

export interface Cohort {
  readonly id: string;
  readonly name: string;
  readonly filters: Record<string, any>;
  readonly modified?: boolean;
  readonly modified_datetime: string;
  readonly saved?: boolean;
}

export interface CohortHooks {
  useSelectCurrentCohort: () => Cohort;
  useSelectAvailableCohorts: () => Cohort[];
  useDeleteCohort: () => () => Promise<void>;
  useDiscardChanges: () => () => Promise<void>;
  useUpdateFilters: () => () => void;
  useSetActiveCohort: () => (cohortId: string) => void;
  useAddUnsavedCohort: () => () => void;
  useSaveCohort: () => [
    ({
      newName,
      cohortId,
      filters,
      caseFilters,
      createStaticCohort,
      saveAs,
    }: {
      newName: string;
      cohortId?: string;
      filters: any;
      caseFilters: any;
      createStaticCohort: boolean;
      saveAs: boolean;
    }) => Promise<{ cohortAlreadyExists: boolean; newCohortId: string }>,
    DataFetchingStatus,
  ];
  useReplaceCohort: () => [
    ({
      newName,
      filters,
    }: {
      newName: string;
      filters: any;
    }) => Promise<{ newCohortId: string }>,
    DataFetchingStatus,
  ];
  useExportCohort?: () => [
    exportFunction: () => void,
    status: DataFetchingStatus,
  ];
  useImportCohort?: () => () => void;
}
