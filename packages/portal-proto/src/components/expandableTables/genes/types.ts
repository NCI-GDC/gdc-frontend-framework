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
  readonly data: ReadonlyArray<Gene>;
  readonly columns: any;
  expanded: ExpandedState;
}
