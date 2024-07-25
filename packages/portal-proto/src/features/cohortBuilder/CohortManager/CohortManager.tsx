import React, { useEffect, useState } from "react";
import { Tooltip } from "@mantine/core";
import { useRouter } from "next/router";
import {
  selectCurrentCohortModified,
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohortSaved,
  addNewUnsavedCohort,
  FilterSet,
} from "@gff/core";
import { FaUndo as DiscardIcon } from "react-icons/fa";
import { removeQueryParamsFromRouter } from "./cohortUtils";
import CohortActions from "./CohortActions";
import CohortSelector from "./CohortSelector";
import { CohortModals } from "./CohortModals";
import { CohortGroupButton } from "../style";

const CohortManager: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const router = useRouter();

  const currentCohortSaved = useCoreSelector(selectCurrentCohortSaved);
  const currentCohortModified = useCoreSelector(selectCurrentCohortModified);

  const [showDelete, setShowDelete] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [showSaveCohort, setShowSaveCohort] = useState(false);
  const [showSaveAsCohort, setShowSaveAsCohort] = useState(false);
  const [showUpdateCohort, setShowUpdateCohort] = useState(false);

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
    <div
      data-tour="cohort_management_bar"
      className="flex flex-row items-center justify-start gap-6 px-4 h-18 shadow-lg bg-primary"
    >
      <div className="border-opacity-0">
        <div className="flex flex-wrap gap-2 lg:gap-4">
          <div className="flex justify-center items-center">
            <Tooltip label="Discard Changes" position="bottom" withArrow>
              <span>
                <CohortGroupButton
                  data-testid="discardButton"
                  onClick={() => setShowDiscard(true)}
                  disabled={!currentCohortModified}
                  $isDiscard={true}
                  aria-label="Discard cohort changes"
                >
                  <DiscardIcon aria-hidden="true" />
                </CohortGroupButton>
              </span>
            </Tooltip>

            <CohortSelector />
          </div>
          <CohortActions
            onSave={() =>
              currentCohortSaved
                ? setShowUpdateCohort(true)
                : setShowSaveCohort(true)
            }
            onSaveAs={() => setShowSaveAsCohort(true)}
            onDelete={() => setShowDelete(true)}
          />
        </div>
      </div>

      <CohortModals
        showDelete={showDelete}
        showDiscard={showDiscard}
        showSaveCohort={showSaveCohort}
        showSaveAsCohort={showSaveAsCohort}
        showUpdateCohort={showUpdateCohort}
        onSetShowDelete={setShowDelete}
        onSetShowDiscard={setShowDiscard}
        onSetShowSaveCohort={setShowSaveCohort}
        onSetShowSaveAsCohort={setShowSaveAsCohort}
        onSetShowUpdateCohort={setShowUpdateCohort}
      />
    </div>
  );
};

export default CohortManager;
