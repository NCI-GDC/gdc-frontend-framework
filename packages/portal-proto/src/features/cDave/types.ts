import { NumericFromTo } from "@gff/core";

export interface CustomInterval {
  readonly interval: number;
  readonly min: number;
  readonly max: number;
}

export type NamedFromTo = NumericFromTo & {
  name: string;
};
