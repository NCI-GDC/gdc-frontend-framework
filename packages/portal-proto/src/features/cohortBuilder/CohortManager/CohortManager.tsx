import React from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import {
  useCoreSelector,
  selectCurrentModal,
  Modals,
  UNSAVED_COHORT_NAME,
  Operation,
  updateActiveCohortFilter,
  useCoreDispatch,
} from "@gff/core";
import { CohortManager as CommonCohortManager } from "@gff/portal-components";
import CaseSetModal from "@/components/Modals/SetModals/CaseSetModal";
import GeneSetModal from "@/components/Modals/SetModals/GeneSetModal";
import MutationSetModal from "@/components/Modals/SetModals/MutationSetModal";
import ImportCohortModal from "../Modals/ImportCohortModal";
import { cohortActionsHooks } from "./cohortActionHooks";
import { INVALID_COHORT_NAMES, useCohortFacetFilters } from "../utils";

interface CohortManagerProps {
  readonly isFetchingCohorts: boolean;
}

const CohortManager: React.FC<CohortManagerProps> = ({ isFetchingCohorts }) => {
  const modal = useCoreSelector(selectCurrentModal);
  const coreDispatch = useCoreDispatch();

  const updateCohortFilters = useDeepCompareCallback(
    (field: string, operation: Operation) => {
      coreDispatch(updateActiveCohortFilter({ field, operation }));
    },
    [coreDispatch],
  );

  return (
    <>
      <CommonCohortManager
        hooks={cohortActionsHooks}
        invalidCohortNames={INVALID_COHORT_NAMES}
        defaultCohortName={UNSAVED_COHORT_NAME}
        isFetchingCohorts={isFetchingCohorts}
      />
      <ImportCohortModal opened={modal === Modals.ImportCohortModal} />
      <CaseSetModal
        updateFilters={updateCohortFilters}
        existingFiltersHook={useCohortFacetFilters}
        opened={modal === Modals.GlobalCaseSetModal}
      />

      <GeneSetModal
        opened={modal === Modals.GlobalGeneSetModal}
        modalTitle="Filter Current Cohort by Mutated Genes"
        inputInstructions="Enter one or more gene identifiers in the field below or upload a file to filter your cohort. Your filtered cohort will consist of cases that have mutations in any of these genes."
        selectSetInstructions="Select one or more sets below to filter your cohort."
        updateFilters={updateCohortFilters}
        existingFiltersHook={useCohortFacetFilters}
      />

      <MutationSetModal
        opened={modal === Modals.GlobalMutationSetModal}
        modalTitle="Filter Current Cohort by Somatic Mutations"
        inputInstructions="Enter one or more mutation identifiers in the field below or upload a file to filter your cohort. Your filtered cohort will consist of cases that have any of these mutations."
        selectSetInstructions="Select one or more sets below to filter your cohort."
        updateFilters={updateCohortFilters}
        existingFiltersHook={useCohortFacetFilters}
      />
    </>
  );
};

export default CohortManager;
