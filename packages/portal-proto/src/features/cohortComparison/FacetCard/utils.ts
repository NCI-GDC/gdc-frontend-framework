import { DAYS_IN_YEAR, FilterSet } from "@gff/core";

export const formatBucket = (
  bucket: number | string,
  field: string,
): string => {
  if (field === "diagnoses.age_at_diagnosis") {
    const age = (bucket as number) / DAYS_IN_YEAR;
    return age === 80 ? "80+ years" : `${age} to <${age + 10} years`;
  }

  return bucket === "_missing" ? "missing" : (bucket as string);
};

export const createFilters = (field: string, bucket: string): FilterSet => {
  if (field === "diagnoses.age_at_diagnosis") {
    const numericBucket = Number(bucket);
    if (numericBucket === 80 * DAYS_IN_YEAR) {
      return {
        mode: "and",
        root: {
          [field]: {
            field,
            operator: ">=",
            operand: numericBucket,
          },
        },
      };
    }

    return {
      mode: "and",
      root: {
        [field]: {
          operator: "and",
          operands: [
            {
              field,
              operator: ">=",
              operand: numericBucket,
            },
            {
              field,
              operator: "<=",
              operand: numericBucket + DAYS_IN_YEAR * 10 - 0.1,
            },
          ],
        },
      },
    };
  }

  if (bucket === "_missing") {
    return {
      mode: "and",
      root: {
        [field]: {
          field,
          operator: "missing",
        },
      },
    };
  }

  return {
    mode: "and",
    root: {
      [`cases.${field}`]: {
        field: `cases.${field}`,
        operands: [bucket],
        operator: "includes",
      },
    },
  };
};
