export const DEFAULT_SMTABLE_ORDER = [
  { id: "select", columnName: "Select", visible: true },
];

export interface SomaticMutation {
  something: any;
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
