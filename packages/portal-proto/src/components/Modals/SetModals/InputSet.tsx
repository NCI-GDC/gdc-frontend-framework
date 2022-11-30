import React, { useState } from "react";
import { Textarea, FileInput, Tooltip, ActionIcon } from "@mantine/core";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { MdInfo as InfoIcon } from "react-icons/md";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

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
      <p className="mb-2">{inputInstructions}</p>
      <div className="flex items-center justify-between w-full">
        <label className="font-bold text-sm" htmlFor="indentifier-input">
          Type or copy-and-paste a list of {identifier} identifiers
        </label>
        <Tooltip label={identifierToolTip}>
          <ActionIcon>
            <InfoIcon size={16} className="text-primary-darkest" />
          </ActionIcon>
        </Tooltip>
      </div>
      <Textarea
        minRows={5}
        classNames={{ label: "w-full" }}
        id="identifier-input"
        placeholder={textInputPlaceholder}
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
        rightSection={<label>Browse</label>}
        rightSectionWidth={80}
        className="mt-2"
        accept=".tsv,.txt,.csv"
      ></FileInput>
    </>
  );
};

export default InputSet;
