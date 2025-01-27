import React, { useContext, useState } from "react";
import { Tooltip, MantineProvider, Button } from "@mantine/core";
import { UndoIcon } from "src/commonIcons";
import CohortActions from "./CohortActions";
import CohortSelector from "./CohortSelector";
import { Cohort } from "./types";
import { AppContext } from "src/context";

interface CohortManagerProps {
  readonly selectCurrentCohort: () => Cohort;
  readonly selectAvailableCohorts: () => Cohort[];
  readonly setActiveCohort: (newCohort: string) => void;
  readonly addNewDefaultUnsavedCohort: () => void;
}

const CohortManager: React.FC<CohortManagerProps> = ({
  selectCurrentCohort,
  selectAvailableCohorts,
  setActiveCohort,
  addNewDefaultUnsavedCohort,
}) => {
  const currentCohort = selectCurrentCohort();

  const { theme } = useContext(AppContext);

  const [, setShowDelete] = useState(false);
  const [, setShowDiscard] = useState(false);
  const [, setShowSaveCohort] = useState(false);
  const [, setShowSaveAsCohort] = useState(false);
  const [, setShowUpdateCohort] = useState(false);

  return (
    <MantineProvider
      theme={{
        ...theme,
        components: {
          ...theme?.components,
          Button: Button.extend({
            classNames: {
              root: `data-[variant="cohort"]:h-12 data-[variant="cohort"]:w-12 data-[variant="cohort"]:flex data-[variant="cohort"]:justify-center data-[variant="cohort"]:items-center
              data-[variant="cohort"]:transition-colors data-[variant="cohort"]:focus-visible:outline-none data-[variant="cohort"]:focus-visible:ring-offset-2 data-[variant="cohort"]:focus-visible:ring-inset
              data-[variant="cohort"]:focus-visible:ring-2 data-[variant="cohort"]:focus-visible:ring-focusColor data-[variant="cohort"]:disabled:opacity-50 data-[variant="cohort"]:disabled:bg-base-max data-[variant="cohort"]:disabled:text-primary
              data-[variant="cohort"]:text-primary data-[variant="cohort"]:hover:bg-primary-darkest data-[variant="cohort"]:hover:text-primary-content-lightest data-[variant="cohort"]:bg-base-max
            `,
            },
          }),
        },
      }}
    >
      <div
        data-tour="cohort_management_bar"
        className="flex flex-row items-center justify-start gap-6 px-4 h-18 shadow-lg bg-primary"
      >
        <div className="border-opacity-0">
          <div className="flex flex-wrap gap-2 lg:gap-4">
            <div className="flex justify-center items-center">
              <Tooltip label="Discard Changes" position="bottom" withArrow>
                <span>
                  <Button
                    data-testid="discardButton"
                    onClick={() => setShowDiscard(true)}
                    disabled={!currentCohort.modified}
                    //$isDiscard={true}
                    aria-label="Discard cohort changes"
                    variant="cohort"
                  >
                    <UndoIcon aria-hidden="true" />
                  </Button>
                </span>
              </Tooltip>

              <CohortSelector
                selectAvailableCohorts={selectAvailableCohorts}
                selectCurrentCohort={selectCurrentCohort}
                setActiveCohort={setActiveCohort}
              />
            </div>
            <CohortActions
              onSave={() =>
                currentCohort.saved
                  ? setShowUpdateCohort(true)
                  : setShowSaveCohort(true)
              }
              onSaveAs={() => setShowSaveAsCohort(true)}
              onDelete={() => setShowDelete(true)}
              selectCurrentCohort={selectCurrentCohort}
              selectAvailableCohorts={selectAvailableCohorts}
              addNewDefaultUnsavedCohort={addNewDefaultUnsavedCohort}
            />
          </div>
        </div>

        {/*
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
      */}
      </div>
    </MantineProvider>
  );
};

export default CohortManager;
