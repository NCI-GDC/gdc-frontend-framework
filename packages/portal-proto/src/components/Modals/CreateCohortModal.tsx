import { useCoreSelector, selectAvailableCohorts } from "@gff/core";
import { SaveOrCreateEntityModal } from "./SaveOrCreateEntityModal";

const CreateCohortModal = ({
  onClose,
  onActionClick,
}: {
  onClose: () => void;
  onActionClick: (name: string) => void;
}): JSX.Element => {
  console.log("here");
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const onNameChange = (name: string) =>
    cohorts.every((cohort) => cohort.name !== name);

  return (
    <SaveOrCreateEntityModal
      entity="cohort"
      action="Create"
      opened
      onClose={onClose}
      onActionClick={onActionClick}
      onNameChange={onNameChange}
      descriptionMessage={
        "Create a new unsaved cohort. This cohort will not be saved until you click the Save Cohort button in the Cohort Bar."
      }
    />
  );
};

export default CreateCohortModal;
