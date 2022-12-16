import React, { useState } from "react";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import DiscardChangesModal from "./DiscardChangesModal";

interface DiscardChangesButtonProps {
  readonly action: () => void;
  readonly label: string;
  readonly userEnteredInput: boolean;
  readonly disabled?: boolean;
  readonly dark?: boolean;
}

const DiscardChangesButton: React.FC<DiscardChangesButtonProps> = ({
  action,
  label,
  userEnteredInput,
  disabled = false,
  dark = true,
}: DiscardChangesButtonProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <DiscardChangesModal
        openModal={showModal}
        action={action}
        onClose={() => setShowModal(false)}
      />
      {dark ? (
        <DarkFunctionButton
          disabled={disabled}
          onClick={() => (userEnteredInput ? setShowModal(true) : action())}
        >
          {label}
        </DarkFunctionButton>
      ) : (
        <FunctionButton
          disabled={disabled}
          onClick={() => (userEnteredInput ? setShowModal(true) : action())}
        >
          {label}
        </FunctionButton>
      )}
    </>
  );
};

export default DiscardChangesButton;
