export interface Trace3d {
  readonly x: ReadonlyArray<number>;
  readonly y: ReadonlyArray<number>;
  readonly z: ReadonlyArray<number>;
  readonly color: ReadonlyArray<string|number>;
}

export interface ScatterPlot3dProps {
  readonly dimensions: 3;
  readonly data: ReadonlyArray<Trace3d>;
}
