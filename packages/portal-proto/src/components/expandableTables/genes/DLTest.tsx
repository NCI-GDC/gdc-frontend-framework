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
      fields: [
        "genomic_dna_change",
        "mutation_subtype",
        "consequence.transcript.consequence_type",
        "consequence.transcript.annotation.vep_impact",
        "consequence.transcript.annotation.sift_impact",
        "consequence.transcript.annotation.polyphen_impact",
        "consequence.transcript.is_canonical",
        "consequence.transcript.gene.gene_id",
        "consequence.transcript.gene.symbol",
        "consequence.transcript.aa_change",
        "ssm_id",
      ],
      size: SOME_MAX_LIMIT,
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
