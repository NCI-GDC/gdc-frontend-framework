import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  Textarea,
  FileInput,
  Tooltip,
  ActionIcon,
  Loader,
} from "@mantine/core";
import { flatten, debounce, uniq } from "lodash";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { MdInfo as InfoIcon } from "react-icons/md";
import {
  SetTypes,
  useCoreDispatch,
  hideModal,
  Operation,
  FilterSet,
  fetchGdcEntities,
} from "@gff/core";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import { UserInputContext } from "@/components/Modals/UserInputModal";
import DiscardChangesButton from "@/components/Modals/DiscardChangesButton";
import ButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import { getMatchedIdentifiers, MatchResults } from "./utils";
import MatchTables from "./MatchTables";
import SaveSetButton from "./SaveSetButton";
import fieldConfig from "./fieldConfig";

export const MATCH_LIMIT = 50000;

interface InputEntityListProps {
  readonly inputInstructions: string;
  readonly identifierToolTip: React.ReactNode;
  readonly textInputPlaceholder: string;
  readonly entityType: SetTypes;
  readonly entityLabel: string;
  readonly hooks: {
    readonly updateFilters?: (field: string, op: Operation) => void;
    readonly createSet?: UseMutation<any>;
    readonly getExistingFilters?: () => FilterSet;
  };
  readonly SubmitButton: React.ElementType;
}

const InputEntityList: React.FC<InputEntityListProps> = ({
  inputInstructions,
  identifierToolTip,
  textInputPlaceholder,
  entityType,
  entityLabel,
  hooks,
  SubmitButton,
}: InputEntityListProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [processingFile, setProcessingFile] = useState(false);
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [matched, setMatched] = useState<MatchResults[]>([]);
  const [isUnintialized, setIsUnitialized] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [screenReaderMessage, setScreenReaderMessage] = useState("");
  const [, setUserEnteredInput] = useContext(UserInputContext);
  const inputRef = useRef(null);
  const dispatch = useCoreDispatch();

  const setTokensDebounced = debounce(
    (input) => setTokens(input.trim().split(/[\s,]+/)),
    500,
  );

  const {
    mappedToFields,
    matchAgainstIdentifiers,
    searchField,
    outputField,
    fieldDisplay,
    facetField,
  } = fieldConfig[entityType];

  useEffect(() => {
    if (tokens.length > 0) {
      setIsUnitialized(false);
      setIsFetching(true);

      const response = fetchGdcEntities(
        entityType,
        {
          filters: {
            op: "in",
            content: {
              field: searchField,
              value: uniq(tokens.map((t) => t.toLowerCase())),
            },
          },
          fields: [...mappedToFields, ...matchAgainstIdentifiers],
        },
        true,
      );

      response.then((data) => {
        setMatched(
          getMatchedIdentifiers(
            data.data.hits,
            mappedToFields,
            matchAgainstIdentifiers,
            outputField,
            tokens,
          ),
        );

        setIsFetching(false);
      });
    }
  }, [
    tokens,
    mappedToFields,
    matchAgainstIdentifiers,
    outputField,
    searchField,
    entityType,
  ]);

  const unmatched = useMemo(() => {
    const unmatchedTokens = new Set(tokens.map((t) => t.toUpperCase()));

    const matchedIds = new Set(
      flatten(
        matched.map((m) =>
          m.givenIdentifiers.map((i) => i.value.toUpperCase()),
        ),
      ),
    );

    for (const id of matchedIds) {
      unmatchedTokens.delete(id);
    }

    return Array.from(unmatchedTokens);
  }, [tokens, matched]);

  const outputIds = useMemo(
    () =>
      matched
        .map(
          (match) => match.output.find((m) => m.field === outputField)?.value,
        )
        .filter((match) => match !== null),
    [matched, outputField],
  );

  useEffect(() => {
    setUserEnteredInput(false);
    // on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (input !== "" || file !== null) {
      setUserEnteredInput(true);
    } else {
      setUserEnteredInput(false);
    }
  }, [file, input, setUserEnteredInput]);

  useEffect(() => {
    if (matched.length > MATCH_LIMIT && entityType !== "cases") {
      setScreenReaderMessage(
        `${
          matched.length
        } matches found. A maximum of ${MATCH_LIMIT.toLocaleString()} ${entityLabel}s can be applied at one time.`,
      );

      inputRef.current.focus();
    }
  }, [matched, entityLabel, entityType]);

  return (
    <>
      <div className="max-h-96 overflow-y-auto">
        <div className="px-4">
          <p className="mb-2 text-sm">{inputInstructions}</p>
          <div className="flex items-center justify-between w-full">
            <label className="font-bold text-sm" htmlFor="indentifier-input">
              Type or copy-and-paste a list of {entityLabel} identifiers
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
            onChange={(event) => {
              setInput(event.currentTarget.value);
              setTokensDebounced(event.currentTarget.value);
            }}
            minRows={5}
            id="identifier-input"
            placeholder={textInputPlaceholder}
            error={
              matched.length > MATCH_LIMIT && entityType !== "cases"
                ? `Identifiers must not exceed ${MATCH_LIMIT.toLocaleString()} matched items.`
                : undefined
            }
            spellCheck={false}
            autoComplete={"off"}
          />
          <FileInput
            value={file}
            onChange={async (file) => {
              if (file !== null) {
                setProcessingFile(true);
                setFile(file);
                const contents = await file.text();
                setInput(contents);
                setTokens(contents.trim().split(/[\s,]+/));
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
        {isUnintialized ? null : isFetching ? (
          <div className="flex items-center pl-4 gap-1 text-sm">
            <Loader size={12} />
            <p>validating {entityLabel}s</p>
          </div>
        ) : (
          <MatchTables
            matched={matched}
            unmatched={unmatched}
            numberInput={tokens.length}
            entityLabel={entityLabel}
            fieldDisplay={fieldDisplay}
          />
        )}
      </div>
      <ButtonContainer>
        {hooks.createSet && (
          <SaveSetButton
            disabled={matched.length === 0}
            setValues={outputIds}
            setType={entityType}
            createSetHook={hooks.createSet}
          />
        )}
        <DiscardChangesButton
          action={() => dispatch(hideModal())}
          label="Cancel"
          dark={false}
        />
        <DiscardChangesButton
          disabled={input === ""}
          action={() => {
            setInput("");
            setFile(null);
            setScreenReaderMessage("");
            setTokens([]);
          }}
          label={"Clear"}
        />
        <SubmitButton
          ids={outputIds}
          disabled={matched.length === 0}
          hooks={hooks}
          facetField={facetField}
        />
      </ButtonContainer>
    </>
  );
};

export default InputEntityList;
