import { useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { Modal, Button } from "@mantine/core";
import {
  removeCohort,
  copyToSavedCohort,
  setCohortMessage,
  buildCohortGqlOperator,
  setCurrentCohortId,
  updateCohortName,
  useCoreDispatch,
  useAddCohortMutation,
  fetchCohortCaseCounts,
  FilterSet,
  addNewSavedCohort,
  buildGqlOperationToFilterSet,
  NullCountsData,
  useCoreSelector,
  selectAvailableCohorts,
  useGetCohortsByContextIdQuery,
} from "@gff/core";
import { SaveOrCreateEntityBody } from "./SaveOrCreateEntityModal";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";

const SaveCohortModal = ({
  initialName = "",
  onClose,
  cohortId,
  filters,
  setAsCurrent,
}: {
  initialName?: string;
  onClose: () => void;
  cohortId?: string;
  filters: FilterSet;
  setAsCurrent?: boolean;
}): JSX.Element => {
  const coreDispatch = useCoreDispatch();
  const [showReplaceCohort, setShowReplaceCohort] = useState(false);
  const [cohortReplaced, setCohortReplaced] = useState(false);
  const [enteredName, setEnteredName] = useState<string>();
  const [addCohort, { isLoading }] = useAddCohortMutation();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));
  const {
    data: cohortsListData,
    isSuccess: cohortListSuccess,
    isLoading: cohortListLoading,
  } = useGetCohortsByContextIdQuery(null, { skip: !cohortReplaced });

  useDeepCompareEffect(() => {
    if (cohortListSuccess && cohortReplaced) {
      // Remove replaced cohort
      const updatedCohortIds = (cohortsListData || []).map(
        (cohort) => cohort.id,
      );
      const outdatedCohortsIds = cohorts
        .filter((c) => c.saved && !updatedCohortIds.includes(c.id))
        .map((c) => c.id);
      for (const id of outdatedCohortsIds) {
        coreDispatch(removeCohort({ currentID: id }));
      }

      onClose();
    }
  }, [
    cohortListSuccess,
    cohortReplaced,
    cohortsListData,
    cohorts,
    coreDispatch,
    onClose,
  ]);

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
        if (prevCohort) {
          coreDispatch(
            copyToSavedCohort({
              sourceId: prevCohort,
              destId: payload.id,
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
            addNewSavedCohort({
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

        // Need to wait for request removing outdated cohorts to finish when replacing cohort
        if (replace) {
          setCohortReplaced(true);
        } else {
          onClose();
        }
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
          loading={isLoading || cohortListLoading}
        >
          Replace
        </Button>
      </ModalButtonContainer>
    </>
  );

  return (
    <Modal
      opened
      onClose={showReplaceCohort ? () => setShowReplaceCohort(false) : onClose}
      title={showReplaceCohort ? "Replace Existing Cohort" : "Save Cohort"}
      size={"md"}
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
          descriptionMessage={"Provide a name to save the cohort."}
          closeOnAction={false}
          loading={isLoading}
          disallowedNames={["unsaved_cohort"]}
        />
      )}
    </Modal>
  );
};

export default SaveCohortModal;
