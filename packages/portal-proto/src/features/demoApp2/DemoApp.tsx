import {
  createGdcApp,
  useCoreSelector,
  GdcFile,
  useCoreDispatch,
  fetchFiles,
  selectFilesState,
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
      coreDispatch(fetchFiles());
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

export default createGdcApp({
  App: Demo,
  name: "Demonstration Application 2",
  version: "v1.0.0",
  requiredEntityTypes: ["file"],
});
