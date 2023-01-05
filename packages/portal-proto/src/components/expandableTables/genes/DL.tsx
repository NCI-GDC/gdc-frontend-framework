import React, { useEffect } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";

export const SOME_MAX_LIMIT = 9000;

interface DLProps {
  readonly dataHook: UseQuery<QueryDefinition<any, any, any, any, any>>;
  queryParams: any;
  extension: string;
  setDLStatus: any;
}

const DL: React.FC<DLProps> = ({
  dataHook,
  queryParams,
  extension,
  setDLStatus,
}: DLProps) => {
  const { data, isLoading, isSuccess, isError } = dataHook(queryParams, {
    pollingInterval: 180000,
  });

  useEffect(() => {
    // const date = new Date() -> YYYY, MM, and DD: current date
    // data -> download
    // const blob = new Blob(download, extension)
    // ...
    // ...
    // setDLStatus(false);
  }, [isSuccess]);

  if (isError) {
    return <span>error</span>;
  }

  return (
    <button onClick={() => console.log("data", data)}>
      {isLoading ? (
        "download in progress"
      ) : (
        <>
          <button onClick={() => console.log("data", data)}>data</button>
          <button onClick={() => setDLStatus(false)}>X</button>
        </>
      )}
    </button>
  );
};

export default DL;
