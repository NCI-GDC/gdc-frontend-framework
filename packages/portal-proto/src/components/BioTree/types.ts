import { entityType } from "@gff/core";
import { JSXElementConstructor, ReactElement } from "react";

export interface types {
  s: string;
  p: string;
}

export type searchType = (
  query: string,
  entity: {
    node: Record<string, any>;
  },
) => any[];

export interface NodeProps {
  entity: entityType;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  entityTypes: Array<types>;
  type: types;
  selectedEntity: entityType;
  selectEntity: (entity: entityType, type: types) => void;
  query: string;
}

export interface BioTreeProps {
  entities?: {
    hits: {
      edges: {
        node: entityType;
      }[];
    };
  };
  entityTypes: Array<types>;
  type: types;
  parentNode: string | null;
  treeStatusOverride: overrideMessage;
  setTreeStatusOverride: React.Dispatch<
    React.SetStateAction<overrideMessage | null>
  >;
  selectedEntity: entityType;
  selectEntity: (entity: entityType, type: types) => void;
  setExpandedCount: React.Dispatch<React.SetStateAction<number>>;
  setTotalNodeCount: React.Dispatch<React.SetStateAction<number>>;
  query: string;
  search: searchType;
}

export const entityTypes = [
  { s: "portion", p: "portions" },
  { s: "aliquot", p: "aliquots" },
  { s: "analyte", p: "analytes" },
  { s: "slide", p: "slides" },
  { s: "sample", p: "samples" },
];

export enum overrideMessage {
  Expanded = "Expanded",
  Collapsed = "Collapsed",
  QueryMatches = "QueryMatches",
  // do I need a null type here?
}
