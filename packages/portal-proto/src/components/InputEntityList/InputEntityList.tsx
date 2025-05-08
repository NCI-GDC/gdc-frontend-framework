import React, {
  useEffect,
  useRef,
  useMemo,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  Textarea,
  FileInput,
  Tooltip,
  ActionIcon,
  Loader,
  LoadingOverlay,
} from "@mantine/core";
import { flatten, uniq } from "lodash";
import {
  SetTypes,
  useCoreDispatch,
  hideModal,
  Operation,
  FilterSet,
  fetchGdcEntities,
  useCreateCaseSetFromValuesMutation,
} from "@gff/core";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import { UserInputContext } from "@/components/Modals/UserInputModal";
import DiscardChangesButton from "@/components/Modals/DiscardChangesButton";
import ButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import {
  EXCEED_LIMIT_ERROR,
  getMatchedIdentifiers,
  MATCH_LIMIT,
  parseTokens,
  REACHED_LIMIT_WARNING,
} from "./utils";
import MatchTablesWrapper from "./MatchTablesWrapper";
import fieldConfig from "./fieldConfig";
import { FileIcon, InfoIcon } from "@/utils/icons";
import { useDebouncedCallback } from "@mantine/hooks";
import { initialState, inputEntityListReducer } from "./InputEntityListReducer";

interface InputEntityListProps {
  readonly inputInstructions: string;
  readonly identifierToolTip: React.ReactNode;
  readonly textInputPlaceholder: string;
  readonly entityType: SetTypes;
  readonly entityLabel: string;
  readonly hooks: {
    readonly updateFilters?: (field: string, op: Operation) => void;
    readonly createSet?: typeof useCreateCaseSetFromValuesMutation;
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
  const [state, dispatch] = useReducer(inputEntityListReducer, initialState);
  const [, setUserEnteredInput] = useContext(UserInputContext);
  const inputRef = useRef(null);
  const resetFileInputRef = useRef(null);
  const lastValidatedTokensRef = useRef<Set<string>>(new Set<string>());
  const coreDispatch = useCoreDispatch();

  const {
    mappedToFields,
    matchAgainstIdentifiers,
    searchField,
    outputField,
    fieldDisplay,
    facetField,
  } = fieldConfig[entityType];

  const processTokens = useCallback(
    (tokens: string[]): [string[], string | null] => {
      if (tokens.length > MATCH_LIMIT) {
        const truncatedTokens = tokens.slice(0, MATCH_LIMIT);
        return [truncatedTokens, EXCEED_LIMIT_ERROR];
      } else if (tokens.length === MATCH_LIMIT) {
        return [tokens, REACHED_LIMIT_WARNING];
      }
      return [tokens, null];
    },
    [],
  );

  const validateTokens = useCallback(
    async (tokensToValidate: string[]) => {
      if (tokensToValidate.length === 0) {
        dispatch({ type: "SET_MATCHED", payload: [] });
        dispatch({ type: "END_FETCH" });
        lastValidatedTokensRef.current = new Set();
        return;
      }

      const uniqueNewTokens = new Set(tokensToValidate);
      const isSameTokenSetSize =
        lastValidatedTokensRef.current.size === uniqueNewTokens.size;

      if (isSameTokenSetSize) {
        let hasChanged = false;
        for (const prevToken of lastValidatedTokensRef.current) {
          if (!uniqueNewTokens.has(prevToken)) {
            hasChanged = true;
            break;
          }
        }

        if (!hasChanged) {
          return;
        }
      }

      lastValidatedTokensRef.current = uniqueNewTokens;
      dispatch({ type: "START_FETCH" });

      try {
        const response = await fetchGdcEntities(
          entityType,
          {
            filters: {
              op: "in",
              content: {
                field: searchField,
                value: uniq(tokensToValidate.map((t) => t.toLowerCase())),
              },
            },
            fields: [...mappedToFields, ...matchAgainstIdentifiers],
            size: 10000,
          },
          true,
        );

        const matches = getMatchedIdentifiers(
          response.data.hits,
          mappedToFields,
          matchAgainstIdentifiers,
          outputField,
          tokensToValidate,
        );

        dispatch({ type: "SET_MATCHED", payload: matches });
      } catch {
        dispatch({
          type: "SET_VALIDATION_ERROR",
          payload:
            "Server error: unable to validate identifiers. Please try again later.",
        });
      } finally {
        dispatch({ type: "END_FETCH" });
      }
    },
    [
      entityType,
      mappedToFields,
      matchAgainstIdentifiers,
      outputField,
      searchField,
    ],
  );

  const processInput = useCallback(
    (rawInput: string) => {
      const newTokens = parseTokens(rawInput);
      const [processedTokens, limitMessage] = processTokens(newTokens);

      if (limitMessage === EXCEED_LIMIT_ERROR) {
        const truncatedContent = processedTokens.join("\n");
        dispatch({ type: "SET_INPUT", payload: truncatedContent });
      } else {
        dispatch({ type: "SET_INPUT", payload: rawInput });
      }

      dispatch({ type: "SET_TOKENS", payload: processedTokens });
      dispatch({ type: "SET_LIMIT_ERROR", payload: limitMessage });

      validateTokens(processedTokens);
    },
    [processTokens, validateTokens],
  );

  const processInputDebounced = useDebouncedCallback(processInput, 1000);

  const handleInputChange = useCallback(
    (rawInput: string) => {
      dispatch({ type: "SET_INPUT", payload: rawInput });
      processInputDebounced(rawInput);
    },
    [processInputDebounced],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (state.tokens.length >= MATCH_LIMIT) {
        // Keys that would add a new separator (and thus create a new token)
        const disallowedKeys = [" ", "Tab", ",", "Enter"];

        if (disallowedKeys.includes(event.key)) {
          event.preventDefault();
        }
      }
    },
    [state.tokens.length],
  );

