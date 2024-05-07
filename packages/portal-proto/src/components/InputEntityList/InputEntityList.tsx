import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { MutationDefinition } from "@reduxjs/toolkit/dist/query";
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
  CreateSetValueArgs,
} from "@gff/core";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import { UserInputContext } from "@/components/Modals/UserInputModal";
import DiscardChangesButton from "@/components/Modals/DiscardChangesButton";
import ButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import { getMatchedIdentifiers, MatchResults } from "./utils";
import MatchTablesWrapper from "./MatchTablesWrapper";
import fieldConfig from "./fieldConfig";

export const MATCH_LIMIT = 50000;
const parseTokens = (input: string) => input.trim().split(/[\s,]+/);

interface InputEntityListProps {
  readonly inputInstructions: string;
  readonly identifierToolTip: React.ReactNode;
  readonly textInputPlaceholder: string;
  readonly entityType: SetTypes;
  readonly entityLabel: string;
  readonly hooks: {
    readonly updateFilters?: (field: string, op: Operation) => void;
    readonly createSet?: UseMutation<
      MutationDefinition<CreateSetValueArgs, any, any, any>
    >;
    readonly getExistingFilters?: () => FilterSet;
  };
  readonly RightButton: React.ElementType;
  readonly LeftButton?: React.ElementType;
}

const InputEntityList: React.FC<InputEntityListProps> = ({
  inputInstructions,
  identifierToolTip,
  textInputPlaceholder,
  entityType,
  entityLabel,
  hooks,
  RightButton,
  LeftButton,
}: InputEntityListProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [processingFile, setProcessingFile] = useState(false);
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState<string[]>([]);
  const [matched, setMatched] = useState<MatchResults[]>([]);
  const [isNotInitialized, setIsNotInitialized] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [screenReaderMessage, setScreenReaderMessage] = useState("");
  const [, setUserEnteredInput] = useContext(UserInputContext);
  const inputRef = useRef(null);
  const dispatch = useCoreDispatch();

  const resetState = () => {
    setInput("");
    setIsNotInitialized(true);
    setMatched([]);
    setFile(null);
    setScreenReaderMessage("");
    setTokens([]);
  };

  const {
    mappedToFields,
    matchAgainstIdentifiers,
    searchField,
    outputField,
    fieldDisplay,
    facetField,
  } = fieldConfig[entityType];

  const queryForMatchesDebounced = useMemo(
    () =>
      debounce((queryTokens: string[]) => {
        if (queryTokens.length > 0) {
          setIsNotInitialized(false);
          setIsFetching(true);

          const response = fetchGdcEntities(
            entityType,
            {
              filters: {
                op: "in",
                content: {
                  field: searchField,
                  value: uniq(queryTokens.map((t) => t.toLowerCase())),
                },
              },
              fields: [...mappedToFields, ...matchAgainstIdentifiers],
              size: 10000,
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
                queryTokens,
              ),
            );

            setIsFetching(false);
          });
        }

        setTokens(queryTokens);
      }, 1000),
    [
      mappedToFields,
      matchAgainstIdentifiers,
      outputField,
      searchField,
      entityType,
      setTokens,
    ],
  );

  const unmatched = useMemo(() => {
    const unmatchedTokens = new Set(tokens.map((t) => t.toUpperCase()));

    const matchedIds = new Set(
      flatten(
        matched.map((m) =>
          m.submittedIdentifiers.map((i) => i.value.toUpperCase()),
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
          <p className="mb-2 text-sm font-content">{inputInstructions}</p>
          <div className="flex items-center justify-between w-full">
            <label className="font-bold text-sm" htmlFor="identifier-input">
              Type or copy-and-paste a list of {entityLabel} identifiers
            </label>
            <Tooltip
              label={identifierToolTip}
              events={{ hover: true, focus: true, touch: false }}
              withArrow
              withinPortal={false}
            >
              <ActionIcon
                variant="subtle"
                aria-label="accepted identifier info"
              >
                <InfoIcon size={16} className="text-accent" />
              </ActionIcon>
            </Tooltip>
          </div>
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(event) => {
              setInput(event.currentTarget.value);
              const tokens = parseTokens(event.currentTarget.value);
              queryForMatchesDebounced(tokens);
            }}
            minRows={5}
            id="identifier-input"
            placeholder={textInputPlaceholder}
            error={
              matched.length > MATCH_LIMIT && entityType !== "cases"
                ? `Identifiers must not exceed ${MATCH_LIMIT.toLocaleString()} matched items.`
                : undefined
            }
            classNames={{
              input: "font-content",
            }}
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
                queryForMatchesDebounced(parseTokens(contents));
                setScreenReaderMessage("File successfully uploaded.");
                setProcessingFile(false);
              }
            }}
            leftSection={
              processingFile ? (
                <Loader size="xs" />
              ) : file !== null ? (
                <FileIcon className="text-accent" />
              ) : undefined
            }
            label={<b>Or choose a file to upload</b>}
            classNames={{
              root: "my-2",
              section: "pointer-events-none",
            }}
            accept=".tsv,.txt,.csv"
            rightSection={
              <DarkFunctionButton size="xs">Browse</DarkFunctionButton>
            }
            rightSectionWidth={80}
            aria-describedby="file-upload-screen-reader-msg"
            placeholder="Upload file"
          />
          <span className="sr-only" id="file-upload-screen-reader-msg">
            {screenReaderMessage}
          </span>
        </div>
        {isNotInitialized ? null : isFetching ? (
          <div className="flex h-32 items-center pl-4 gap-1 text-sm">
            <Loader size={12} />
            <p>validating {entityLabel}s</p>
          </div>
        ) : (
          <MatchTablesWrapper
            matched={matched}
            unmatched={unmatched}
            numberInput={tokens.length}
            entityLabel={entityLabel}
            fieldDisplay={fieldDisplay}
          />
        )}
      </div>
      <ButtonContainer data-testid="modal-button-container">
        {LeftButton && (
          <div className="mr-auto">
            <LeftButton
              disabled={matched.length === 0}
              ids={outputIds}
              hooks={hooks}
              facetField={facetField}
              setType={entityType}
            />
          </div>
        )}
        <DiscardChangesButton
          action={() => dispatch(hideModal())}
          label="Cancel"
          dark={false}
        />
        <DiscardChangesButton
          disabled={input === ""}
          action={resetState}
          label={"Clear"}
        />
        <RightButton
          disabled={matched.length === 0}
          ids={outputIds}
          hooks={hooks}
          facetField={facetField}
          setType={entityType}
        />
      </ButtonContainer>
    </>
  );
};

export default InputEntityList;
