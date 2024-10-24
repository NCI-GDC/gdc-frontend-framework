import React from "react";
import { Modal } from "@mantine/core";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";

interface DiscardChangesModalProps {
  readonly action: () => void;
  readonly openModal: boolean;
  readonly onClose: () => void;
}

const DiscardChangesModal: React.FC<DiscardChangesModalProps> = ({
  action,
  openModal,
  onClose,
}: DiscardChangesModalProps) => (
  <Modal
    title="Discard Changes"
    opened={openModal}
    onClose={onClose}
    size="lg"
    centered
    classNames={{
      content: "p-0 drop-shadow-lg",
    }}
  >
    <div className="p-4">
      <p>Are you sure you want to permanently discard the unsaved changes?</p>
      <p className="text-sm">You cannot undo this action.</p>
    </div>
    <ModalButtonContainer data-testid="modal-button-container">
      <FunctionButton data-testid="button-cancel-discard" onClick={onClose}>
        Cancel
      </FunctionButton>
      <DarkFunctionButton
        data-testid="button-discard"
        onClick={() => {
          action();
          onClose();
        }}
      >
        Discard
      </DarkFunctionButton>
    </ModalButtonContainer>
  </Modal>
);

export default DiscardChangesModal;