  const handleFileChange = useCallback(
    async (file: File | null) => {
      dispatch({ type: "SET_FILE", payload: file });
      if (!file) return;

      dispatch({ type: "START_FILE_PROCESSING" });

      let contents: string;
      try {
        contents = await file.text();
      } catch {
        dispatch({
          type: "SET_VALIDATION_ERROR",
          payload:
            "Error processing file: please check your file and try again.",
        });
        // Re‐enable the input area so the user can correct and resubmit.
      }

      dispatch({ type: "END_FILE_PROCESSING" });

      if (resetFileInputRef.current) {
        setTimeout(() => {
          resetFileInputRef.current();
        }, 100);
      }
      processInput(contents);
    },
    [processInput],
  );

  const reset = () => {
    processInputDebounced.flush();
    dispatch({ type: "RESET" });
  };

  const unmatched = useMemo(() => {
    const unmatchedTokens = new Set(state.tokens.map((t) => t.toUpperCase()));

    const matchedIds = new Set(
      flatten(
        state.matched.map((m) =>
          m.submittedIdentifiers.map((i) => i.value.toUpperCase()),
        ),
      ),
    );

    for (const id of matchedIds) {
      unmatchedTokens.delete(id);
    }

    return Array.from(unmatchedTokens);
  }, [state.tokens, state.matched]);

  const outputIds = useMemo(
    () =>
      state.matched
        .map(
          (match) => match.output.find((m) => m.field === outputField)?.value,
        )
        .filter((match) => match !== null),
    [state.matched, outputField],
  );

  useEffect(() => {
    setUserEnteredInput(false);
    // on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.input !== "" || state.file !== null) {
      setUserEnteredInput(true);
    } else {
      setUserEnteredInput(false);
    }
  }, [state.file, state.input, setUserEnteredInput]);

  const displayError = state.validationError || state.limitError;

  return (
    <>
      <div className="max-h-96 overflow-y-auto">
        <div className="px-4">
          <p
            data-testid="text-input-instructions"
            className="mb-2 text-sm font-content"
          >
            {inputInstructions} There is a limit of{" "}
            {MATCH_LIMIT.toLocaleString()} identifiers.
          </p>
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
                data-testid="tooltip-accepted-identifier-info"
                variant="subtle"
                aria-label="accepted identifier info"
              >
                <InfoIcon size={16} className="text-accent" />
              </ActionIcon>
            </Tooltip>
          </div>
          <div className="relative">
            <LoadingOverlay visible={state.isFetching} />
            <Textarea
              data-testid="textbox-enter-identifiers"
              ref={inputRef}
              value={state.input}
              onChange={(event) => {
                handleInputChange(event.target.value);
              }}
              onKeyDown={handleKeyDown}
              minRows={5}
              maxRows={5}
              id="identifier-input"
              placeholder={textInputPlaceholder}
              error={displayError}
              classNames={{
                input: "font-content text-black h-32",
              }}
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <FileInput
            value={state.file}
            onChange={handleFileChange}
            resetRef={resetFileInputRef}
            leftSection={
              state.isProcessingFile ? (
                <Loader size="xs" />
              ) : state.file !== null ? (
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
              <DarkFunctionButton data-testid="button-browse" size="xs">
                Browse
              </DarkFunctionButton>
            }
            rightSectionWidth={80}
            aria-describedby="file-upload-screen-reader-msg"
            placeholder="Upload file"
            disabled={state.isFetching}
          />
        </div>

        <div
          className="sr-only"
          aria-live="polite"
          data-testid="file-upload-screen-reader-msg"
        >
          {state.statusMessage}
        </div>

        {state.isNotInitialized ? null : state.isFetching ? (
          <div className="flex h-32 items-center pl-4 gap-1 text-sm">
            <Loader size={12} />
            <p>{state.statusMessage}</p>
          </div>
        ) : (
          (state.matched.length > 0 || unmatched.length > 0) && (
            <MatchTablesWrapper
              matched={state.matched}
              unmatched={unmatched}
              numberInput={new Set(state.tokens).size}
              entityLabel={entityLabel}
              fieldDisplay={fieldDisplay}
            />
          )
        )}
      </div>
      <ButtonContainer data-testid="modal-button-container">
        {LeftButton && (
          <div className="mr-auto">
            <LeftButton
              disabled={state.matched.length === 0}
              ids={outputIds}
              hooks={hooks}
              facetField={facetField}
              setType={entityType}
            />
          </div>
        )}
        <DiscardChangesButton
          customDataTestID="button-cancel"
          action={() => coreDispatch(hideModal())}
          label="Cancel"
          dark={false}
        />
        <DiscardChangesButton
          customDataTestID="button-clear"
          disabled={state.input === ""}
          action={reset}
          label={"Clear"}
        />
        <RightButton
          disabled={state.matched.length === 0}
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
