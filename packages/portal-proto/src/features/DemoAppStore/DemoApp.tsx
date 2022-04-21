import {
  createAppStore,
  createGdcAppWithOwnStore,
  useCoreSelector,
  GdcFile,
  useCoreDispatch,
  fetchFiles,
  selectFilesState,
  survivalReducer,
  AppDataSelectorResponse,
  Survival,
  SurvivalState,
} from "@gff/core";
import { useEffect } from "react";

interface UseFetchFilesResponse {
  readonly data?: ReadonlyArray<GdcFile>;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const useFetchFiles = (): UseFetchFilesResponse => {
  const coreDispatch = useCoreDispatch();
  const filesState = useCoreSelector(selectFilesState);

  useEffect(() => {
    if (!filesState.files) {
      coreDispatch(fetchFiles({}));
    }
  }, [coreDispatch, filesState.files]);

  return {
    data: filesState.files,
    error: filesState.error,
    isUninitialized: filesState.files === undefined,
    isFetching: filesState.status === "pending",
    isSuccess: filesState.status === "fulfilled",
    isError: filesState.status === "rejected",
  };
};

const { store, context } = createAppStore({
  name: "Demonstration Application w/ Store",
  version: "v1.0.0",
  reducers: { survival: survivalReducer },
});

type AppState = ReturnType<typeof store.getState>;

export const selectSurvivalState = (state: AppState): SurvivalState =>
  state.survival;

export const selectSurvival = (state: AppState): ReadonlyArray<Survival> => {
  return state.survival.survivalData;
};

export const selectSurvivalData = (
  state: AppState,
): AppDataSelectorResponse<ReadonlyArray<Survival>> => {
  return {
    data: state.survival.survivalData,
    status: state.survival.status,
    error: state.survival.error,
  };
};

const Demo: React.FC = () => {
  const { data, error, isUninitialized, isFetching, isError } = useFetchFiles();

  if (isUninitialized) {
    return <div>Initializing files...</div>;
  }

  if (isFetching) {
    return <div>Fetching files...</div>;
  }

  if (isError) {
    return <div>Failed to fetch files: {error}</div>;
  }

  return (
    <div>
      This demo app lists files:
      {data.map((file) => (
        <div key={file.id}>{file.fileName}</div>
      ))}
    </div>
  );
};

export default createGdcAppWithOwnStore({
  store: store,
  context: context,
  App: Demo,
  name: "Demonstration Application w/ Store",
  version: "v1.0.0",
  requiredEntityTypes: ["genes"],
});
