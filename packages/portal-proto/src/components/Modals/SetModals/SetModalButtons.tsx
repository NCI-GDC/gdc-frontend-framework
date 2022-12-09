import { hideModal, useCoreDispatch } from "@gff/core";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface SetModalButtonsProps {
  readonly saveButtonDisabled?: boolean;
  readonly clearButtonDisabled?: boolean;
  readonly submitButtonDisabled?: boolean;
  readonly onClearCallback?: () => void;
  readonly onSubmitCallback?: () => void;
}

const SetModalButtons: React.FC<SetModalButtonsProps> = ({
  saveButtonDisabled = false,
  clearButtonDisabled = false,
  submitButtonDisabled = false,
  onClearCallback,
  onSubmitCallback,
}: SetModalButtonsProps) => {
  const dispatch = useCoreDispatch();

  return (
    <div className="bg-base-lightest flex p-4 gap-4 justify-end mt-4 rounded-b-lg sticky">
      <DarkFunctionButton className={"mr-auto"} disabled={saveButtonDisabled}>
        Save Set
      </DarkFunctionButton>
      <FunctionButton onClick={() => dispatch(hideModal())}>
        Cancel
      </FunctionButton>
      <DarkFunctionButton
        disabled={clearButtonDisabled}
        onClick={onClearCallback}
      >
        Clear
      </DarkFunctionButton>
      <DarkFunctionButton
        disabled={submitButtonDisabled}
        onClick={onSubmitCallback}
      >
        Submit
      </DarkFunctionButton>
    </div>
  );
};

export default SetModalButtons;
