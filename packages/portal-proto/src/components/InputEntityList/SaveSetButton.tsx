import React, { useEffect, useState } from "react";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/dist/query";
import {
  selectSetsByType,
  useCoreDispatch,
  useCoreSelector,
  addSet,
  SetTypes,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import { SaveOrCreateEntityModal } from "@/components/Modals/SaveOrCreateEntityModal";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface SaveSetButttonProps {
  readonly disabled: boolean;
  readonly setValues: string[];
  readonly createSetHook: UseMutation<MutationDefinition<any, any, any, any>>;
  readonly setType: SetTypes;
}

const SaveSetButton: React.FC<SaveSetButttonProps> = ({
  disabled,
  setValues,
  createSetHook,
  setType,
}: SaveSetButttonProps) => {
  const dispatch = useCoreDispatch();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [createSet, response] = createSetHook();
  const [setName, setSetName] = useState(null);
  const sets = useCoreSelector((state) => selectSetsByType(state, setType));

  useEffect(() => {
    if (response.isSuccess && setName) {
      dispatch(addSet({ setType, setName, setId: response.data }));
      showNotification({ message: "Set has been saved." });
      setSetName(null);
    } else if (response.isError) {
      showNotification({ message: "Problem saving set.", color: "red" });
    }
  }, [
    response.isSuccess,
    response.isError,
    response.data,
    setName,
    dispatch,
    setType,
  ]);

  return (
    <>
      <SaveOrCreateEntityModal
        entity="set"
        initialName=""
        opened={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onActionClick={(name: string) => {
          setSetName(name);
          createSet({ values: setValues });
        }}
        onNameChange={(name) => !Object.values(sets).includes(name)}
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

export default SaveSetButton;
