export interface IconSize {
  readonly width: number;
  readonly height: number;
}

export interface AppRegistrationEntry {
  readonly name: string;
  readonly icon?: string;
  readonly tags: ReadonlyArray<string>;
  readonly hasDemo?: boolean;
  readonly demoMode?: boolean;
  readonly id?: string;
  readonly description?: string;
  readonly iconSize?: IconSize;
  readonly countsField?: string;
  readonly caseCounts?: number; // Added for MR Demo TODO: Compute real values
  readonly hideCounts?: boolean;
  readonly optimizeRules?: ReadonlyArray<string>;
  readonly selectAdditionalCohort?: boolean;
  readonly noDataTooltip?: string;
}

const descendingOrd = (array) => {
  return array.sort((a, b) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  });
};

const ascendingOrd = (array) => {
  return array.sort((a, b) => {
    if (b < a) {
      return -1;
    } else if (b > a) {
      return 1;
    } else {
      return 0;
    }
  });
};

export const sortAlphabetically: (array: any, direction: any) => any = (
  array,
  direction,
) => {
  return direction === "a-z" ? descendingOrd(array) : ascendingOrd(array);
};
