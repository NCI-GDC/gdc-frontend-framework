import { createContext, Dispatch, SetStateAction } from "react";
import { FilterSet } from "@gff/core";

export const URLContext = createContext({ prevPath: "", currentPath: "" });

export type entityType = null | "project" | "case" | "file" | "ssms";
export interface entityMetadataType {
  entity_type: entityType;
  entity_id: string;
  entity_name: string;
}
export const SummaryModalContext = createContext<{
  entityMetadata: entityMetadataType;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
}>(null);

interface CohortFromBodyplot {
  filters?: FilterSet;
  name?: string;
}
export const BodyplotContext = createContext<{
  bodyPlotFilters: CohortFromBodyplot;
  setBodyPlotFilters: Dispatch<SetStateAction<CohortFromBodyplot>>;
}>(null);
