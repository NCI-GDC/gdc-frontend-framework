import React, { useState } from "react";
import { Textarea, FileInput, Tooltip, ActionIcon } from "@mantine/core";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { MdInfo as InfoIcon } from "react-icons/md";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import SetModalButtons from "./SetModalButtons";

interface InputSetProps {
  readonly inputInstructions: string;
  readonly identifierToolTip: React.ReactNode;
  readonly textInputPlaceholder: string;
  readonly identifier: string;
}

const InputSet: React.FC<InputSetProps> = ({
  inputInstructions,
  identifierToolTip,
  textInputPlaceholder,
  identifier,
}: InputSetProps) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <div className="px-4">
        <p className="mb-2 text-sm">{inputInstructions}</p>
        <div className="flex items-center justify-between w-full">
          <label className="font-bold text-sm" htmlFor="indentifier-input">
            Type or copy-and-paste a list of {identifier} identifiers
          </label>
          <Tooltip
            label={identifierToolTip}
            events={{ hover: true, focus: true, touch: false }}
            withArrow
          >
            <ActionIcon aria-label="accepted identifier info">
              <InfoIcon size={16} className="text-primary-darkest" />
            </ActionIcon>
          </Tooltip>
        </div>
        <Textarea
          minRows={5}
          classNames={{ label: "w-full" }}
          id="identifier-input"
          placeholder={textInputPlaceholder}
          disabled
        />
        <FileInput
          value={file}
          onChange={setFile}
          icon={
            file !== null ? (
              <FileIcon className="text-primary-darkest" />
            ) : undefined
          }
          label={<b>Or choose a file to upload</b>}
          classNames={{
            root: "mt-2",
            rightSection: "pointer-events-none",
          }}
          accept=".tsv,.txt,.csv"
          rightSection={
            <DarkFunctionButton size="xs">Browse</DarkFunctionButton>
          }
          rightSectionWidth={80}
          disabled
        ></FileInput>
      </div>
      <SetModalButtons
        saveButtonDisabled
        clearButtonDisabled
        submitButtonDisabled
      />
    </>
  );
};

export default InputSet;
