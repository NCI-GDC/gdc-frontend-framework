import { FilterSet } from "@gff/core";
import { Row } from "@tanstack/react-table";
import { SelectReducerAction, Survival, Column } from "../shared/types";

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
  CNVGain: {
    numerator: number;
    denominator: number;
  };
  CNVLoss: {
    numerator: number;
    denominator: number;
  };
  cytoband: string[];
  annotations: boolean;
  mutations: string;
  subRows: string;
  genesTotal: number;
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
  selectedGenes: Record<string, Row<Genes>>;
  setSelectedGenes: (action: SelectReducerAction<Genes>) => void;
  handleGTotal: (gTotal: number) => void;
  columnListOrder: Column[];
  visibleColumns: Column[];
  isDemoMode?: boolean;
  genomicFilters: FilterSet;
  cohortFilters: FilterSet;
  handleMutationCountClick: (geneId: string, geneSymbol: string) => void;
}

export const DEFAULT_GTABLE_ORDER = [
  { id: "select", columnName: "Select", visible: true },
  { id: "cohort", columnName: "Cohort", visible: true },
  { id: "survival", columnName: "Survival", visible: true },
  { id: "geneID", columnName: "Gene ID", visible: false },
  { id: "symbol", columnName: "Symbol", visible: true },
  { id: "name", columnName: "Name", visible: true },
  { id: "cytoband", columnName: "Cytoband", visible: false },
  { id: "type", columnName: "Type", visible: false, justify: "left" },
  {
    id: "SSMSAffectedCasesInCohort",
    columnName: "# SSM Affected Cases In Cohort",
    visible: true,
  },
  {
    id: "SSMSAffectedCasesAcrossTheGDC",
    columnName: "# SSM Affected Cases Across The GDC",
    visible: true,
  },
  { id: "CNVGain", columnName: "# CNV Gain", visible: true },
  { id: "CNVLoss", columnName: "# CNV Loss", visible: true },
  { id: "mutations", columnName: "# Mutations", visible: true },
  { id: "annotations", columnName: "Annotations", visible: true },
] as Column[];

export type columnFilterType = "cnvgain" | "cnvloss" | "ssmaffected" | null;
