export interface Gene {
  symbol: string;
  name: string;
  // survival: string;
  SSMSAffectedCasesInCohort: string;
  SSMSAffectedCasesAcrossTheGDC: string;
  CNVGain: string;
  CNVLoss: string;
  mutations: number;
  annotations: string;
}

export interface GeneSubRow {
  geneId: string;
  width: number;
  opening: boolean;
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
  handlePageSize: any;
  offset: number;
  handleOffset: (offset: number) => any;
  selectedGenes: any;
  selectGene: any;
  selectAll: any;
}

export const GENE_MENU = [
  { label: "Save/Edit Gene Set", value: "placeholder" },
  { label: "Save as new gene set", value: "save" },
  { label: "Add existing gene set", value: "add" },
  { label: "Remove from existing gene set", value: "remove" },
];

export const DEFAULT_GTABLE_ORDER = [
  { id: "select", columnName: "Select", visible: true },
  { id: "geneID", columnName: "Gene ID", visible: false },
  { id: "symbol", columnName: "Symbol", visible: true },
  { id: "name", columnName: "Name", visible: true },
  // { id: "cytoband", columnName: "Cytoband", visible: false },
  // { id: "type", columnName: "Type", visible: false },
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
  { id: "survival", columnName: "Survival", visible: true },
  // { id: "survival", columnName: "Survival", visible: true }
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

export const getGraphQLFilters = (
  pageSize,
  offset,
  filterContents = [],
  sorts = [],
) => {
  return {
    genesTable_filters: {},
    genesTable_size: pageSize,
    genesTable_offset: offset,
    score: "case.project.project_id",
    ssmCase: {
      op: "and",
      content: [
        {
          op: "in",
          content: {
            field: "cases.available_variation_data",
            value: ["ssm"],
          },
        },
        {
          op: "NOT",
          content: {
            field: "genes.case.ssm.observation.observation_id",
            value: "MISSING",
          },
        },
      ],
    },
    geneCaseFilter: {
      content: [
        ...[
          {
            content: {
              field: "cases.available_variation_data",
              value: ["ssm"],
            },
            op: "in",
          },
        ],
        ...filterContents,
      ],
      op: "and",
    },
    ssmTested: {
      content: [
        {
          content: {
            field: "cases.available_variation_data",
            value: ["ssm"],
          },
          op: "in",
        },
      ],
      op: "and",
    },
    cnvTested: {
      op: "and",
      content: [
        ...[
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
        ],
        ...filterContents,
      ],
    },
    cnvGainFilters: {
      op: "and",
      content: [
        ...[
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
          {
            content: {
              field: "cnvs.cnv_change",
              value: ["Gain"],
            },
            op: "in",
          },
        ],
        ...filterContents,
      ],
    },
    cnvLossFilters: {
      op: "and",
      content: [
        ...[
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
          {
            content: {
              field: "cnvs.cnv_change",
              value: ["Loss"],
            },
            op: "in",
          },
        ],
        ...filterContents,
      ],
    },
    sorts: sorts,
  };
};
