import React, { useState } from "react";
import {
  CohortManager as CommonCohortManager,
  Cohort,
} from "@gff/portal-components";

const EXAMPLE_COHORTS: Cohort[] = [
  {
    name: "Baily's Cohort",
    id: "0000-0000-1000-0000",
    filters: {
      mode: "and",
      root: {
        "cases.primary_site": {
          operator: "includes",
          field: "cases.primary_site",
          operands: ["breast", "bronchus and lung"],
        },
      },
    },
    modified: false,
    saved: true,
    modified_datetime: new Date(2020, 1, 15).toISOString(),
  },
  {
    name: "Pancreas",
    id: "0000-0000-1001-0000",
    filters: {
      root: {
        "cases.primary_site": {
          field: "cases.primary_site",
          operands: ["pancreas"],
          operator: "includes",
        },
      },
      mode: "and",
    },
    modified_datetime: new Date(2020, 1, 9).toISOString(),
    saved: false,
    modified: false,
  },
  {
    name: "Pancreas - KRAS mutated",
    id: "0000-0000-1002-0000",
    filters: {
      root: {
        "genes.symbol": {
          field: "genes.symbol",
          operands: ["KRAS"],
          operator: "includes",
        },
        "cases.primary_site": {
          field: "cases.primary_site",
          operands: ["pancreas"],
          operator: "includes",
        },
      },
      mode: "and",
    },
    modified: false,
    saved: true,
    modified_datetime: new Date(2020, 1, 8).toISOString(),
  },
  {
    name: "Pancreas - KRAS not mutated",
    id: "0000-0000-1003-0000",
    filters: {
      root: {
        "genes.symbol": {
          field: "genes.symbol",
          operands: ["KRAS"],
          operator: "excludeifany",
        },
        "cases.primary_site": {
          field: "cases.primary_site",
          operands: ["pancreas"],
          operator: "includes",
        },
      },
      mode: "and",
    },
    modified: false,
    saved: true,
    modified_datetime: new Date(2020, 1, 7).toISOString(),
  },
  {
    name: "breast, true",
    id: "0000-0000-1004-0000",
    filters: {
      root: {
        "cases.primary_site": {
          operator: "includes",
          field: "cases.primary_site",
          operands: ["breast"],
        },
        "genes.is_cancer_gene_census": {
          operator: "includes",
          field: "gene.is_cancer_gene_census",
          operands: ["true"],
        },
      },
      mode: "and",
    },
    modified: false,
    saved: true,
    modified_datetime: new Date(2020, 1, 6).toISOString(),
  },
  {
    name: "Lung",
    id: "0000-0000-0000-2222",
    filters: {
      root: {
        "cases.primary_site": {
          field: "cases.primary_site",
          operands: ["lung"],
          operator: "includes",
        },
      },
      mode: "and",
    },
    modified_datetime: new Date(2020, 1, 9).toISOString(),
    saved: true,
    modified: false,
  },
];

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

const CohortManager = () => {
  const [cohorts, setCohorts] = useState(EXAMPLE_COHORTS);
  const [currentCohort, setCurrentCohort] = useState(EXAMPLE_COHORTS[0].id);

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
