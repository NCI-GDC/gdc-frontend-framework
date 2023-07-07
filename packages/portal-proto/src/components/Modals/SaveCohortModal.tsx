import { useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { Modal, Button } from "@mantine/core";
import {
  removeCohort,
  copyCohort,
  setCohortMessage,
  buildCohortGqlOperator,
  setCurrentCohortId,
  updateCohortName,
  useCoreDispatch,
  useAddCohortMutation,
  FilterSet,
} from "@gff/core";
import { SaveOrCreateEntityBody } from "./SaveOrCreateEntityModal";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";

import { modalStyles } from "./styles";

const SaveCohortModal = ({
  initialName = "",
  onClose,
  cohortId,
  filters,
}: {
  initialName: string;
  onClose: () => void;
  cohortId: string;
  filters: FilterSet;
}): JSX.Element => {
  const coreDispatch = useCoreDispatch();
  const [showReplaceCohort, setShowReplaceCohort] = useState(false);
  const [enteredName, setEnteredName] = useState<string>();
  const [addCohort] = useAddCohortMutation();

  const saveAction = async (newName: string, replace: boolean) => {
    const prevCohort = cohortId;
    const addBody = {
      name: newName,
      type: "static",
      filters:
        Object.keys(filters.root).length > 0
          ? buildCohortGqlOperator(filters)
          : {},
    };

    await addCohort({ cohort: addBody, delete_existing: replace })
      .unwrap()
      .then((payload) => {
        coreDispatch(copyCohort({ sourceId: prevCohort, destId: payload.id }));
        // NOTE: the current cohort can not be undefined. Setting the id to a cohort
        // which does not exist will cause this
        // Therefore, copy the unsaved cohort to the new cohort id received from
        // the BE.
        coreDispatch(setCurrentCohortId(payload.id));
        coreDispatch(updateCohortName(newName));
        coreDispatch(
          setCohortMessage([`savedCohort|${newName}|${payload.id}`]),
        );
        //onSelectionChanged(payload.id);
        coreDispatch(
          removeCohort({
            shouldShowMessage: false,
            currentID: prevCohort,
          }),
        );
        onClose();
      })
      .catch((e: FetchBaseQueryError) => {
        if (
          (e.data as { message: string })?.message ===
          "Bad Request: Name must be unique (case-insensitive)"
        ) {
          setShowReplaceCohort(true);
        } else {
          coreDispatch(setCohortMessage(["error|saving|allId"]));
        }
      });
  };

  return (
    <Modal
      opened
      onClose={showReplaceCohort ? () => setShowReplaceCohort(false) : onClose}
      title={showReplaceCohort ? "Replace Existing Cohort" : "Save Cohort"}
      closeButtonLabel="Cancel"
      classNames={modalStyles}
      size={"md"}
      withinPortal={false}
      centered
    >
      {showReplaceCohort ? (
        <>
          <div className="p-4">
            <p className="font-content">
              A saved cohort with same name already exists. Are you sure you
              want to replace it?
            </p>
            <p className="text-sm font-content mt-1">
              You cannot undo this action.
            </p>
          </div>
          <ModalButtonContainer>
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
            >
              Replace
            </Button>
          </ModalButtonContainer>
        </>
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
          descriptionMessage={"Provide a name to save your current cohort."}
          closeOnAction={false}
        />
      )}
    </Modal>
  );
};

export default SaveCohortModal;
