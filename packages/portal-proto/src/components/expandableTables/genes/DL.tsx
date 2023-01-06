import React, { useEffect } from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { QueryDefinition } from "@reduxjs/toolkit/dist/query";

export const SOME_MAX_LIMIT = 9000;

interface DLProps {
  readonly dataHook: UseQuery<QueryDefinition<any, any, any, any, any>>;
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
  const { data, isLoading, isSuccess, isError } = dataHook(queryParams, {
    pollingInterval: 180000,
  });

  useEffect(() => {
    // const headers = [
    //   "Symbol",
    //   "Name",
    //   "# SSM Affected Cases in Cohort",
    //   "# SSM Affected Cases Across the GDC",
    //   "# CNV Gain",
    //   "# CNV Loss",
    //   "# Mutations",
    //   "Annotations",
    //   "Survival"
    // ]

    // todo: add this to transform response

    // const body = dataFromHook
    //   .map({
    //   symbol,
    //   name,
    //   numCases,
    //   filteredCases,
    //   ssm_case,
    //   cases,
    //   cnvCases,
    //   case_cnv_gain,
    //   case_cnv_loss,
    //   mutationCounts,
    //   gene_id
    //   is_cancer_gene_census
    //  }) =>
    //     [
    //       symbol,
    //       name,
    //       `{ numCases } / { filteredCases } ( ... )`,
    //       `{ ssm_case } / { cases } ( ... )`,
    //       cnvCases > 0 ? `${case_cnv_gain.toLocaleString()} / ${cnvCases.toLocaleString()}
    //       (${((100 * case_cnv_gain) / cnvCases).toFixed(2)}%)`,
    //       : `--`,
    //       cnvCases > 0 ? `${case_cnv_loss.toLocaleString()} / ${cnvCases.toLocaleString()}
    //       (${((100 * case_cnv_loss) / cnvCases).toFixed(2)}%)`
    //       : `--`,
    //       mutationCounts[gene_id],
    //       is_cancer_genus,
    //       "add to survival plot" ?
    //     ].join("\t"),
    //   )
    //   .join("\n");

    // body -> data

    // const tsv = [header.join("\t"), data].join("\n");
    // const blob = new Blob([tsv], { type: "text/csv" });

    // saveAs(blob, fileName);
    debugger;
    setDl("");
  }, [isSuccess, headers]);

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
          <button onClick={() => setDl("")}>X</button>
        </>
      )}
    </button>
  );
};

export default DL;
