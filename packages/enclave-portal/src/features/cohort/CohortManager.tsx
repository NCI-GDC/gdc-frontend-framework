import React from "react";
import {
  CohortManager as CommonCohortManager,
  Cohort,
} from "@gff/portal-components";

const UNSAVED_DEFAULT_COHORT: Cohort = {
  name: "Unsaved_Cohort",
  filters: {
    root: {},
    mode: "and",
  },
  saved: false,
  modified: false,
  id: "0000-0000",
  modified_datetime: new Date().toISOString(),
};

interface CohortManagerProps {
  cohorts: Cohort[];
  setCohorts: (cohorts: Cohort[]) => void;
  currentCohort: string;
  setCurrentCohort: (cohort: string) => void;
}

const CohortManager: React.FC<CohortManagerProps> = ({
  cohorts,
  setCohorts,
  currentCohort,
  setCurrentCohort,
}) => {
  return (
    <CommonCohortManager
      hooks={{
        useSelectAvailableCohorts: () => cohorts,
        useSelectCurrentCohort: () =>
          cohorts.find((c) => c.id === currentCohort) || cohorts[0],
        useSetActiveCohort: () => setCurrentCohort,
        useDeleteCohort: () => async () => {
          return new Promise<void>((resolve) => {
            setCohorts(cohorts.filter((c) => c.id !== currentCohort));
            setCurrentCohort(cohorts[0].id);
            resolve();
          });
        },
        useDiscardChanges: () => async () => {},
        useUpdateFilters: () => () => {},
        useAddUnsavedCohort: () => () => {
          setCohorts([UNSAVED_DEFAULT_COHORT, ...cohorts]);
          setCurrentCohort(UNSAVED_DEFAULT_COHORT.id);
        },
        useSaveCohort: () => async (_: any) => {
          return Promise.resolve({
            cohortAlreadyExists: true,
            newCohortId: "id",
          });
        },

        useReplaceCohort: () => (_: any) => {
          return Promise.resolve({ newCohortId: "id" });
        },
      }}
      defaultCohortName={"Unsaved_Cohort"}
    />
  );
};

export default CohortManager;
