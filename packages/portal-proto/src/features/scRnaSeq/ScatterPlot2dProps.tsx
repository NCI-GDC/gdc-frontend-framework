export interface Trace2d {
  readonly x: ReadonlyArray<number>;
  readonly y: ReadonlyArray<number>;
  readonly color: ReadonlyArray<number|string>;
}

export interface ScatterPlot2dProps {
  readonly dimensions: 2;
  readonly data: ReadonlyArray<Trace2d>;
}
