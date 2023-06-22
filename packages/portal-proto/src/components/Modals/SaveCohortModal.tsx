import { SaveOrCreateEntityModal } from "./SaveOrCreateEntityModal";

const SaveCohortModal = ({
  initialName = "",
  opened,
  onClose,
  onActionClick,
  onNameChange,
  additionalDuplicateMessage,
}: {
  initialName?: string;
  opened: boolean;
  onClose: () => void;
  onActionClick: (name: string) => void;
  onNameChange: (name: string) => boolean;
  additionalDuplicateMessage?: string;
}): JSX.Element => (
  <SaveOrCreateEntityModal
    entity="cohort"
    action="Save"
    initialName={initialName}
    opened={opened}
    onClose={onClose}
    onActionClick={onActionClick}
    onNameChange={onNameChange}
    descriptionMessage={"Provide a name to save your current cohort."}
    additionalDuplicateMessage={additionalDuplicateMessage}
  />
);

export default SaveCohortModal;
