import React, { useContext, useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { Tooltip, MantineProvider, Button } from "@mantine/core";
import { AppContext } from "src/context";
import { UndoIcon } from "src/commonIcons";
import GenericCohortModal from "@/modals/GenericCohortModal";
import SaveCohortModal from "@/modals/SaveCohortModal";
import CohortActions from "./CohortActions";
import CohortSelector from "./CohortSelector";
import { actionButtonVariant, darkFunctionVariant } from "./style";
import { CohortHooks, CohortNotificationCommandNoParam } from "./types";
import { CohortNotificationContext } from "./CohortNotificationProvider";

interface CohortManagerProps {
  readonly hooks: CohortHooks;
  readonly defaultCohortName: string;
  readonly invalidCohortNames?: string[];
  readonly isFetchingCohorts?: boolean;
}

/**
 * Component for the user to manage (save, delete, etc) cohorts
 * @param hooks - Collection of hooks for performing saving, deleting, etc operations on cohorts
 * @param invalidCohortNames - list of cohort names that the user is barred from using
 */
const CohortManager: React.FC<CohortManagerProps> = ({
  hooks,
  defaultCohortName,
  invalidCohortNames = [],
  isFetchingCohorts = false,
}) => {
  const currentCohort = hooks.useSelectCurrentCohort();
  const cohorts = hooks.useSelectAvailableCohorts();

  const handleDelete = hooks.useDeleteCohort();
  const handleDiscard = hooks.useDiscardChanges();
  const handleUpdate = hooks.useUpdateFilters();
  const setActiveCohort = hooks.useSetActiveCohort();
  const addNewDefaultUnsavedCohort = hooks.useAddUnsavedCohort();
  const {
    useImportCohort = () => undefined,
    useExportCohort = () => ({ handleExport: undefined, status: {} }),
    useCreateCohortExternally = () => {},
  } = hooks;

  const { theme } = useContext(AppContext);

  const [showDelete, setShowDelete] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [showSaveCohort, setShowSaveCohort] = useState(false);
  const [showSaveAsCohort, setShowSaveAsCohort] = useState(false);
  const [showUpdateCohort, setShowUpdateCohort] = useState(false);

  const setCohortMessage = useContext(CohortNotificationContext);

  useCreateCohortExternally(setCohortMessage);

  useDeepCompareEffect(() => {
    if (cohorts.length === 0 && !isFetchingCohorts) {
      addNewDefaultUnsavedCohort();
      setCohortMessage &&
        setCohortMessage([{ cmd: "newCohort", param1: defaultCohortName }]);
    }
  }, [
    cohorts,
    addNewDefaultUnsavedCohort,
    defaultCohortName,
    setCohortMessage,
    isFetchingCohorts,
  ]);

  return (
    <MantineProvider
      theme={{
        ...theme,
        components: {
          ...theme?.components,
          Button: Button.extend({
            classNames: {
              root: `${actionButtonVariant} ${darkFunctionVariant}`,
            },
          }),
        },
      }}
    >
      <div
        data-tour="cohort_management_bar"
        className="flex flex-row items-center justify-start gap-6 px-4 h-18 shadow-lg bg-primary"
      >
        {currentCohort !== undefined && (
          <>
            <div className="border-opacity-0">
              <div className="flex flex-wrap gap-2 lg:gap-4">
                <div className="flex justify-center items-center">
                  <Tooltip label="Discard Changes" position="bottom" withArrow>
                    <span>
                      <Button
                        data-testid="discardButton"
                        onClick={() => setShowDiscard(true)}
                        disabled={!currentCohort.modified}
                        aria-label="Discard cohort changes"
                        variant="action"
                      >
                        <UndoIcon aria-hidden="true" />
                      </Button>
                    </span>
                  </Tooltip>

                  <CohortSelector
                    selectAvailableCohorts={hooks.useSelectAvailableCohorts}
                    selectCurrentCohort={hooks.useSelectCurrentCohort}
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
                  selectCurrentCohort={hooks.useSelectCurrentCohort}
                  selectAvailableCohorts={hooks.useSelectAvailableCohorts}
                  addNewDefaultUnsavedCohort={addNewDefaultUnsavedCohort}
                  useExportCohort={useExportCohort}
                  useImportCohort={useImportCohort}
                  defaultCohortName={defaultCohortName}
                />
              </div>
            </div>
            <GenericCohortModal
              title="Delete Cohort"
              opened={showDelete}
              onClose={() => setShowDelete(false)}
              actionText="Delete"
              mainText={
                <>
                  Are you sure you want to permanently delete{" "}
                  <b>{currentCohort.name}</b>?
                </>
              }
              subText={<>You cannot undo this action.</>}
              onActionClick={() => {
                handleDelete()
                  .then(() => {
                    setCohortMessage &&
                      setCohortMessage([
                        { cmd: "deleteCohort", param1: currentCohort.name },
                      ]);
                  })
                  .catch(
                    () =>
                      setCohortMessage &&
                      setCohortMessage([{ cmd: "error", param1: "deleting" }]),
                  );
              }}
            />

            <GenericCohortModal
              title="Discard Changes"
              opened={showDiscard}
              onClose={() => setShowDiscard(false)}
              actionText="Discard"
              mainText={
                <>
                  Are you sure you want to permanently discard the unsaved
                  changes?
                </>
              }
              subText={<>You cannot undo this action.</>}
              onActionClick={async () => {
                handleDiscard()
                  .then(
                    () =>
                      setCohortMessage &&
                      setCohortMessage([{ cmd: "discardChanges" }]),
                  )
                  .catch(
                    () =>
                      setCohortMessage &&
                      setCohortMessage([
                        { cmd: "error", param1: "discarding" },
                      ]),
                  );
              }}
            />

            <GenericCohortModal
              title="Save Cohort"
              opened={showUpdateCohort}
              onClose={() => setShowUpdateCohort(false)}
              actionText="Save"
              mainText={
                <>
                  Are you sure you want to save <b>{currentCohort.name}</b>?
                  This will overwrite your previously saved changes.
                </>
              }
              subText={<>You cannot undo this action.</>}
              onActionClick={() => {
                setShowUpdateCohort(false);
                handleUpdate();
                setCohortMessage &&
                  setCohortMessage([
                    {
                      cmd: "savedCurrentCohort",
                    } as CohortNotificationCommandNoParam,
                  ]);
              }}
            />

            <SaveCohortModal
              initialName={
                !invalidCohortNames.includes(currentCohort.name?.toLowerCase())
                  ? currentCohort.name
                  : undefined
              }
              opened={showSaveCohort}
              onClose={() => setShowSaveCohort(false)}
              cohortId={currentCohort.id}
              filters={currentCohort.filters}
              invalidCohortNames={invalidCohortNames}
              hooks={hooks}
            />

            <SaveCohortModal
              opened={showSaveAsCohort}
              initialName={currentCohort.name}
              onClose={() => setShowSaveAsCohort(false)}
              cohortId={currentCohort.id}
              filters={currentCohort.filters}
              saveAs
              invalidCohortNames={invalidCohortNames}
              hooks={hooks}
            />
          </>
        )}
      </div>
    </MantineProvider>
  );
};

export default CohortManager;
