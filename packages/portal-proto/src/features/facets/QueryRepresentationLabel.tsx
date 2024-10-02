import React, { Dispatch, SetStateAction } from "react";
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
  readonly useCountHook: UseQuery<any>;
  readonly setLabel?: Dispatch<SetStateAction<string>>;
}

const QueryRepresentationLabel: React.FC<QueryRepresentationLabelProps> = ({
  field,
  value,
  geneSymbolDict,
  geneSymbolSuccess,
  useCountHook,
  setLabel,
}: QueryRepresentationLabelProps) => {
  let label: string;
  const [docType] = field.split(".");
  const sets = useCoreSelector((state) =>
    selectSetsByType(state, docType as SetTypes),
  );

  const setId = value.includes("set_id:") ? value.split(":")[1] : null;
  const { data, isSuccess } = useCountHook({ setId });

  if (setId) {
    const setName = sets?.[setId];
    label =
      setName !== undefined
        ? setName
        : isSuccess
        ? `${data.toLocaleString()} input ${
            field === "genes.gene_id" ? "gene" : fieldNameToTitle(field)
          }s`.toLowerCase()
        : "...";
    setLabel && setLabel(label);
  } else {
    if (field === "genes.gene_id") {
      label = geneSymbolSuccess ? geneSymbolDict[value] ?? "..." : "...";
      setLabel && setLabel(label);
    } else {
      label = value;
      setLabel && setLabel(label);
    }
  }

  return <>{label}</>;
};

export default QueryRepresentationLabel;
