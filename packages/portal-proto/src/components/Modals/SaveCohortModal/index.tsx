import { useState, useCallback } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { Modal } from "@mantine/core";
import {
  removeCohort,
  setCohortMessage,
  buildCohortGqlOperator,
  useAddCohortMutation,
  buildGqlOperationToFilterSet,
  useCoreSelector,
  selectAvailableCohorts,
  useLazyGetCohortsByContextIdQuery,
  discardCohortChanges,
  showModal,
  Modals,
  FilterSet,
} from "@gff/core";
import { SaveOrCreateEntityBody } from "../SaveOrCreateEntityModal";
import { INVALID_COHORT_NAMES } from "@/features/cohortBuilder/utils";
import { omit } from "lodash";
import useCohortOperations from "./useCohortOperations";
import ReplaceCohortConfirmation from "./ReplaceCohortConfirmation";

interface CohortState {
  showReplaceCohort: boolean;
  cohortReplaced: boolean;
  enteredName?: string;
  cohortSavedMessage?: string[];
}

interface SaveCohortModalProps {
  opened: boolean;
  initialName?: string;
  onClose: () => void;
  cohortId?: string;
  filters: FilterSet;
  caseFilters?: FilterSet;
  createStaticCohort?: boolean;
  setAsCurrent?: boolean;
  saveAs?: boolean;
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
 * @category Modals
 */
const SaveCohortModal = ({
  opened,
  initialName = "",
  onClose,
  cohortId,
  filters,
  caseFilters,
  createStaticCohort = false,
  setAsCurrent = false,
  saveAs = false,
}: SaveCohortModalProps): JSX.Element => {
  const {
    createStaticCohortSet,
    updateCohortState,
    fetchSavedFilters,
    coreDispatch,
  } = useCohortOperations();
  const [addCohort, { isLoading: isAddCohortLoading }] = useAddCohortMutation();
  const [
    fetchCohortList,
    { isSuccess: isCohortListSuccess, isLoading: isCohortListLoading },
  ] = useLazyGetCohortsByContextIdQuery();

  const [state, setState] = useState<CohortState>({
    showReplaceCohort: false,
    cohortReplaced: false,
    enteredName: undefined,
    cohortSavedMessage: undefined,
  });
  const cohorts = useCoreSelector(selectAvailableCohorts);

  const closeModal = useCallback(() => {
    onClose();
    setState({
      showReplaceCohort: false,
      cohortReplaced: false,
      enteredName: undefined,
      cohortSavedMessage: undefined,
    });
  }, [onClose]);

  useDeepCompareEffect(() => {
    const fetchCohortsListFunc = async () => {
      if (!opened || !state.cohortReplaced) return;

      try {
        const payload = await fetchCohortList(null).unwrap();
        const updatedCohortIds = (payload || []).map((cohort) => cohort.id);

        // Find outdated cohorts
        const outdatedCohortsIds = cohorts
          .filter((c) => c.saved && !updatedCohortIds.includes(c.id))
          .map((c) => c.id);

        // Remove outdated cohorts
        outdatedCohortsIds.forEach((id) => {
          coreDispatch(removeCohort({ id }));
        });

        coreDispatch(setCohortMessage(state.cohortSavedMessage));
        closeModal();
      } catch (error) {
        console.error("Error fetching cohorts:", error);
      }
    };

    fetchCohortsListFunc();
  }, [
    fetchCohortList,
    isCohortListSuccess,
    state.cohortReplaced,
    cohorts,
    coreDispatch,
    opened,
    closeModal,
    state.cohortSavedMessage,
  ]);

  const handleSaveAction = async (newName: string, replace: boolean) => {
    try {
      let cohortFilters = filters;

      if (createStaticCohort) {
        try {
          cohortFilters = await createStaticCohortSet(filters, caseFilters);
        } catch {
          onClose();
          return;
        }
      }

      const filteredCohortFilters = omit(cohortFilters, "isLoggedIn");
      const addBody = {
        name: newName,
        type: "dynamic",
        filters:
          Object.keys(filteredCohortFilters.root).length > 0
            ? buildCohortGqlOperator(filteredCohortFilters)
            : {},
      };

      const cohortPayload = await addCohort({
        cohort: addBody,
        delete_existing: replace,
      }).unwrap();

      const tempCohortMsg = await updateCohortState({
        cohortPayload,
        newName,
        prevCohortId: cohortId,
        setAsCurrent,
        saveAs,
      });

      if (saveAs && initialName !== newName) {
        // Should discard local changes from current cohort when saving as
        const savedFilters = await fetchSavedFilters(cohortId).unwrap();
        coreDispatch(
          discardCohortChanges({
            filters: buildGqlOperationToFilterSet(savedFilters.filters),
            showMessage: false,
            id: cohortId,
          }),
        );
      }

      if (replace) {
        setState((prev) => ({
          ...prev,
          cohortSavedMessage: tempCohortMsg,
          cohortReplaced: true,
        }));
      } else {
        coreDispatch(setCohortMessage(tempCohortMsg));
        closeModal();
      }
    } catch (error) {
      if (
        (error as FetchBaseQueryError)?.data &&
        ((error as FetchBaseQueryError).data as { message: string })
          ?.message === "Bad Request: Name must be unique (case-insensitive)"
      ) {
        setState((prev) => ({ ...prev, showReplaceCohort: true }));
      } else {
        onClose();
        coreDispatch(showModal({ modal: Modals.SaveCohortErrorModal }));
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={
        state.showReplaceCohort
          ? () => setState((prev) => ({ ...prev, showReplaceCohort: false }))
          : onClose
      }
      title={
        state.showReplaceCohort
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
      {state.showReplaceCohort ? (
        <ReplaceCohortConfirmation
          onCancel={() =>
            setState((prev) => ({ ...prev, showReplaceCohort: false }))
          }
          onReplace={() => handleSaveAction(state.enteredName!, true)}
          isLoading={isAddCohortLoading}
          isCohortListLoading={isCohortListLoading}
        />
      ) : (
        <SaveOrCreateEntityBody
          entity="cohort"
          action="Save"
          initialName={initialName}
          onClose={onClose}
          onActionClick={(name: string) => {
            handleSaveAction(name, false);
            setState((prev) => ({ ...prev, enteredName: name }));
          }}
          descriptionMessage={
            saveAs
              ? "Provide a name to save your current cohort as a new cohort"
              : "Provide a name to save the cohort."
          }
          closeOnAction={false}
          loading={isAddCohortLoading}
          disallowedNames={INVALID_COHORT_NAMES}
        />
      )}
    </Modal>
  );
};

export default SaveCohortModal;
