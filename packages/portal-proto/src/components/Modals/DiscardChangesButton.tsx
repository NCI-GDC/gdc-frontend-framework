import React, { useContext, useState } from "react";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import DiscardChangesModal from "./DiscardChangesModal";
import { UserInputContext } from "./UserInputModal";

interface DiscardChangesButtonProps {
  readonly action: () => void;
  readonly label: string;
  readonly disabled?: boolean;
  readonly dark?: boolean;
  readonly customDataTestID?: string;
}

const DiscardChangesButton: React.FC<DiscardChangesButtonProps> = ({
  action,
  label,
  disabled = false,
  dark = true,
  customDataTestID,
}: DiscardChangesButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const [userEnteredInput] = useContext(UserInputContext);

  return (
    <>
      <DiscardChangesModal
        openModal={showModal}
        action={action}
        onClose={() => setShowModal(false)}
      />
      {dark ? (
        <DarkFunctionButton
          data-testid={customDataTestID}
          disabled={disabled}
          onClick={() => (userEnteredInput ? setShowModal(true) : action())}
        >
          {label}
        </DarkFunctionButton>
      ) : (
        <FunctionButton
          data-testid={customDataTestID}
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
