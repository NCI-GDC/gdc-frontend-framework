import React, { useEffect } from "react";
import { useDownloadData } from "@gff/core";
// import { fetchedMutatedGenesJSON } from
// import saveAs from "file-saver";

export const SOME_MAX_LIMIT = 9000;

interface DLProps {
  // UseQuery<QueryDefinition<any, any, any, any, any>>
  // readonly dataHook: any;
  queryParams: any;
  headers?: string[];
  fileName: string;
  setDl: any;
}

const DL: React.FC<DLProps> = ({
  // dataHook,
  queryParams,
  headers,
  fileName,
  setDl,
}: DLProps) => {
  const { data } = useDownloadData({ queryParams });
  // useEffect(() => {
  //   debugger;
  //   setDl("");
  // }, [isSuccess, headers]);

  // useEffect(() => {
  //  console.log('results', results);
  // }, [results]);

  return (
    <>
      {data && <button onClick={() => console.log("data,", data)}>data</button>}
      <button onClick={() => setDl("")}>X</button>
    </>
  );
};

export default DL;
