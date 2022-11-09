import { Dispatch } from "react";
import { Column, SelectedReducer, SelectReducerAction } from "../shared/types";

export const DEFAULT_SMTABLE_ORDER = [
  { id: "select", columnName: "Select", visible: true },
  { id: "cohort", columnName: "cohort", visible: false },
  { id: "survival", columnName: "Survival", visible: true },
  { id: "mutationID", columnName: "Mutation ID", visible: false },
  { id: "DNAChange", columnName: "DNA Change", visible: true },
  { id: "type", columnName: "Type", visible: false },
  { id: "consequences", columnName: "Consequences", visible: true },
  { id: "proteinChange", columnName: "Protein Change", visible: true },
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
  affectedCasesInCohort: string;
  affectedCasesAcrossTheGDC: string;
  cohort: {
    checked: boolean;
  };
  survival: {
    checked: boolean;
    symbol: string;
    name: string;
  };
  impact: Impact;
  subRows: string;
  ssmsTotal: number;
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
  page: number;
  selectedMutations: SelectedReducer<SomaticMutations>;
  setSelectedMutations: Dispatch<SelectReducerAction<SomaticMutations>>;
  handleSMTotal: (smTotal: number) => void;
  columnListOrder: Column[];
  visibleColumns: Column[];
  searchTerm: string;
}
