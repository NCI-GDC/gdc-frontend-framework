import { Button, Loader } from "@mantine/core";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";

const ReplaceCohortConfirmation = ({
  onCancel,
  onReplace,
  isLoading,
  isCohortListLoading,
}: {
  onCancel: () => void;
  onReplace: () => void;
  isLoading: boolean;
  isCohortListLoading: boolean;
}) => (
  <>
    <div className="p-4">
      <p className="font-content text-sm">
        A saved cohort with same name already exists. Are you sure you want to
        replace it?
      </p>
      <p className="text-xs font-content mt-1">You cannot undo this action.</p>
    </div>
    <ModalButtonContainer data-testid="modal-button-container">
      <Button
        variant="outline"
        className="bg-white"
        color="secondary"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        variant="filled"
        color="secondary"
        onClick={onReplace}
        data-testid="replace-cohort-button"
        leftSection={
          isLoading || isCohortListLoading ? (
            <Loader size={15} color="white" />
          ) : undefined
        }
      >
        Replace
      </Button>
    </ModalButtonContainer>
  </>
);

export default ReplaceCohortConfirmation;
