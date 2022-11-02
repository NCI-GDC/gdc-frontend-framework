import { Survival } from "@gff/core";

export interface Gene {
  symbol: string;
  name: string;
  survival: Survival;
  SSMSAffectedCasesInCohort: string;
  SSMSAffectedCasesAcrossTheGDC: string;
  CNVGain: string;
  CNVLoss: string;
  mutations: number;
  annotations: string;
}

export interface GenesTableProps {
  readonly initialData: any; // need to add this from response
  readonly selectedSurvivalPlot: Record<string, string>;
  width: number;
  readonly handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  pageSize: number;
  page: number;
  selectedGenes: any;
  selectGene: any;
  selectAll: any;
  handleGTotal: (gTotal: number) => any;
}

export const DEFAULT_GTABLE_ORDER = [
  { id: "select", columnName: "Select", visible: true },
  { id: "survival", columnName: "Survival", visible: true },
  { id: "geneID", columnName: "Gene ID", visible: false },
  { id: "symbol", columnName: "Symbol", visible: true },
  { id: "name", columnName: "Name", visible: true },
  { id: "cytoband", columnName: "Cytoband", visible: true },
  { id: "type", columnName: "Type", visible: false },
  {
    id: "SSMSAffectedCasesInCohort",
    columnName: "# SSMS Affected Cases In Cohort",
    visible: true,
  },
  {
    id: "SSMSAffectedCasesAcrossTheGDC",
    columnName: "# SSMS Affected Cases Across The GDC",
    visible: true,
  },
  { id: "CNVGain", columnName: "# CNV Gain", visible: true },
  { id: "CNVLoss", columnName: "# CNV Loss", visible: true },
  { id: "mutations", columnName: "Mutations", visible: true },
  { id: "annotations", columnName: "Annotations", visible: true },
];

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
