import { FilterSet } from "@gff/core";

export type SampleData = {
  "cases.case_id"?: string;
};

export interface SelectSamplesCallBackArg {
  samples: SampleData[];
  source: string;
}

export type SelectSamplesCallback = (samples: SelectSamplesCallBackArg) => void;

export type attrMapping = {
  from: string;
  to?: string;
  convert?: boolean;
};

export interface SelectSamples {
  buttonText: string;
  attributes: attrMapping[];
  callback?: SelectSamplesCallback;
}

export function getFilters(arg: SelectSamplesCallBackArg): FilterSet {
  const { samples } = arg;
  // see comments below about SV-2228
  const ids = samples.map((d) => d["cases.case_id"]).filter((d) => d && true);
  return {
    mode: "and",
    root: {
      // see https://jira.opensciencedatacloud.org/browse/SV-2228
      // per Craig: I suggest always representing cohorts comprised of cases using the cases.case_id filter,
      // as it is the most general of the case filters. Within an app, you can use any filter needed;
      // when these become part of the cohort, there is some potential for issues.
      // NOTE: This is primarily because both the frontend and backends are trying to, in effect,
      // JOINs across the explore and repository indexes, and there is some additional work needed to work will all filters.
      "cases.case_id": {
        operator: "includes",
        field: "cases.case_id",
        operands: ids,
      },
    },
  };
}
