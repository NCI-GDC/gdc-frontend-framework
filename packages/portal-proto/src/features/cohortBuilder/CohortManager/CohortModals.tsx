import { LoadingOverlay, Modal } from "@mantine/core";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";
import { GenericCohortModal } from "../Modals/GenericCohortModal";
import ImportCohortModal from "../Modals/ImportCohortModal";
import CaseSetModal from "@/components/Modals/SetModals/CaseSetModal";
import GeneSetModal from "@/components/Modals/SetModals/GeneSetModal";
import MutationSetModal from "@/components/Modals/SetModals/MutationSetModal";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import {
  addNewSavedCohort,
  buildCohortGqlOperator,
  buildGqlOperationToFilterSet,
  DataStatus,
  discardCohortChanges,
  FilterSet,
  hideModal,
  Modals,
  Operation,
  removeCohort,
  selectCurrentCohortId,
  selectCurrentCohortName,
  selectCurrentCohortSaved,
  selectCurrentModal,
  setCohortMessage,
  showModal,
  updateActiveCohortFilter,
  useCoreDispatch,
  useCoreSelector,
  useCurrentCohortCounts,
  useDeleteCohortMutation,
  useLazyGetCohortByIdQuery,
  useUpdateCohortMutation,
} from "@gff/core";
import { INVALID_COHORT_NAMES, useCohortFacetFilters } from "../utils";
import { omit } from "lodash";
import { useDeepCompareCallback } from "use-deep-compare";

interface CohortModalsProps {
  showDelete: boolean;
  showDiscard: boolean;
  showSaveCohort: boolean;
  showSaveAsCohort: boolean;
  showUpdateCohort: boolean;
  onSetShowDelete: (show: boolean) => void;
  onSetShowDiscard: (show: boolean) => void;
  onSetShowSaveCohort: (show: boolean) => void;
  onSetShowSaveAsCohort: (show: boolean) => void;
  onSetShowUpdateCohort: (show: boolean) => void;
}

