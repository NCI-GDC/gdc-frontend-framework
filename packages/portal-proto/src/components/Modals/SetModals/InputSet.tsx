import React, { useState } from "react";
import { Textarea, FileInput, Tooltip } from "@mantine/core";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { MdInfo as InfoIcon } from "react-icons/md";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface InputSetProps {
  readonly inputInstructions: string;
  readonly identifierToolTip: React.ReactNode;
  readonly textInputPlaceholder: string;
}

const InputSet: React.FC<InputSetProps> = ({
  inputInstructions,
  identifierToolTip,
  textInputPlaceholder,
}: InputSetProps) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <p className="mb-2">{inputInstructions}</p>
      <div className="flex items-center justify-between w-full">
        <label className="font-bold" htmlFor="indentifier-input">
          Type or copy-and-paste a list of mutation identifiers
        </label>
        <Tooltip label={identifierToolTip}>
          <div>
            <InfoIcon size={16} className="text-primary-darkest" />
          </div>
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
        icon={file !== null ? <FileIcon /> : undefined}
        label={<b>Or choose a file to upload</b>}
        rightSection={<DarkFunctionButton size="xs">Browse</DarkFunctionButton>}
        rightSectionWidth={80}
        className="mt-2"
        accept=".tsv,.txt,.csv"
      ></FileInput>
    </>
  );
};

export default InputSet;
