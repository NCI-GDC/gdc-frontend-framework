import { hideModal, useCoreDispatch } from "@gff/core";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface SetModalButtonsProps {
  readonly saveButtonDisabled?: boolean;
  readonly clearButtonDisabled?: boolean;
  readonly submitButtonDisabled?: boolean;
}

const SetModalButtons: React.FC<SetModalButtonsProps> = ({
  saveButtonDisabled = false,
  clearButtonDisabled = false,
  submitButtonDisabled = false,
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
      <DarkFunctionButton disabled={clearButtonDisabled}>
        Clear
      </DarkFunctionButton>
      <DarkFunctionButton disabled={submitButtonDisabled}>
        Submit
      </DarkFunctionButton>
    </div>
  );
};

export default SetModalButtons;
