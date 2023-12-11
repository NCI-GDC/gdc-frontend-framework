import React, { useEffect, useState } from "react";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/dist/query";
import {
  selectSetsByType,
  useCoreDispatch,
  useCoreSelector,
  addSet,
  SetTypes,
  hideModal,
} from "@gff/core";
import { showNotification } from "@mantine/notifications";
import { SaveOrCreateEntityModal } from "@/components/Modals/SaveOrCreateEntityModal";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface SaveSetButttonProps {
  readonly disabled: boolean;
  readonly ids: string[];
  readonly hooks: {
    createSet: UseMutation<MutationDefinition<any, any, any, any>>;
  };
  readonly setType: SetTypes;
  readonly buttonText?: string;
  readonly dismissModal?: boolean;
}

const SaveSetButton: React.FC<SaveSetButttonProps> = ({
  disabled,
  ids,
  hooks,
  setType,
  buttonText = "Save Set",
  dismissModal = false,
}: SaveSetButttonProps) => {
  const dispatch = useCoreDispatch();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [createSet, response] = hooks.createSet();
  const [setName, setSetName] = useState(null);
  const sets = useCoreSelector((state) => selectSetsByType(state, setType));

  useEffect(() => {
    if (response.isSuccess && setName) {
      dispatch(addSet({ setType, setName, setId: response.data }));
      showNotification({ message: "Set has been saved." });
      if (dismissModal) {
        dispatch(hideModal());
      }
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
    dismissModal,
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
          createSet({ values: ids });
        }}
        onNameChange={(name) => !Object.values(sets).includes(name)}
        additionalDuplicateMessage="This will overwrite it."
      />
      <DarkFunctionButton
        disabled={disabled}
        onClick={() => setShowSaveModal(true)}
      >
        {buttonText}
      </DarkFunctionButton>
    </>
  );
};

export const SubmitSaveSetButton: React.FC<SaveSetButttonProps> = (
  props: SaveSetButttonProps,
) => <SaveSetButton {...props} buttonText="Submit" dismissModal />;

export default SaveSetButton;
