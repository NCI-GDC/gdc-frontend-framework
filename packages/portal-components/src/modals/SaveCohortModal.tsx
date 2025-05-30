import React, { useState, useCallback, useContext } from "react";
import { Modal, Button, MantineProvider, Loader } from "@mantine/core";
import { modals } from "@mantine/modals";
import { CohortNotificationContext } from "@/cohort/CohortNotificationProvider";
import { CohortHooks, NotificationTypes } from "@/cohort/types";
import { SaveOrCreateEntityBody } from "./SaveOrCreateEntityModal";
import { AppContext } from "src/context";

interface SaveCohortModalProps {
  readonly opened: boolean;
  readonly hooks: CohortHooks;
  readonly initialName?: string;
  readonly onClose: () => void;
  readonly cohortId?: string;
  readonly invalidCohortNames: string[];
  readonly filters: any;
  readonly caseFilters?: any;
  readonly createStaticCohort?: boolean;
  readonly setAsCurrent?: boolean;
  readonly saveAs?: boolean;
}

/**
 * SaveCohortModal handles saving a user's cohort
 * @param opened - Whether the modal is open or not
 * @param hooks - Collection of hooks for performing saving, deleting, etc operations on cohorts
 * @param initialName - populates inital value of name field
 * @param onClose - callback triggered when modal closes
 * @param cohortId - id of existing cohort we are saving, if undefined we are not saving a cohort that already exists
 * @param invalidCohortNames - list of cohort names that the user is barred from using
 * @param filters - the filters associated with the cohort
 * @param caseFilters - the case filters to use for the cohort
 * @param createStaticCohort - whether to create a case set from the filters so the cases in the cohort remain static
 * @param setAsCurrent - whether to set the new cohort as the user's current cohort, should not also pass in cohortId
 * @param saveAs - whether to save existing cohort as new cohort, requires cohortId
 */
const SaveCohortModal: React.FC<SaveCohortModalProps> = ({
  opened,
  hooks,
  initialName = "",
  onClose,
  cohortId,
  invalidCohortNames,
  filters,
  caseFilters,
  createStaticCohort = false,
  setAsCurrent = false,
  saveAs = false,
}) => {
  const [showReplaceCohort, setShowReplaceCohort] = useState(false);
  const [enteredName, setEnteredName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const saveCohort = hooks.useSaveCohort();
  const replaceCohort = hooks.useReplaceCohort();
  const setActiveCohort = hooks.useSetActiveCohort();
  const setCohortMessage = useContext(CohortNotificationContext);
  const currentCohort = hooks.useSelectCurrentCohort();
  const availableCohorts = hooks.useSelectAvailableCohorts();
  const targetCohort =
    availableCohorts !== undefined
      ? availableCohorts.find((cohort) => cohort.id === cohortId)
      : undefined;
  const { theme } = useContext(AppContext);

  const closeModal = useCallback(() => {
    onClose();
    // Reset modal state on close
    setShowReplaceCohort(false);
    setEnteredName("");
    setIsSaving(false);
  }, [onClose]);

  const saveAction = async (newName: string, replace: boolean) => {
    if (isSaving) return;

    setIsSaving(true);

    if (replace) {
      replaceCohort({
        newName,
        filters,
        caseFilters,
        createStaticCohort,
        cohortId,
        saveAs,
      })
        .then(({ newCohortId }) => {
          if (
            setAsCurrent ||
            saveAs ||
            currentCohort?.name === newName ||
            (targetCohort !== undefined && !targetCohort?.saved)
          ) {
            setCohortMessage &&
              setCohortMessage([
                {
                  cmd: setAsCurrent ? "savedCohort" : "savedCurrentCohort",
                  param1: newName,
                  param2: newCohortId,
                },
              ]);
            setActiveCohort(newCohortId);
          } else {
            setCohortMessage &&
              setCohortMessage([
                {
                  cmd: "savedCohortSetCurrent",
                  param1: newName,
                  param2: newCohortId,
                },
              ]);
          }
          closeModal();
        })
        .catch(() => {
          modals.openContextModal({
            modal: "cohortSaveError",
            title: "Save Cohort Error",
            innerProps: {},
          });
        });
    } else {
      saveCohort({
        newName,
        cohortId,
        filters,
        caseFilters,
        createStaticCohort,
        saveAs,
      })
        .then(({ cohortAlreadyExists, newCohortId }) => {
          if (cohortAlreadyExists) {
            setShowReplaceCohort(true);
            setIsSaving(false);
          } else {
            if (setAsCurrent || saveAs) {
              setActiveCohort(newCohortId);
            }

            let cmd: NotificationTypes;
            if (cohortId) {
              cmd = saveAs ? "savedCohort" : "savedCurrentCohort";
            } else {
              cmd = setAsCurrent ? "savedCohort" : "savedCohortSetCurrent";
            }

            setCohortMessage &&
              setCohortMessage([
                {
                  cmd,
                  param1: newName,
                  param2: newCohortId,
                },
              ]);

            closeModal();
          }
        })
        .catch(() => {
          modals.openContextModal({
            modal: "cohortSaveError",
            title: "Save Cohort Error",
            innerProps: {},
          });
        });
    }
  };

  const UpdateBody = () => (
    <>
      <div className="p-4">
        <p className="font-content text-sm">
          A saved cohort with same name already exists. Are you sure you want to
          replace it?
        </p>
        <p className="text-xs font-content mt-1">
          You cannot undo this action.
        </p>
      </div>
      <div
        className="bg-base-lightest flex p-4 gap-4 justify-end mt-4 rounded-b-lg sticky"
        data-testid="modal-button-container"
      >
        <Button
          variant="outline"
          className={"bg-white"}
          color="secondary"
          onClick={() => setShowReplaceCohort(false)}
        >
          Cancel
        </Button>
        <Button
          variant="filled"
          color="secondary"
          onClick={() => {
            saveAction(enteredName, true);
          }}
          data-testid="replace-cohort-button"
          leftSection={
            isSaving ? <Loader size={15} color="white" /> : undefined
          }
        >
          Replace
        </Button>
      </div>
    </>
  );

  return (
    <MantineProvider theme={theme}>
      <Modal
        opened={opened}
        onClose={
          showReplaceCohort ? () => setShowReplaceCohort(false) : onClose
        }
        title={
          showReplaceCohort
            ? "Replace Existing Cohort"
            : saveAs
            ? "Save Cohort As"
            : "Save Cohort"
        }
        size="md"
        classNames={{
          content: "p-0",
          title: "text-xl",
        }}
      >
        {showReplaceCohort ? (
          <UpdateBody />
        ) : (
          <SaveOrCreateEntityBody
            entity="cohort"
            action="Save"
            initialName={initialName}
            onClose={onClose}
            onActionClick={(name: string) => {
              saveAction(name, false);
              setEnteredName(name);
            }}
            descriptionMessage={
              saveAs
                ? "Provide a name to save your current cohort as a new cohort"
                : "Provide a name to save the cohort."
            }
            closeOnAction={false}
            loading={isSaving}
            disallowedNames={invalidCohortNames}
          />
        )}
      </Modal>
    </MantineProvider>
  );
};

export default SaveCohortModal;
