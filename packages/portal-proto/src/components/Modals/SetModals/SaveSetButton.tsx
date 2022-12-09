import React, { useEffect, useState } from "react";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/dist/query";
import {
  selectSets,
  useCoreDispatch,
  useCoreSelector,
  addSet,
  SetTypes,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import { SaveModal } from "@/components/Modals/SaveModal";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface SaveSetButttonProps {
  readonly disabled: boolean;
  readonly setValues: string[];
  readonly createSetHook: UseMutation<MutationDefinition<any, any, any, any>>;
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
  const sets = useCoreSelector((state) => selectSets(state, setType));

  useEffect(() => {
    if (response.isSuccess && setName) {
      dispatch(addSet({ setType, newSet: { [setName]: response.data } }));
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
      <SaveModal
        entity="set"
        initialName=""
        opened={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSaveClick={(name: string) => {
          setSetName(name);
          createSet({ values: setValues });
        }}
        onNameChange={(name) => !Object.keys(sets).includes(name)}
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
