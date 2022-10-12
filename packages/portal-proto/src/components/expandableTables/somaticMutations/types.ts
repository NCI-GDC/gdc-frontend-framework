export const DEFAULT_SMTABLE_ORDER = [
  { id: "select", columnName: "Select", visible: true },
  { id: "survival", columnName: "Surival", visible: true },
  { id: "mutationID", columnName: "Mutation ID", visible: false },
  { id: "DNAChange", columnName: "DNA Change", visible: true },
  { id: "type", columnName: "Type", visible: true },
  { id: "consequences", columnName: "Consequences", visible: true },
  {
    id: "affectedCasesInCohort",
    columnName: "# Affected Cases in Cohort",
    visible: true,
  },
  {
    id: "affectedCasesAcrossTheGDC",
    columnName: "# Affected Cases Across the GDC",
    visible: true,
  },
  { id: "impact", columnName: "Impact", visible: true },
];

export interface Annotation {
  polyphen_impact: string;
  polyphen_score: number;
  sift_impact: string;
  sift_score: number;
  vep_impact: string;
}

export interface Consequence {
  aa_change: string;
  annotation: Annotation;
  consequence_type: string;
  gene: Record<string, string>;
  id: string;
  is_canonical: boolean;
}

export interface SomaticMutation {
  consequence: Consequence[];
  filteredOccurences: number;
  ssm_id: string;
  genomic_dna_change: string;
  mutation_subtype: string;
  occurence: number;
  score: number;
  id: string;
}

export interface SomaticMutationsTableProps {
  readonly initialData: any;
  readonly selectedSurvivalPlot: Record<string, string>;
  width: number;
  readonly handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  pageSize: number;
  handlePageSize: any;
  page: number;
  handlePage: (page: number) => any;
  selectedMutations: any;
  selectMutation: any;
  selectAll: any;
}
