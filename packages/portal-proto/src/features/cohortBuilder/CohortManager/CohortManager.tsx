import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  useCoreDispatch,
  useCoreSelector,
  addNewUnsavedCohort,
  FilterSet,
  selectCurrentModal,
  Modals,
} from "@gff/core";
import { CohortManager as CommonCohortManager } from "@gff/portal-components";
import ImportCohortModal from "../Modals/ImportCohortModal";
import { removeQueryParamsFromRouter } from "./cohortUtils";
import {
  useSelectCurrentCohort,
  useSelectAvailableCohorts,
  useAddUnsavedCohort,
  useDeleteCohort,
  useDiscardChanges,
  useExportCohort,
  useImportCohort,
  useSetActiveCohort,
  useUpdateFilters,
} from "./cohortActionHooks";
import { INVALID_COHORT_NAMES } from "../utils";

const CohortManager: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const router = useRouter();
  const modal = useCoreSelector(selectCurrentModal);

  useEffect(() => {
    const {
      operation,
      filters: createCohortFilters,
      name: createCohortName,
    } = router.query;

    if (operation == "createCohort") {
      const cohortFilters = JSON.parse(
        createCohortFilters as string,
      ) as FilterSet;
      coreDispatch(
        addNewUnsavedCohort({
          filters: cohortFilters,
          name: (createCohortName as string).replace(/-/g, " "),
          replace: true,
          message: "newCohort",
        }),
      );

      removeQueryParamsFromRouter(router, ["operation", "filters", "name"]);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CommonCohortManager
        hooks={{
          useSelectCurrentCohort,
          useSelectAvailableCohorts,
          useDeleteCohort,
          useDiscardChanges,
          useUpdateFilters,
          useSetActiveCohort,
          useAddUnsavedCohort,
          useExportCohort,
          useImportCohort,
        }}
        invalidCohortNames={INVALID_COHORT_NAMES}
      />
      <ImportCohortModal opened={modal === Modals.ImportCohortModal} />
    </>
  );
};

export default CohortManager;
