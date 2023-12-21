import { SaveOrCreateEntityModal } from "./SaveOrCreateEntityModal";

/**
 * Modal that will display when the user clicks a create cohort button.
 * @param onClose - callback to close the modal
 * @param onActionClick - callback to create the cohort
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
