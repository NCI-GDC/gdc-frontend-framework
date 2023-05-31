export interface GenomicTableProps {
  readonly selectedSurvivalPlot?: Record<string, string>;
  readonly handleSurvivalPlotToggled?: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}

// pass to Survival Plot when survivalPlotData data is undefined/not ready
export const emptySurvivalPlot = {
  overallStats: { pValue: undefined },
  survivalData: [],
};
