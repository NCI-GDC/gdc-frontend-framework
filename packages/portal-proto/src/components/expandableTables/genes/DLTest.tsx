import React, { useEffect } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";

export const SOME_MAX_LIMIT = 9000;

interface DLTestProps {
  readonly dataHook: UseQuery<QueryDefinition<any, any, any, any, any>>;
  setDLStatus: (dl: boolean) => void;
}

const DLTest: React.FC<DLTestProps> = ({
  dataHook,
  setDLStatus,
}: DLTestProps) => {
  const { data, isLoading, isSuccess, isError } = dataHook(
    {
      // pageSize,
      // offset
      // geneIds [ "", "", ""]
      // filters
    },
    { pollingInterval: 180000 },
  );

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

export default DLTest;
