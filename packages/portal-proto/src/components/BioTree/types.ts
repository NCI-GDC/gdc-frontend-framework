import { node } from "@gff/core";

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
  entity: node;
  children: any;
  entityTypes: Array<types>;
  type: types;
  selectedEntity: node;
  selectEntity: (entity: node, type: types) => void;
  query: string;
  search: searchType;
}

export interface BioTreeProps {
  entities?: {
    hits: {
      edges: {
        node: node;
      }[];
    };
  };
  entityTypes: Array<types>;
  type: types;
  parentNode: string;
  treeStatusOverride: overrideMessage | null;
  setTreeStatusOverride: React.Dispatch<React.SetStateAction<overrideMessage>>;
  selectedEntity: node;
  selectEntity: (entity: node, type: types) => void;
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
}
