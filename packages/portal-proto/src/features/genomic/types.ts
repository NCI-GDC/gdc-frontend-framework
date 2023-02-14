export interface GenomicTableProps {
  readonly selectedSurvivalPlot?: Record<string, string>;
  readonly handleSurvivalPlotToggled?: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}
