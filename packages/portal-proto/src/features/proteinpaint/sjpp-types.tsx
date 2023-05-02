import { FilterSet } from "@gff/core";

export type SampleData = {
  "case.case_id"?: string;
};

export interface SelectSamplesCallBackArg {
  samples: SampleData[];
  source: string;
}

export type SelectSamplesCallback = (samples: SelectSamplesCallBackArg) => void;

export interface SelectSamples {
  buttonText: string;
  attributes: string[];
  callback?: SelectSamplesCallback;
}

export function getFilters(arg: SelectSamplesCallBackArg): FilterSet {
  const { samples } = arg;
  const ids = samples.map((d) => d["case.case_id"]).filter((d) => d && true);
  return {
    mode: "and",
    root: {
      "occurrence.case.case_id": {
        operator: "includes",
        field: "occurrence.case.case_id",
        operands: ids,
      },
    },
  };
}
