import { SetTypes } from "@gff/core";

export interface SelectedSet {
  readonly setId: string;
  readonly setName: string;
  readonly setType: SetTypes;
}
