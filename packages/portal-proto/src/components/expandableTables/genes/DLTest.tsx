import React, { useEffect } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";

interface DLTestProps {
  readonly dataHook: UseQuery<QueryDefinition<any, any, any, any, any>>;
  readonly total: number;
}

const DLTest: React.FC<DLTestProps> = ({ dataHook, total }: DLTestProps) => {
  const { data, isLoading, isSuccess } = dataHook({
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
    size: total,
  });
  // pending for over minute

  if (isLoading) {
    return <>loading</>;
  }

  return <button onClick={() => console.log("data", data)}>data</button>;
};

export default DLTest;
