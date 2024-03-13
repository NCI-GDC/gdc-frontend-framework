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
  FilterSet,
  addNewSavedCohort,
  buildGqlOperationToFilterSet,
  NullCountsData,
  useCoreSelector,
  selectAvailableCohorts,
  useGetCohortsByContextIdQuery,
  useLazyGetCohortByIdQuery,
  discardCohortChanges,
  showModal,
  Modals,
  fetchCohortCaseCounts,
} from "@gff/core";
import { SaveOrCreateEntityBody } from "./SaveOrCreateEntityModal";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import { INVALID_COHORT_NAMES } from "@/features/cohortBuilder/utils";

/**
 * SaveCohortModal handles saving a user's cohort
 * @param initialName - populates inital value of name field
 * @param onClose - callback triggered when modal closes
 * @param cohortId - id of existing cohort we are saving, if undefined we are not saving a cohort that already exists
 * @param filters - the filters associated with the cohort
 * @param setAsCurrent - whether to set the new cohort as the user's current cohort, should not also pass in cohortId
 * @param saveAs - whether to save existing cohort as new cohort, requires cohortId
 * @category Modals
 */
const SaveCohortModal = ({
  opened,
  initialName = "",
  onClose,
  cohortId,
  filters,
  setAsCurrent = false,
  saveAs = false,
}: {
  opened: boolean;
  initialName?: string;
  onClose: () => void;
  cohortId?: string;
  filters: FilterSet;
  setAsCurrent?: boolean;
  saveAs?: boolean;
}): JSX.Element => {
  const coreDispatch = useCoreDispatch();
  const [showReplaceCohort, setShowReplaceCohort] = useState(false);
  const [cohortReplaced, setCohortReplaced] = useState(false);
  const [enteredName, setEnteredName] = useState<string>();
  const [addCohort, { isLoading }] = useAddCohortMutation();
  const [cohortSavedMessage, setCohortSavedMessage] = useState<string[]>();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const {
    data: cohortsListData,
    isSuccess: cohortListSuccess,
    isLoading: cohortListLoading,
  } = useGetCohortsByContextIdQuery(null, { skip: !cohortReplaced });

  useDeepCompareEffect(() => {
    if (opened && cohortListSuccess && cohortReplaced) {
      // Remove replaced cohort
      const updatedCohortIds = (cohortsListData || []).map(
        (cohort) => cohort.id,
      );
      const outdatedCohortsIds = cohorts
        .filter((c) => c.saved && !updatedCohortIds.includes(c.id))
        .map((c) => c.id);
      for (const id of outdatedCohortsIds) {
        coreDispatch(removeCohort({ id }));
      }

      coreDispatch(setCohortMessage(cohortSavedMessage));
      onClose();
    }
  }, [
    cohortListSuccess,
    cohortReplaced,
    cohortsListData,
    cohorts,
    coreDispatch,
    opened,
    onClose,
    cohortSavedMessage,
  ]);
  const [fetchSavedFilters] = useLazyGetCohortByIdQuery();

  const saveAction = async (newName: string, replace: boolean) => {
    const prevCohort = cohortId;

    const addBody = {
      name: newName,
      type: "dynamic",
      filters:
        Object.keys(filters.root).length > 0
          ? buildCohortGqlOperator(filters)
          : {},
    };

    await addCohort({ cohort: addBody, delete_existing: replace })
      .unwrap()
      .then(async (payload) => {
        let tempCohortMsg: string[];
        if (prevCohort) {
          if (saveAs) {
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
            coreDispatch(setCurrentCohortId(payload.id));
            tempCohortMsg = [`savedCohort|${newName}|${payload.id}`];
          } else {
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

            // possible that the caseCount are undefined or pending so
            // re-request counts.
            coreDispatch(fetchCohortCaseCounts(payload.id)); // fetch counts for new cohort

            tempCohortMsg = [`savedCurrentCohort|${newName}|${payload.id}`];

            coreDispatch(
              removeCohort({
                shouldShowMessage: false,
                id: prevCohort,
              }),
            );
            coreDispatch(setCurrentCohortId(payload.id));
            coreDispatch(updateCohortName(newName));
          }
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
            tempCohortMsg = [`savedCohort|${newName}|${payload.id}`];
          } else {
            tempCohortMsg = [
              `savedCohortSetCurrent|${payload.name}|${payload.id}`,
            ];
          }
        }

        if (saveAs && initialName !== newName) {
          // Should discard local changes from current cohort when saving as
          await fetchSavedFilters(prevCohort)
            .unwrap()
            .then((payload) => {
              coreDispatch(
                discardCohortChanges({
                  filters: buildGqlOperationToFilterSet(payload.filters),
                  showMessage: false,
                  id: prevCohort,
                }),
              );
            });
        }

        // Need to wait for request removing outdated cohorts to finish when replacing cohort
        if (replace) {
          setCohortSavedMessage(tempCohortMsg);
          setCohortReplaced(true);
        } else {
          coreDispatch(setCohortMessage(tempCohortMsg));
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
          coreDispatch(showModal({ modal: Modals.SaveCohortErrorModal }));
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
          loading={isLoading}
          disallowedNames={INVALID_COHORT_NAMES}
        />
      )}
    </Modal>
  );
};

export default SaveCohortModal;
