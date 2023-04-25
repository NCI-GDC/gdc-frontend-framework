export type SampleData = {
  "case.case_id"?: string;
};

export interface SelectSamplesCallBackArg {
  samples: SampleData[];
  source: string;
  // the button argument will require pp-client > 2.14
  // button: SelectSamplesButton;
}

export type SelectSamplesCallback = (samples: SelectSamplesCallBackArg) => void;

export interface SelectSamples {
  buttonText: string;
  attributes: string[];
  callback?: SelectSamplesCallback;
}

/*
// these updated types will require pp-client > 2.14
export interface SelectSamplesButton {
  buttonText: string;
  attributes: string[];
  callback?: SelectSamplesCallback;
}

export interface SelectSamples {
  buttons: SelectSamplesButton[];
}*/

/*
// TODO: how to extract from ProteinPaintWrapper to here,
// but not cause errors in using the coreDispatch() outside of a function component
export function createCohortFromPP<SelectSamplesCallback> (
  arg: SelectSamplesCallBackArg,
): void {
  const { samples, source } = arg; console.log(39)
  const ids = samples.map((d) => d["case.case_id"]).filter((d) => d && true);
  const filters: FilterSet = {
    mode: "and",
    root: {
      "occurrence.case.case_id": {
        operator: "includes",
        field: "occurrence.case.case_id",
        operands: ids,
      },
    },
  };

  const coreDispatch = useCoreDispatch();

  coreDispatch(
    // TODO: option to edit a cohort using ImportCohortModal???
    addNewCohortWithFilterAndMessage({
      filters: filters,
      message: "newCasesCohort",
      // TODO: improve cohort name constructor
      name: source + ` (n=${samples.length})`,
    }),
  );
}
*/
