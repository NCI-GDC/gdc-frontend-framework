interface Match {
  readonly field: string;
  readonly value: string;
}

export interface MatchResults {
  readonly submittedIdentifiers: Match[];
  readonly mappedTo: Match[];
  readonly output: Match[];
}

export interface InputEntityListState {
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

export type InputEntityListAction =
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
