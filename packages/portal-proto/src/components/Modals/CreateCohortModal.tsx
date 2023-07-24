import { SaveOrCreateEntityModal } from "./SaveOrCreateEntityModal";

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
