import React from "react";
import {
  useCoreSelector,
  selectCurrentModal,
  Modals,
  UNSAVED_COHORT_NAME,
} from "@gff/core";
import { CohortManager as CommonCohortManager } from "@gff/portal-components";
import ImportCohortModal from "../Modals/ImportCohortModal";
import { cohortActionsHooks } from "./cohortActionHooks";
import { INVALID_COHORT_NAMES } from "../utils";

const CohortManager: React.FC = () => {
  const modal = useCoreSelector(selectCurrentModal);

  return (
    <>
      <CommonCohortManager
        hooks={cohortActionsHooks}
        invalidCohortNames={INVALID_COHORT_NAMES}
        defaultCohortName={UNSAVED_COHORT_NAME}
      />
      <ImportCohortModal opened={modal === Modals.ImportCohortModal} />
    </>
  );
};

export default CohortManager;
