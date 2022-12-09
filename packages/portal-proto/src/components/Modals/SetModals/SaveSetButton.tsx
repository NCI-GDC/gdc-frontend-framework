import React, { useEffect, useState } from "react";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  selectSetExists,
  useCoreDispatch,
  useCoreSelector,
  addSet,
  useCreateGeneSetMutation,
  SetTypes,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import { SaveModal } from "@/components/Modals/SaveModal";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface SaveSetButttonProps {
  readonly disabled: boolean;
  readonly setValues: string[];
  readonly createSetHook: UseMutation<any>;
  readonly setType: SetTypes;
}

const SaveSetButtton: React.FC<SaveSetButttonProps> = ({
  disabled,
  setValues,
  createSetHook,
  setType,
}: SaveSetButttonProps) => {
  const dispatch = useCoreDispatch();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [createSet, response] = createSetHook();
  const [setName, setSetName] = useState(null);

  useEffect(() => {
    if (response.isSuccess && setName) {
      dispatch(addSet({ setType, newSet: { [response.data]: setName } }));
      showNotification({ message: "Set has been saved." });
      setSetName(null);
    } else if (response.isError) {
      showNotification({ message: "Problem saving set.", color: "red" });
    }
  }, [response.isSuccess, response.isError, setName]);

  return (
    <>
      <SaveModal
        entity="set"
        initialName=""
        opened={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSaveClick={async (name: string) => {
          setSetName(name);
          await createSet({ values: setValues });
        }}
        onNameChange={(name) =>
          useCoreSelector((state) => !selectSetExists(state, "gene", name))
        }
        additionalDuplicateMessage={"This will overwrite it."}
      />
      <DarkFunctionButton
        className={"mr-auto"}
        disabled={disabled}
        onClick={() => setShowSaveModal(true)}
      >
        Save Set
      </DarkFunctionButton>
    </>
  );
};

export default SaveSetButtton;
