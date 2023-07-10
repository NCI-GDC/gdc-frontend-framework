import { FilterSet, GDCSsmsTable } from "@gff/core";
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
] as Column[];

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
    geneId: string;
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

export type SsmToggledHandler = (symbol: Record<string, any>) => void;

export interface SomaticMutationsTableProps {
  status: string;
  readonly initialData: GDCSsmsTable;
  readonly selectedSurvivalPlot: Record<string, string>;
  width: number;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  selectedMutations: SelectedReducer<SomaticMutations>;
  setSelectedMutations: (action: SelectReducerAction<SomaticMutations>) => void;
  handleSMTotal: (smTotal: number) => void;
  columnListOrder: Column[];
  visibleColumns: Column[];
  handleSsmToggled?: SsmToggledHandler;
  toggledSsms?: ReadonlyArray<string>;
  geneSymbol?: string;
  projectId?: string;
  isDemoMode?: boolean;
  isModal?: boolean;
  combinedFilters: FilterSet;
}
