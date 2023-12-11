import { SaveOrCreateEntityModal } from "./SaveOrCreateEntityModal";

/**
 * Modal for creating a new cohort
 * @param onClose - callback for closing the modal
 * @param onActionClick - callback for clicking the action button
 * @category Modals
 */
const CreateCohortModal = ({
  onClose,
  onActionClick,
}: {
  onClose: () => void;
  onActionClick: (name: string) => void;
}): JSX.Element => {
  return (
    <SaveOrCreateEntityModal
      entity="cohort"
      action="Create"
      opened
      onClose={onClose}
      onActionClick={onActionClick}
      descriptionMessage={
        "Create a new unsaved cohort. This cohort will not be saved until you click the Save Cohort button in the Cohort Bar."
      }
    />
  );
};

export default CreateCohortModal;
