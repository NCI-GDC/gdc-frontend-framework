"use client";
import React from "react";
import {
  useCoreSelector,
  useCoreDispatch,
  selectCurrentModal,
  Modals,
  hideModal,
} from "@gff/core";
import { Modal } from "@mantine/core";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

const GlobalModals: React.FC = () => {
  const dispatch = useCoreDispatch();
  const modal = useCoreSelector((state) => selectCurrentModal(state));

  return (
    <>
      <Modal
        opened={modal === Modals.SaveSetErrorModal}
        onClose={() => dispatch(hideModal())}
        title="Save Set Error"
      >
        <p className="py-2 px-4">There was a problem saving the set.</p>
        <ModalButtonContainer data-testid="modal-button-container">
          <DarkFunctionButton onClick={() => dispatch(hideModal())}>
            OK
          </DarkFunctionButton>
        </ModalButtonContainer>
      </Modal>

      <Modal
        opened={modal === Modals.SaveCohortErrorModal}
        onClose={() => dispatch(hideModal())}
        title="Save Cohort Error"
      >
        <p className="py-2 px-4">There was a problem saving the cohort.</p>
        <ModalButtonContainer data-testid="modal-button-container">
          <DarkFunctionButton onClick={() => dispatch(hideModal())}>
            OK
          </DarkFunctionButton>
        </ModalButtonContainer>
      </Modal>
    </>
  );
};

export default GlobalModals;
