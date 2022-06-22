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
  entity: Partial<node>;
  children: any;
  entityTypes: Array<types>;
  type: types;
  selectedEntity: Partial<node>;
  selectEntity: (entity: Partial<node>, type: types) => void;
  query: string;
  search: searchType;
}

export interface BioTreeProps {
  entities?: {
    hits: {
      edges: {
        node: Partial<node>;
      }[];
    };
  };
  entityTypes: Array<types>;
  type: types;
  parentNode: string;
  treeStatusOverride: overrideMessage | null;
  setTreeStatusOverride: React.Dispatch<React.SetStateAction<overrideMessage>>;
  selectedEntity: Partial<node>;
  selectEntity: (entity: Partial<node>, type: types) => void;
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