export const CohortModals: React.FC<CohortModalsProps> = ({
  showDelete,
  showDiscard,
  showSaveCohort,
  showSaveAsCohort,
  showUpdateCohort,
  onSetShowDelete,
  onSetShowDiscard,
  onSetShowSaveCohort,
  onSetShowSaveAsCohort,
  onSetShowUpdateCohort,
}: CohortModalsProps) => {
  const coreDispatch = useCoreDispatch();
  const counts = useCurrentCohortCounts();
  const modal = useCoreSelector(selectCurrentModal);
  const currentCohortId = useCoreSelector(selectCurrentCohortId);
  const currentCohortName = useCoreSelector(selectCurrentCohortName);
  const currentCohortSaved = useCoreSelector(selectCurrentCohortSaved);
  const filters = useCohortFacetFilters(); // make sure using this one //TODO maybe use from one amongst the selectors
  // Cohort persistence
  const [deleteCohortFromBE, { isLoading: isDeleteCohortLoading }] =
    useDeleteCohortMutation();
  const [updateCohort, { isLoading: isUpdateCohortLoading }] =
    useUpdateCohortMutation();
  const [trigger, { isFetching: isCohortIdFetching }] =
    useLazyGetCohortByIdQuery();

  const discardChanges = useDeepCompareCallback(
    (filters: FilterSet | undefined) => {
      coreDispatch(discardCohortChanges({ filters, showMessage: true }));
    },
    [coreDispatch],
  );

  const deleteCohort = useDeepCompareCallback(() => {
    coreDispatch(removeCohort({ shouldShowMessage: true }));
    // fetch case counts is now handled in listener
  }, [coreDispatch]);

  const handleUpdate = useDeepCompareCallback(async () => {
    const filteredCohortFilters = omit(filters, "isLoggedIn");
    const updateBody = {
      id: currentCohortId,
      name: currentCohortName,
      type: "dynamic",
      filters:
        Object.keys(filteredCohortFilters.root).length > 0
          ? buildCohortGqlOperator(filteredCohortFilters)
          : {},
    };

    try {
      const response = await updateCohort(updateBody).unwrap();
      coreDispatch(
        setCohortMessage([
          `savedCurrentCohort|${currentCohortName}|${currentCohortId}`,
        ]),
      );
      const cohort = {
        id: response.id,
        name: response.name,
        filters: buildGqlOperationToFilterSet(response.filters),
        caseSet: {
          caseSetId: buildGqlOperationToFilterSet(response.filters),
          status: "fulfilled" as DataStatus,
        },
        counts: {
          ...counts.data,
          status: counts.status,
        },
        modified_datetime: response.modified_datetime,
      };
      coreDispatch(addNewSavedCohort(cohort));
    } catch {
      coreDispatch(showModal({ modal: Modals.SaveCohortErrorModal }));
    }
  }, [
    currentCohortId,
    currentCohortName,
    filters,
    updateCohort,
    coreDispatch,
    counts,
  ]);

  const handleDiscard = useDeepCompareCallback(() => {
    if (currentCohortSaved) {
      trigger(currentCohortId)
        .unwrap()
        .then((payload) => {
          discardChanges(buildGqlOperationToFilterSet(payload.filters));
        })
        .catch(() =>
          coreDispatch(setCohortMessage(["error|discarding|allId"])),
        );
    } else {
      discardChanges(undefined);
    }
  }, [
    currentCohortSaved,
    trigger,
    currentCohortId,
    discardChanges,
    coreDispatch,
  ]);

  const handleDelete = useDeepCompareCallback(async () => {
    // only delete cohort from BE if it's been saved before
    if (currentCohortSaved) {
      try {
        // don't delete it from the local adapter if not able to delete from the BE
        await deleteCohortFromBE(currentCohortId).unwrap();
        deleteCohort();
      } catch {
        coreDispatch(setCohortMessage(["error|deleting|allId"]));
      }
    } else {
      deleteCohort();
    }
  }, [
    currentCohortSaved,
    deleteCohortFromBE,
    currentCohortId,
    deleteCohort,
    coreDispatch,
  ]);

  const updateCohortFilters = useDeepCompareCallback(
    (field: string, operation: Operation) => {
      coreDispatch(updateActiveCohortFilter({ field, operation }));
    },
    [coreDispatch],
  );

  return (
    <>
      {(isCohortIdFetching ||
        isDeleteCohortLoading ||
        isUpdateCohortLoading) && (
        <LoadingOverlay data-testid="loading-spinner" visible />
      )}
      <GenericCohortModal
        title="Delete Cohort"
        opened={showDelete}
        onClose={() => onSetShowDelete(false)}
        actionText="Delete"
        mainText={
          <>
            Are you sure you want to permanently delete{" "}
            <b>{currentCohortName}</b>?
          </>
        }
        subText={<>You cannot undo this action.</>}
        onActionClick={handleDelete}
      />

      <GenericCohortModal
        title="Discard Changes"
        opened={showDiscard}
        onClose={() => onSetShowDiscard(false)}
        actionText="Discard"
        mainText={
          <>Are you sure you want to permanently discard the unsaved changes?</>
        }
        subText={<>You cannot undo this action.</>}
        onActionClick={handleDiscard}
      />

      <GenericCohortModal
        title="Save Cohort"
        opened={showUpdateCohort}
        onClose={() => onSetShowUpdateCohort(false)}
        actionText="Save"
        mainText={
          <>
            Are you sure you want to save <b>{currentCohortName}</b>? This will
            overwrite your previously saved changes.
          </>
        }
        subText={<>You cannot undo this action.</>}
        onActionClick={() => {
          onSetShowUpdateCohort(false);
          handleUpdate();
        }}
      />

      <SaveCohortModal
        initialName={
          !INVALID_COHORT_NAMES.includes(currentCohortName?.toLowerCase())
            ? currentCohortName
            : undefined
        }
        opened={showSaveCohort}
        onClose={() => onSetShowSaveCohort(false)}
        cohortId={currentCohortId}
        filters={filters}
      />

      <SaveCohortModal
        opened={showSaveAsCohort}
        initialName={currentCohortName}
        onClose={() => onSetShowSaveAsCohort(false)}
        cohortId={currentCohortId}
        filters={filters}
        saveAs
      />

      <Modal
        opened={modal === Modals.SaveCohortErrorModal}
        onClose={() => coreDispatch(hideModal())}
        title="Save Cohort Error"
      >
        <p className="py-2 px-4">There was a problem saving the cohort.</p>
        <ModalButtonContainer data-testid="modal-button-container">
          <DarkFunctionButton onClick={() => coreDispatch(hideModal())}>
            OK
          </DarkFunctionButton>
        </ModalButtonContainer>
      </Modal>

      <ImportCohortModal opened={modal === Modals.ImportCohortModal} />

      <CaseSetModal
        updateFilters={updateCohortFilters}
        existingFiltersHook={useCohortFacetFilters}
        opened={modal === Modals.GlobalCaseSetModal}
      />

      <GeneSetModal
        opened={modal === Modals.GlobalGeneSetModal}
        modalTitle="Filter Current Cohort by Mutated Genes"
        inputInstructions="Enter one or more gene identifiers in the field below or upload a file to filter your cohort. Your filtered cohort will consist of cases that have mutations in any of these genes."
        selectSetInstructions="Select one or more sets below to filter your cohort."
        updateFilters={updateCohortFilters}
        existingFiltersHook={useCohortFacetFilters}
      />

      <MutationSetModal
        opened={modal === Modals.GlobalMutationSetModal}
        modalTitle="Filter Current Cohort by Somatic Mutations"
        inputInstructions="Enter one or more mutation identifiers in the field below or upload a file to filter your cohort. Your filtered cohort will consist of cases that have any of these mutations."
        selectSetInstructions="Select one or more sets below to filter your cohort."
        updateFilters={updateCohortFilters}
        existingFiltersHook={useCohortFacetFilters}
      />
    </>
  );
};
