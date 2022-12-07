import React, { useEffect, useState, useRef, useMemo } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
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
  readonly entity: string;
  readonly mappedToFields: string[];
  readonly matchAgainstIdentifiers: string[];
  readonly dataHook: UseQuery<QueryDefinition<any, any, any, any, any>>;
  readonly searchField: string;
  readonly fieldDisplay: Record<string, string>;
}

const InputSet: React.FC<InputSetProps> = ({
  inputInstructions,
  identifierToolTip,
  textInputPlaceholder,
  entity,
  mappedToFields,
  matchAgainstIdentifiers,
  dataHook,
  searchField,
  fieldDisplay,
}: InputSetProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [processingFile, setProcessingFile] = useState(false);
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [screenReaderMessage, setScreenReaderMessage] = useState("");
  const inputRef = useRef(null);

  const { data, isSuccess } = dataHook({
    filters: {
      op: "in",
      content: {
        field: searchField,
        value: tokens.map((t) => t.toLowerCase()),
      },
    },
    fields: [...mappedToFields, ...matchAgainstIdentifiers],
    size: MATCH_LIMIT,
  });

  const matched = useMemo(
    () =>
      isSuccess
        ? getMatchedIdentifiers(
            data,
            mappedToFields,
            matchAgainstIdentifiers,
            tokens,
          )
        : [],
    [data, mappedToFields, matchAgainstIdentifiers, tokens, isSuccess],
  );

  const matchedIds = flatten(
    matched.map((m) => m.givenIdentifiers.map((i) => i.value)),
  ).map((id) => id.toLowerCase());
  const unmatched = tokens.filter((t) => !matchedIds.includes(t.toLowerCase()));

  useEffect(() => {
    if (input !== "") {
      setTokens(input.trim().split(/[\s,]+/));
    }
  }, [input]);

  useEffect(() => {
    if (matched.length > MATCH_LIMIT) {
      setScreenReaderMessage(
        `${
          matched.length
        } matches found. A maximum of ${MATCH_LIMIT.toLocaleString()} ${entity}s can be applied at one time.`,
      );

      inputRef.current.focus();
    }
  }, [matched, entity]);

  return (
    <>
      <div className="max-h-[550px] overflow-y-auto">
        <div className="px-4">
          <p className="mb-2 text-sm">{inputInstructions}</p>
          <div className="flex items-center justify-between w-full">
            <label className="font-bold text-sm" htmlFor="indentifier-input">
              Type or copy-and-paste a list of {entity} identifiers
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
            aria-details={screenReaderMessage}
          />
        </div>
        {(matched.length > 0 || unmatched.length > 0) && (
          <MatchTables
            matched={matched}
            unmatched={unmatched}
            entity={entity}
            fieldDisplay={fieldDisplay}
          />
        )}
      </div>
      <SetModalButtons
        saveButtonDisabled
        clearButtonDisabled={input === ""}
        submitButtonDisabled
        onClearCallback={() => {
          setInput("");
          setFile(null);
          setScreenReaderMessage("");
          setTokens([]);
        }}
      />
    </>
  );
};

export default InputSet;
