export const DEFAULT_SMTABLE_ORDER = [
  { id: "select", columnName: "Select", visible: true },
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
  { id: "survival", columnName: "Surival", visible: true },
];

export interface SomaticMutation {
  ssm_id: string;
}

export interface SomaticMutationsTableProps {
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
  selectedMutations: any;
  selectMutation: any;
  selectAll: any;
}
