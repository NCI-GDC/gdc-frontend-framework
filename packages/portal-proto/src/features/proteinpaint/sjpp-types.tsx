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
