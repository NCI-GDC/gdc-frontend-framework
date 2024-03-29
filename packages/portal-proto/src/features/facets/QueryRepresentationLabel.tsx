import React from "react";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import {
  fieldNameToTitle,
  useCoreSelector,
  selectSetsByType,
  SetTypes,
} from "@gff/core";

interface QueryRepresentationLabelProps {
  readonly field: string;
  readonly value: string;
  readonly geneSymbolDict: Record<string, string>;
  readonly geneSymbolSuccess: boolean;
  readonly countHook: UseQuery<any>;
}

const QueryRepresentationLabel: React.FC<QueryRepresentationLabelProps> = ({
  field,
  value,
  geneSymbolDict,
  geneSymbolSuccess,
  countHook,
}: QueryRepresentationLabelProps) => {
  let label: string;
  const [docType] = field.split(".");
  const sets = useCoreSelector((state) =>
    selectSetsByType(state, docType as SetTypes),
  );
  if (value.includes("set_id:")) {
    const setId = value.split(":")[1];

    const setName = sets?.[setId];

    const { data, isSuccess } = countHook({ setId });
    label =
      setName !== undefined
        ? setName
        : isSuccess
        ? `${data.toLocaleString()} input ${
            field === "genes.gene_id" ? "gene" : fieldNameToTitle(field)
          }s`.toLowerCase()
        : "...";
  } else {
    if (field === "genes.gene_id") {
      label = geneSymbolSuccess ? geneSymbolDict[value] ?? "..." : "...";
    } else {
      label = value;
    }
  }
  return <>{label}</>;
};

export default QueryRepresentationLabel;
