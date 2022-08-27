export interface ViolinMultiPlotProps {
  readonly x: ReadonlyArray<string>;
  readonly y: ReadonlyArray<number>;
  readonly colors: Record<string, string>;
}
