import { Modal } from "@mantine/core";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";
import { GenericCohortModal } from "../Modals/GenericCohortModal";
import ImportCohortModal from "../Modals/ImportCohortModal";
import CaseSetModal from "@/components/Modals/SetModals/CaseSetModal";
import GeneSetModal from "@/components/Modals/SetModals/GeneSetModal";
import MutationSetModal from "@/components/Modals/SetModals/MutationSetModal";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import { Modals } from "@gff/core";
import { INVALID_COHORT_NAMES, useCohortFacetFilters } from "../utils";

interface CohortModalsProps {
  currentCohort: any;
  cohortName: string;
  cohortId: string;
  filters: any;
  modal: Modals;
  showDelete: boolean;
  showDiscard: boolean;
  showSaveCohort: boolean;
  showSaveAsCohort: boolean;
  showUpdateCohort: boolean;
  onHideModal: () => void;
  onSetShowDelete: (show: boolean) => void;
  onSetShowDiscard: (show: boolean) => void;
  onSetShowSaveCohort: (show: boolean) => void;
  onSetShowSaveAsCohort: (show: boolean) => void;
  onSetShowUpdateCohort: (show: boolean) => void;
  onUpdateCohort: (updateBody: any) => Promise<any>;
  onDiscardChanges: (filters: any) => void;
  onDeleteCohort: () => void;
  updateFilters: (field: string, operation: any) => void;
}

export const CohortModals: React.FC<CohortModalsProps> = ({
  cohortName,
  cohortId,
  filters,
  modal,
  showDelete,
  showDiscard,
  showSaveCohort,
  showSaveAsCohort,
  showUpdateCohort,
  onHideModal,
  onSetShowDelete,
  onSetShowDiscard,
  onSetShowSaveCohort,
  onSetShowSaveAsCohort,
  onSetShowUpdateCohort,
  onUpdateCohort,
  onDiscardChanges,
  onDeleteCohort,
  updateFilters,
}: CohortModalsProps) => {
  return (
    <>
      <GenericCohortModal
        title="Delete Cohort"
        opened={showDelete}
        onClose={() => onSetShowDelete(false)}
        actionText="Delete"
        mainText={
          <>
            Are you sure you want to permanently delete <b>{cohortName}</b>?
          </>
        }
        subText={<>You cannot undo this action.</>}
        onActionClick={onDeleteCohort}
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
        onActionClick={() => onDiscardChanges(filters)}
      />

      <GenericCohortModal
        title="Save Cohort"
        opened={showUpdateCohort}
        onClose={() => onSetShowUpdateCohort(false)}
        actionText="Save"
        mainText={
          <>
            Are you sure you want to save <b>{cohortName}</b>? This will
            overwrite your previously saved changes.
          </>
        }
        subText={<>You cannot undo this action.</>}
        onActionClick={() => {
          onSetShowUpdateCohort(false);
          onUpdateCohort({
            id: cohortId,
            name: cohortName,
            type: "dynamic",
            filters: Object.keys(filters.root).length > 0 ? filters : {},
          });
        }}
      />

      <SaveCohortModal
        initialName={
          !INVALID_COHORT_NAMES.includes(cohortName?.toLowerCase())
            ? cohortName
            : undefined
        }
        opened={showSaveCohort}
        onClose={() => onSetShowSaveCohort(false)}
        cohortId={cohortId}
        filters={filters}
      />

      <SaveCohortModal
        opened={showSaveAsCohort}
        initialName={cohortName}
        onClose={() => onSetShowSaveAsCohort(false)}
        cohortId={cohortId}
        filters={filters}
        saveAs
      />

      <Modal
        opened={modal === Modals.SaveCohortErrorModal}
        onClose={onHideModal}
        title="Save Cohort Error"
      >
        <p className="py-2 px-4">There was a problem saving the cohort.</p>
        <ModalButtonContainer data-testid="modal-button-container">
          <DarkFunctionButton onClick={onHideModal}>OK</DarkFunctionButton>
        </ModalButtonContainer>
      </Modal>

      <ImportCohortModal opened={modal === Modals.ImportCohortModal} />

      <CaseSetModal
        updateFilters={updateFilters}
        existingFiltersHook={useCohortFacetFilters}
        opened={modal === Modals.GlobalCaseSetModal}
      />

      <GeneSetModal
        opened={modal === Modals.GlobalGeneSetModal}
        modalTitle="Filter Current Cohort by Genes"
        inputInstructions="Enter one or more gene identifiers in the field below or upload a file to filter your cohort. Your filtered cohort will consist of cases that have mutations in any of these genes."
        selectSetInstructions="Select one or more sets below to filter your cohort."
        updateFilters={updateFilters}
        existingFiltersHook={useCohortFacetFilters}
      />

      <MutationSetModal
        opened={modal === Modals.GlobalMutationSetModal}
        modalTitle="Filter Current Cohort by Mutations"
        inputInstructions="Enter one or more mutation identifiers in the field below or upload a file to filter your cohort. Your filtered cohort will consist of cases that have any of these mutations."
        selectSetInstructions="Select one or more sets below to filter your cohort."
        updateFilters={updateFilters}
        existingFiltersHook={useCohortFacetFilters}
      />
    </>
  );
};
