import { DataFetchingStatus } from "src/types";

export interface Cohort {
  readonly id: string;
  readonly name: string;
  readonly filters: Record<string, any>;
  readonly modified?: boolean;
  readonly modified_datetime: string;
  readonly saved?: boolean;
}

export type NotificationTypes =
  | "newCohort"
  | "deleteCohort"
  | "savedCohort"
  | "savedCohortSetCurrent"
  | "savedCurrentCohort"
  | "discardChanges"
  | "error";

export interface CohortNotificationCommand {
  cmd: NotificationTypes;
  param1: string;
  param2?: string;
}

type SetCohortMessageFunc = (cmd: CohortNotificationCommand[]) => void;

export interface CohortHooks {
  useSelectCurrentCohort: () => Cohort;
  useSelectAvailableCohorts: () => Cohort[];
  useDeleteCohort: () => () => Promise<void>;
  useDiscardChanges: () => () => Promise<void>;
  useUpdateFilters: () => () => void;
  useSetActiveCohort: () => (cohortId: string) => void;
  useAddUnsavedCohort: () => () => void;
  useSaveCohort: () => ({
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
  }) => Promise<{ cohortAlreadyExists: boolean; newCohortId: string }>;
  useReplaceCohort: () => ({
    newName,
    filters,
  }: {
    newName: string;
    filters: any;
  }) => Promise<{ newCohortId: string }>;
  useExportCohort?: () => {
    handleExport: () => void;
    status: DataFetchingStatus;
  };
  useImportCohort?: () => () => void;
  useCreateCohortExternally?: (setCohortMessage?: SetCohortMessageFunc) => void;
}
