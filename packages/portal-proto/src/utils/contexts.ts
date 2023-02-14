import { createContext, Dispatch, SetStateAction } from "react";

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
