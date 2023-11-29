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
  fetchCohortCaseCounts,
  FilterSet,
  setCohort,
  buildGqlOperationToFilterSet,
  NullCountsData,
  useLazyGetCohortByIdQuery,
} from "@gff/core";
import { SaveOrCreateEntityBody } from "./SaveOrCreateEntityModal";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";

/**
 * SaveCohortModal handles saving a user's cohort
 * @param initialName - populates inital value of name field
 * @param onClose - callback triggered when modal closes
 * @param cohortId - id of existing cohort we are saving, if undefined we are not saving a cohort that already exists
 * @param filters - the filters associated with the cohort
 * @param setAsCurrent - whether to set the new cohort as the user's current cohort, should not also pass in cohortId
 * @param saveAs - whether to save existing cohort as new cohort, requires cohortId
 */
const SaveCohortModal = ({
  initialName = "",
  onClose,
  cohortId,
  filters,
  setAsCurrent = false,
  saveAs = false,
}: {
  initialName?: string;
  onClose: () => void;
  cohortId?: string;
  filters: FilterSet;
  setAsCurrent?: boolean;
  saveAs?: boolean;
}): JSX.Element => {
  const coreDispatch = useCoreDispatch();
  const [showReplaceCohort, setShowReplaceCohort] = useState(false);
  const [enteredName, setEnteredName] = useState<string>();
  const [addCohort, { isLoading }] = useAddCohortMutation();
  const [fetchSavedFilters] = useLazyGetCohortByIdQuery();

  const saveAction = async (newName: string, replace: boolean) => {
    const prevCohort = cohortId;
    let saveAsFilters = undefined;

    if (saveAs) {
      // Should use the saved filters of the existing cohort and discard any local changes
      await fetchSavedFilters(cohortId)
        .unwrap()
        .then((payload) => {
          saveAsFilters = payload.filters;
        });
    }

    const addBody = {
      name: newName,
      type: "static",
      filters:
        saveAsFilters !== undefined
          ? saveAsFilters
          : Object.keys(filters.root).length > 0
          ? buildCohortGqlOperator(filters)
          : {},
    };

    await addCohort({ cohort: addBody, delete_existing: replace })
      .unwrap()
      .then((payload) => {
        if (prevCohort && !saveAs) {
          coreDispatch(
            copyCohort({
              sourceId: prevCohort,
              destId: payload.id,
              saved: true,
            }),
          );
          // NOTE: the current cohort can not be undefined. Setting the id to a cohort
          // which does not exist will cause this
          // Therefore, copy the unsaved cohort to the new cohort id received from
          // the BE.
          coreDispatch(
            setCohortMessage([`savedCurrentCohort|${newName}|${payload.id}`]),
          );
          coreDispatch(
            removeCohort({
              shouldShowMessage: false,
              currentID: prevCohort,
            }),
          );
          coreDispatch(setCurrentCohortId(payload.id));
          coreDispatch(updateCohortName(newName));
          coreDispatch(fetchCohortCaseCounts(payload.id));
        } else {
          coreDispatch(
            setCohort({
              id: payload.id,
              name: payload.name,
              filters: buildGqlOperationToFilterSet(payload.filters),
              caseSet: { status: "uninitialized" },
              counts: {
                ...NullCountsData,
              },
              modified_datetime: payload.modified_datetime,
              saved: true,
              modified: false,
            }),
          );
          if (setAsCurrent) {
            coreDispatch(setCurrentCohortId(payload.id));
            coreDispatch(
              setCohortMessage([`savedCohort|${newName}|${payload.id}`]),
            );
          } else {
            coreDispatch(
              setCohortMessage([
                `savedCohortSetCurrent|${payload.name}|${payload.id}`,
              ]),
            );
          }
          coreDispatch(fetchCohortCaseCounts(payload.id));
        }

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
      title={
        showReplaceCohort
          ? "Replace Existing Cohort"
          : saveAs
          ? "Save Cohort As"
          : "Save Cohort"
      }
      size={"md"}
      classNames={{
        content: "p-0",
        title: "text-xl",
      }}
    >
      {showReplaceCohort ? (
        <>
          <div className="p-4">
            <p className="font-content text-sm">
              A saved cohort with same name already exists. Are you sure you
              want to replace it?
            </p>
            <p className="text-xs font-content mt-1">
              You cannot undo this action.
            </p>
          </div>
          <ModalButtonContainer data-testid="modal-button-container">
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
          descriptionMessage={
            saveAs
              ? "Provide a name to save your current cohort as a new cohort"
              : "Provide a name to save the cohort."
          }
          closeOnAction={false}
          loading={isLoading}
        />
      )}
    </Modal>
  );
};

export default SaveCohortModal;
