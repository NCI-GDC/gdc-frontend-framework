import { Survival } from "../shared/types";
import { Column, SelectedReducer, SelectReducerAction } from "../shared/types";

export const DEFAULT_SMTABLE_ORDER: Column[] = [
  { id: "select", columnName: "Select", visible: true },
  { id: "cohort", columnName: "Cohort", visible: true },
  { id: "survival", columnName: "Survival", visible: true },
  { id: "mutationID", columnName: "Mutation ID", visible: false },
  { id: "DNAChange", columnName: "DNA Change", visible: true },
  { id: "proteinChange", columnName: "Protein Change", visible: true },
  { id: "type", columnName: "Type", visible: true },
  {
    id: "consequences",
    columnName: "Consequences",
    visible: true,
  },
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
  ssm_id: string;
  aa_change: string;
  annotation: Annotation;
  consequence_type: string;
  gene: Record<string, string>;
  id: string;
  is_canonical: boolean;
}

export interface Impacts {
  polyphenImpact: string;
  polyphenScore: number;
  siftImpact: string;
  siftScore: number;
  vepImpact: string;
}

export interface SingleSomaticMutation {
  consequence: Consequence[];
  filteredOccurrences: number;
  ssm_id: string;
  genomic_dna_change: string;
  mutation_subtype: string;
  occurrence: number;
  score: number;
  id: string;
}

export interface Impact {
  polyphenImpact: string;
  polyphenScore: number | string;
  siftImpact: string;
  siftScore: number | string;
  vepImpact: string;
}

export interface SomaticMutations {
  select: string;
  mutationID: string;
  DNAChange: string;
  type: string;
  consequences: string;
  proteinChange: {
    symbol: string;
    aaChange: string;
  };
  affectedCasesInCohort: {
    numerator: number;
    denominator: number;
  };
  affectedCasesAcrossTheGDC: {
    numerator: number;
    denominator: number;
  };
  cohort: {
    checked: boolean;
  };
  survival: Survival;
  impact: Impact;
  subRows: string;
  ssmsTotal: number;
}

export interface SomaticMutationsTableProps {
  status: string;
  readonly initialData: any;
  readonly selectedSurvivalPlot: Record<string, string>;
  width: number;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  pageSize: number;
  page: number;
  selectedMutations: SelectedReducer<SomaticMutations>;
  setSelectedMutations: (action: SelectReducerAction<SomaticMutations>) => void;
  handleSMTotal: (smTotal: number) => void;
  columnListOrder: Column[];
  visibleColumns: Column[];
  searchTerm: string;
}
