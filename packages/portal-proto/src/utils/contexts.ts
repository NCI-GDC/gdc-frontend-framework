import { FilterSet } from "@gff/core";
import { createContext, Dispatch, SetStateAction } from "react";

export const URLContext = createContext({ prevPath: "", currentPath: "" });

export type entityType = null | "project" | "case" | "file" | "ssms" | "genes";
export interface entityMetadataType {
  entity_type: entityType;
  entity_id: string;
  contextSensitive?: boolean;
  contextFilters?: FilterSet;
}
export const SummaryModalContext = createContext<{
  entityMetadata: entityMetadataType;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
}>(null);
