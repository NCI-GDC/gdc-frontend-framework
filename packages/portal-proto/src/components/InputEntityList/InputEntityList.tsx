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
import { getMatchedIdentifiers, MatchResults } from "./utils";
import MatchTablesWrapper from "./MatchTablesWrapper";
import fieldConfig from "./fieldConfig";
import { FileIcon, InfoIcon } from "@/utils/icons";
import { useDebouncedCallback } from "@mantine/hooks";

export const MATCH_LIMIT = 50000;

const REACHED_LIMIT_WARNING =
  "Your data contains the maximum of 50,000 identifiers. Only 50,000 identifiers can be processed.";
const EXCEED_LIMIT_ERROR =
  "Your data exceeds the maximum of 50,000 identifiers. Only the first 50,000 will be processed.";

const parseTokens = (input: string) =>
  input
    .trim()
    .split(/[\s,]+/)
    .filter((t) => t !== "");

interface State {
  input: string;
  tokens: string[];
  matched: MatchResults[];
  file: File | null;
  isFetching: boolean;
  isProcessingFile: boolean;
  limitError: string | null;
  validationError: string | null;
  statusMessage: string;
  isNotInitialized: boolean;
}

type Action =
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_TOKENS"; payload: string[] }
  | { type: "SET_MATCHED"; payload: MatchResults[] }
  | { type: "SET_FILE"; payload: File | null }
  | { type: "START_FETCH" }
  | { type: "END_FETCH" }
  | { type: "START_FILE_PROCESSING" }
  | { type: "END_FILE_PROCESSING" }
  | { type: "SET_LIMIT_ERROR"; payload: string | null }
  | { type: "SET_VALIDATION_ERROR"; payload: string | null }
  | { type: "RESET" };

const initialState: State = {
  input: "",
  tokens: [],
  matched: [],
  file: null,
  isFetching: false,
  isProcessingFile: false,
  limitError: null,
  validationError: null,
  statusMessage: "",
  isNotInitialized: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload };
    case "SET_TOKENS":
      return { ...state, tokens: action.payload };
    case "SET_MATCHED":
      return { ...state, matched: action.payload };
    case "SET_FILE":
      return { ...state, file: action.payload };
    case "START_FETCH":
      return {
        ...state,
        isFetching: true,
        isNotInitialized: false,
        statusMessage: "Validating input. This may take a few moments.",
        validationError: null,
      };
    case "END_FETCH":
      return {
        ...state,
        isFetching: false,
        isNotInitialized: false,
        statusMessage: "",
      };
    case "START_FILE_PROCESSING":
      return {
        ...state,
        isProcessingFile: true,
        validationError: null,
        limitError: null,
      };
    case "END_FILE_PROCESSING":
      return {
        ...state,
        isProcessingFile: false,
      };
    case "SET_LIMIT_ERROR":
      return { ...state, limitError: action.payload };
    case "SET_VALIDATION_ERROR":
      return { ...state, validationError: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

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
  const [state, dispatch] = useReducer(reducer, initialState);
  const [, setUserEnteredInput] = useContext(UserInputContext);
  const inputRef = useRef(null);
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

  const procesInput = useCallback(
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

  const processInputDebounced = useDebouncedCallback(procesInput, 1000);

  const handleInputChange = useCallback(
    (rawInput: string) => {
      dispatch({ type: "SET_INPUT", payload: rawInput });
      processInputDebounced(rawInput);
    },
    [processInputDebounced],
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

      procesInput(contents);
    },
    [procesInput],
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
              onKeyDown={(event) => {
                if (state.tokens.length >= MATCH_LIMIT) {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                    "Home",
                    "End",
                    "Tab",
                  ];

                  const isKeyCombo =
                    event.ctrlKey || event.metaKey || event.altKey;

                  if (!allowedKeys.includes(event.key) && !isKeyCombo) {
                    event.preventDefault();
                  }
                }
              }}
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
              numberInput={state.tokens.length}
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
