import React, { useState, useCallback } from "react";
import { Modal, Button } from "@mantine/core";
import { SaveOrCreateEntityBody } from "./SaveOrCreateEntityModal";
import { CohortHooks } from "@/cohort/types";

interface SaveCohortModalProps {
  readonly opened: boolean;
  readonly initialName?: string;
  readonly onClose: () => void;
  readonly invalidCohortNames: string[];
  readonly hooks: CohortHooks;
  readonly cohortId?: string;
  readonly filters: any;
  readonly caseFilters?: any;
  readonly createStaticCohort?: boolean;
  readonly setAsCurrent?: boolean;
  readonly saveAs?: boolean;
}

/**
 * SaveCohortModal handles saving a user's cohort
 * @param initialName - populates inital value of name field
 * @param onClose - callback triggered when modal closes
 * @param cohortId - id of existing cohort we are saving, if undefined we are not saving a cohort that already exists
 * @param filters - the filters associated with the cohort
 * @param caseFilters - the case filters to use for the cohort
 * @param createStaticCohort - whether to create a case set from the filters so the cases in the cohort remain static
 * @param setAsCurrent - whether to set the new cohort as the user's current cohort, should not also pass in cohortId
 * @param saveAs - whether to save existing cohort as new cohort, requires cohortId
 */
const SaveCohortModal: React.FC<SaveCohortModalProps> = ({
  opened,
  initialName = "",
  onClose,
  cohortId,
  invalidCohortNames,
  hooks,
  filters,
  caseFilters,
  createStaticCohort = false,
  setAsCurrent = false,
  saveAs = false,
}) => {
  const [showReplaceCohort, setShowReplaceCohort] = useState(false);
  const [enteredName, setEnteredName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveCohort] = hooks.useSaveCohort();
  const [replaceCohort] = hooks.useReplaceCohort();
  const setActiveCohort = hooks.useSetActiveCohort();

  const closeModal = useCallback(() => {
    onClose();
    // Reset modal state on close
    setShowReplaceCohort(false);
    setEnteredName("");
    //setCohortSavedMessage(undefined);
  }, [onClose]);

  const saveAction = async (newName: string, replace: boolean) => {
    setIsSaving(true);

    if (replace) {
      replaceCohort({ newName, filters }).then(() => {
        closeModal();
      });
    } else {
      saveCohort({
        newName,
        cohortId,
        filters,
        caseFilters,
        createStaticCohort,
        saveAs,
      }).then(({ cohortAlreadyExists, newCohortId }) => {
        setIsSaving(false);

        if (cohortAlreadyExists) {
          setShowReplaceCohort(true);
        } else {
          if (setAsCurrent) {
            setActiveCohort(newCohortId);
          }
          closeModal();
        }
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
          variant={"filled"}
          color="secondary"
          onClick={() => {
            saveAction(enteredName, true);
          }}
          data-testid="replace-cohort-button"
          loading={isSaving}
        >
          Replace
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      opened={opened}
      onClose={showReplaceCohort ? () => setShowReplaceCohort(false) : onClose}
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
  );
};

export default SaveCohortModal;
