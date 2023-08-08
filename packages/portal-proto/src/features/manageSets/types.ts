import { SetTypes } from "@gff/core";

export interface SetData {
  readonly setId: string;
  readonly setName: string;
  readonly setType: SetTypes;
  readonly count: number;
}
