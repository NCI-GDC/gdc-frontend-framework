import React, { useState, useRef, useEffect } from "react";
import { ActionIcon, TextInput } from "@mantine/core";
import { FaCheck as CheckIcon } from "react-icons/fa";
import { PiPencilSimpleLineBold as EditIcon } from "react-icons/pi";
import { MdClose as CloseIcon } from "react-icons/md";
import {
  useCoreDispatch,
  SetTypes,
  renameSet,
  useCoreSelector,
  selectSetsByType,
} from "@gff/core";
import ErrorMessage from "@/components/ErrorMessage";
import WarningMessage from "@/components/WarningMessage";

interface SetNameInputProps {
  readonly setName: string;
  readonly setId: string;
  readonly setType: SetTypes;
}

const SetNameInput: React.FC<SetNameInputProps> = ({
  setName,
  setId,
  setType,
}: SetNameInputProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(setName);
  const inputRef = useRef<HTMLInputElement>();
  const dispatch = useCoreDispatch();
  const sets = useCoreSelector((state) => selectSetsByType(state, setType));
  const otherSets = Object.fromEntries(
    Object.entries(sets).filter(([id]) => id !== setId),
  );

  useEffect(() => {
    setValue(setName);
  }, [setName]);

  useEffect(() => {
    if (editing) {
      inputRef?.current.focus();
    }
  }, [editing]);

  return (
    <>
      <div
        data-testid="text-set-name"
        className={`flex flex-row gap-2 ${
          editing ? "items-start" : "items-center"
        }`}
      >
        {editing ? (
          <div className="flex flex-col">
            <div className="flex gap-2">
              <TextInput
                value={value}
                ref={inputRef}
                onChange={(e) => setValue(e.currentTarget.value)}
                error={
                  value.trim() === "" ? (
                    <ErrorMessage message="Please fill out this field." />
                  ) : undefined
                }
                maxLength={100}
                aria-label="Enter set name"
                data-testid="textbox-enter-set-name"
              />
              <ActionIcon
                onClick={() => {
                  setEditing(false);
                  setValue(setName);
                }}
                className="border-nci-red-darkest bg-nci-red-lighter rounded-[50%] mt-1"
                data-testid="button-close-set-name-input"
                aria-label="Close input"
              >
                <CloseIcon
                  className="text-nci-red-darkest"
                  aria-hidden="true"
                />
              </ActionIcon>
              <ActionIcon
                onClick={() => {
                  dispatch(
                    renameSet({ setId, setType, newSetName: value.trim() }),
                  );
                  setEditing(false);
                }}
                className="border-nci-green-darkest bg-nci-green-lighter rounded-[50%] mt-1"
                disabled={value.trim() === ""}
                data-testid="button-accept-set-name-input"
                aria-label="Rename set"
              >
                <CheckIcon
                  className="text-nci-green-darkest"
                  size={10}
                  aria-hidden="true"
                />
              </ActionIcon>
            </div>
            {Object.values(otherSets).includes(value.trim()) && (
              <div className="-mt-2">
                <WarningMessage message="A set with the same name already exists. This will overwrite it." />
              </div>
            )}
          </div>
        ) : (
          <>
            {setName}
            <ActionIcon
              onClick={() => setEditing(true)}
              variant="transparent"
              aria-label="Edit set name"
              data-testid="button-edit-set-name"
            >
              <EditIcon className="text-accent" aria-hidden="true" />
            </ActionIcon>
          </>
        )}
      </div>

      {value.length === 100 && editing && (
        <p className="text-sm pt-1">Maximum 100 characters</p>
      )}
    </>
  );
};

export default SetNameInput;
