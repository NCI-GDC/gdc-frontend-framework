import { InputEntityListAction, InputEntityListState } from "./type";

export const initialState: InputEntityListState = {
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

export function inputEntityListReducer(
  state: InputEntityListState,
  action: InputEntityListAction,
): InputEntityListState {
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
