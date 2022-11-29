import { hideModal, useCoreDispatch } from "@gff/core";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

const SetModalButtons: React.FC = () => {
  const dispatch = useCoreDispatch();

  return (
    <div className="bg-base-lightest flex p-4 gap-4 justify-end mt-4 rounded-b-lg">
      <DarkFunctionButton className={"mr-auto"}>Save Set</DarkFunctionButton>
      <FunctionButton onClick={() => dispatch(hideModal())}>
        Cancel
      </FunctionButton>
      <DarkFunctionButton>Clear</DarkFunctionButton>
      <DarkFunctionButton>Submit</DarkFunctionButton>
    </div>
  );
};

export default SetModalButtons;
