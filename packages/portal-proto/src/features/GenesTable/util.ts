import { FilterSet } from "@gff/core";
import { Row } from "@tanstack/react-table";
import {
  SelectReducerAction,
  Survival,
  Column,
} from "../../components/expandableTables/shared/types";

export interface SingleGene {
  biotype: string;
  case_cnv_gain: number;
  case_cnv_loss: number;
  cnv_case: number;
  cytoband: string[];
  gene_id: string;
  id: string;
  is_cancer_gene_census: boolean;
  name: string;
  numCases: number;
  ssm_case: number;
  symbol: string;
}

export interface Gene {
  select: string;
  geneID: string;
  name: string;
  type: string;
  cohort: {
    checked: boolean;
  };
  symbol: string;
  survival: Survival;
  CNVGain: string;
  CNVLoss: string;
  cytoband: string[];
  annotations: boolean;
  mutations: string;
  SSMSAffectedCasesInCohort: {
    numerator: number;
    denominator: number;
  };
  SSMSAffectedCasesAcrossTheGDC: {
    numerator: number;
    denominator: number;
  };
}

export type Genes = {
  select: string;
  geneID: string;
  symbol: string;
  name: string;
  survival: Survival;
  SSMSAffectedCasesInCohort: {
    numerator: number;
    denominator: number;
  };
  SSMSAffectedCasesAcrossTheGDC: string;
  CNVGain: string;
  CNVLoss: string;
  mutations: number;
  annotations: boolean;
  subRows: string;
};

export type GeneToggledHandler = (symbol: Record<string, any>) => void;

export interface GenesTableProps {
  readonly status: string;
  readonly initialData: Record<string, any>; // need to add this from response
  readonly selectedSurvivalPlot: Record<string, string>;
  width: number;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneToggled: GeneToggledHandler;
  toggledGenes: ReadonlyArray<string>;
  pageSize: number;
  page: number;
  selectedGenes: Record<string, Row<Genes>>;
  setSelectedGenes: (action: SelectReducerAction<Genes>) => void;
  handleGTotal: (gTotal: number) => void;
  columnListOrder: Column[];
  visibleColumns: Column[];
  searchTerm: string;
  isDemoMode?: boolean;
  genomicFilters: FilterSet;
  handleMutationCountClick: (geneId: string, geneSymbol: string) => void;
}

export const getGene = (
  g: SingleGene,
  selectedSurvivalPlot: Record<string, string>,
  mutationCounts: Record<string, string>,
  filteredCases: number,
  cases: number,
  cnvCases: number,
): Gene => {
  return {
    select: g.gene_id,
    geneID: g.gene_id,
    survival: {
      label: g.symbol,
      name: g.name,
      symbol: g.symbol,
      checked: g.symbol == selectedSurvivalPlot?.symbol,
    },
    cohort: {
      checked: true,
    },
    symbol: g.symbol,
    name: g.name,
    type: g.biotype,
    cytoband: g.cytoband,
    SSMSAffectedCasesInCohort: {
      numerator: g.numCases,
      denominator: filteredCases,
    },
    SSMSAffectedCasesAcrossTheGDC: {
      numerator: g.ssm_case,
      denominator: cases,
    },
    CNVGain:
      cnvCases > 0
        ? `${g.case_cnv_gain.toLocaleString()} / ${cnvCases.toLocaleString()} (${(
            (100 * g.case_cnv_gain) /
            cnvCases
          ).toFixed(2)}%)`
        : `--`,
    CNVLoss:
      cnvCases > 0
        ? `${g.case_cnv_loss.toLocaleString()} / ${cnvCases.toLocaleString()} (${(
            (100 * g.case_cnv_loss) /
            cnvCases
          ).toFixed(2)}%)`
        : `--`,
    mutations: mutationCounts[g.gene_id],
    annotations: g.is_cancer_gene_census,
  };
};
