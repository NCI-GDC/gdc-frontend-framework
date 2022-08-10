import React, { useEffect } from "react";
import { useGetProjectDocCountsByGeneQuery } from "@gff/core/src/features/rtkgraphql/projectCasesByGeneSlice";

export const SubTableRow = ({ geneId }) => {
  const data = useGetProjectDocCountsByGeneQuery(geneId);

  useEffect(() => {
    console.log("useGetProjectDocCountsByGeneQuery data:", data);
  }, [data]);

  return <div className={`flex flex-row w-full bg-red-200`}>{geneId}</div>;
};
