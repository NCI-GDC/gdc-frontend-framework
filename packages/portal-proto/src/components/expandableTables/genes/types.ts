import { ExpandedState } from "@tanstack/table-core";

export interface Gene {
  symbol: string;
  name: string;
  survival: string;
  SSMSAffectedCasesInCohort: string;
  SSMSAffectedCasesAcrossTheGDC: string[];
  CNVGain: string;
  CNVLoss: string;
  mutations: number;
  annotations: string;
}

export interface GeneSubRow {
  geneId: string;
}

export interface GenesTableProps {
  readonly initialData: ReadonlyArray<Gene>;
  readonly columns: any;
  expanded: ExpandedState;
}

export const INITIAL_FILTERS = {
  mode: "and",
  root: {
    "genes.is_cancer_gene_census": {
      field: "genes.is_cancer_gene_census",
      operator: "includes",
      operands: ["true"],
    },
  },
};
