import React, { useState, useMemo } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { Modal } from "@mantine/core";
import { SetTypes } from "@gff/core";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import FunctionButton from "@/components/FunctionButton";
import SetTable from "./SetTable";
import { modalStyles } from "../styles";

interface AddToSetModalProps {
  readonly selection: string[];
  readonly setType: SetTypes;
  readonly closeModal: () => void;
  readonly countHook: UseQuery<any>;
}

const AddToSetModal: React.FC<AddToSetModalProps> = ({
  selection,
  setType,
  closeModal,
  countHook,
}: AddToSetModalProps) => {
  const [selectedSets, setSelectedSets] = useState<string[]>([]);
  const max = selection.length > 50000 ? 50000 : selection.length;

  return (
    <Modal
      title={`Add ${max} ${setType} to an existing set`}
      closeButtonLabel="close"
      opened
      onClose={closeModal}
      size="lg"
      classNames={modalStyles}
      withinPortal={false}
    >
      <div className="p-4">
        <SetTable
          selectedSets={selectedSets}
          setSelectedSets={setSelectedSets}
          countHook={countHook}
          setType={setType}
          setTypeLabel={setType}
        />
      </div>
      <ModalButtonContainer>
        <FunctionButton onClick={closeModal}>Cancel</FunctionButton>
        <DarkFunctionButton>Save</DarkFunctionButton>
      </ModalButtonContainer>
    </Modal>
  );
};

export default AddToSetModal;
