import React, { useEffect } from "react";
import { fetchedMutatedGenesJSON } from "../genes/query";
// import saveAs from "file-saver";

export const SOME_MAX_LIMIT = 9000;

interface DLProps {
  // UseQuery<QueryDefinition<any, any, any, any, any>>
  readonly dataHook: any;
  queryParams: any;
  headers?: string[];
  fileName: string;
  setDl: any;
}

const DL: React.FC<DLProps> = ({
  dataHook,
  queryParams,
  headers,
  fileName,
  setDl,
}: DLProps) => {
  // useEffect(() => {
  //   debugger;
  //   setDl("");
  // }, [isSuccess, headers]);

  useEffect(() => {
    dataHook(queryParams);
  }, []);

  return (
    <button onClick={() => console.log("data")}>
      <button onClick={() => console.log("data")}>data</button>
      <button onClick={() => setDl("")}>X</button>
    </button>
  );
};

export default DL;
