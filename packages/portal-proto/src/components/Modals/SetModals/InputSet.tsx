import React, { useEffect, useState, useRef } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  Textarea,
  FileInput,
  Tooltip,
  ActionIcon,
  Loader,
} from "@mantine/core";
import { flatten } from "lodash";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { MdInfo as InfoIcon } from "react-icons/md";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import SetModalButtons from "./SetModalButtons";
import { getMatchedIdentifiers } from "./utils";
import MatchTables from "./MatchTables";

export const MATCH_LIMIT = 50000;

interface InputSetProps {
  readonly inputInstructions: string;
  readonly identifierToolTip: React.ReactNode;
  readonly textInputPlaceholder: string;
  readonly identifier: string;
  readonly mappedToFields: string[];
  readonly matchAgainstIdentifiers: string[];
  readonly dataHook: UseQuery<any>;
  readonly searchField: string;
  readonly fieldDisplay: Record<string, string>;
}

const InputSet: React.FC<InputSetProps> = ({
  inputInstructions,
  identifierToolTip,
  textInputPlaceholder,
  identifier,
  mappedToFields,
  matchAgainstIdentifiers,
  dataHook,
  searchField,
  fieldDisplay,
}: InputSetProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [processingFile, setProcessingFile] = useState(false);
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState([]);
  const [screenReaderMessage, setScreenReaderMessage] = useState("");
  const inputRef = useRef(null);

  const { data, isFetching, isSuccess, isUninitialized } = dataHook({
    filters: {
      op: "in",
      content: {
        field: searchField,
        value: tokens,
      },
    },
    fields: [...mappedToFields, ...matchAgainstIdentifiers],
    size: MATCH_LIMIT,
  });

  const matched = isSuccess
    ? getMatchedIdentifiers(
        data,
        mappedToFields,
        matchAgainstIdentifiers,
        tokens,
      )
    : [];

  const matchedIds = flatten(
    matched.map((m) => m.givenIdentifiers.map((i) => i.value)),
  );
  const unmatched = tokens.filter((t) => !matchedIds.includes(t));

  useEffect(() => {
    setTokens(input.trim().split(/[\s,]+/));
  }, [input]);

  useEffect(() => {
    if (matched.length > MATCH_LIMIT) {
      setScreenReaderMessage(
        `${
          matched.length
        } matches found. A maximum of ${MATCH_LIMIT.toLocaleString()} ${identifier}s can be applied at one time.`,
      );

      inputRef.current.focus();
    }
  }, matched);

  return (
    <>
      <div className="px-4 max-h-[400px] overflow-y-auto">
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
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.currentTarget.value)}
          minRows={5}
          id="identifier-input"
          placeholder={textInputPlaceholder}
          error={
            matched.length > MATCH_LIMIT
              ? `Identifiers must not exceed ${MATCH_LIMIT.toLocaleString()} matched items.`
              : undefined
          }
        />
        <FileInput
          value={file}
          onChange={async (file) => {
            if (file !== null) {
              setProcessingFile(true);
              setFile(file);
              const contents = await file.text();
              setInput(contents);
              setScreenReaderMessage("File successfully uploaded.");
              setProcessingFile(false);
            }
          }}
          icon={
            processingFile ? (
              <Loader size="xs" />
            ) : file !== null ? (
              <FileIcon className="text-primary-darkest" />
            ) : undefined
          }
          label={<b>Or choose a file to upload</b>}
          classNames={{
            root: "my-2",
            rightSection: "pointer-events-none",
          }}
          accept=".tsv,.txt,.csv"
          rightSection={
            <DarkFunctionButton size="xs">Browse</DarkFunctionButton>
          }
          rightSectionWidth={80}
          aria-description={screenReaderMessage}
        />
        <MatchTables
          matched={matched}
          unmatched={unmatched}
          identifier={identifier}
          fieldDisplay={fieldDisplay}
        />
      </div>
      <SetModalButtons
        saveButtonDisabled
        clearButtonDisabled={input === ""}
        submitButtonDisabled
        onClearCallback={() => {
          setInput("");
          setFile(null);
        }}
      />
    </>
  );
};

export default InputSet;
