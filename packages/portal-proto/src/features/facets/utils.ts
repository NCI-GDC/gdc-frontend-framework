import {
  DAYS_IN_DECADE,
  DAYS_IN_YEAR,
  EnumOperandValue,
  GreaterThan,
  GreaterThanOrEquals,
  LessThan,
  LessThanOrEquals,
  Operation,
} from "@gff/core";
import _ from "lodash";
import {
  FromToRange,
  UpdateFacetFilterFunction,
  ClearFacetFunction,
  RangeBucketElement,
} from "@/features/facets/types";

export const DEFAULT_VISIBLE_ITEMS = 6;

// TODO write unit test for these
export const getLowerAgeYears = (days?: number): number | undefined =>
  days !== undefined ? Math.ceil(days / DAYS_IN_YEAR) : undefined;
export const getUpperAgeYears = (days?: number): number | undefined =>
  days !== undefined
    ? Math.ceil((days + 1 - DAYS_IN_YEAR) / DAYS_IN_YEAR)
    : undefined;
export const getLowerAgeFromYears = (years?: number): number | undefined =>
  years !== undefined ? Math.floor(years * DAYS_IN_YEAR) : undefined;
export const getUpperAgeFromYears = (years?: number): number | undefined =>
  years !== undefined
    ? Math.floor(years * DAYS_IN_YEAR + DAYS_IN_YEAR - 1)
    : undefined;

export const AgeDisplay = (
  ageInDays: number,
  yearsOnly = false,
  defaultValue = "--",
): string => {
  const leapThenPair = (years: number, days: number): number[] =>
    days === 365 ? [years + 1, 0] : [years, days];
  const timeString = (
    num: number,
    singular: string,
    plural: string,
  ): string => {
    const pluralChecked = plural || `${singular}s`;
    return `${num} ${num === 1 ? singular : pluralChecked}`;
  };
  const _timeString = _.spread(timeString);

  if (!ageInDays) {
    return defaultValue;
  }
  return _.zip(
    leapThenPair(
      Math.floor(ageInDays / DAYS_IN_YEAR),
      Math.ceil(ageInDays % DAYS_IN_YEAR),
    ),
    ["year", "day"],
  )
    .filter((p) => (yearsOnly ? p[1] === "year" : p[0] > 0))
    .map((p) => (!yearsOnly ? _timeString(p) : p[0]))
    .join(" ")
    .trim();
};

export const buildRangeOperator = <T extends string | number>(
  field: string,
  rangeData: FromToRange<T>,
): Operation | undefined => {
  // couple of different cases
  // * no from/to return undefined
  if (rangeData.from === undefined && rangeData.to === undefined)
    return undefined;

  const fromOperation: GreaterThan | GreaterThanOrEquals =
    rangeData.from !== undefined
      ? {
          field: field,
          operator: rangeData.fromOp,
          operand: rangeData.from,
        }
      : undefined;
  const toOperation: LessThan | LessThanOrEquals =
    rangeData.to !== undefined
      ? {
          field: field,
          operator: rangeData.toOp,
          operand: rangeData.to,
        }
      : undefined;

  if (fromOperation && toOperation)
    return { operator: "and", operands: [fromOperation, toOperation] };
  if (fromOperation) return fromOperation;
  return toOperation;
};

/**
 * Given an operation, determine if range is open or closed and extract
 * the range values and operands as a NumericRange
 * @param filter - operation to test
 */
export const extractRangeValues = <T extends string | number>(
  filter?: Operation,
): FromToRange<T> | undefined => {
  if (filter !== undefined) {
    switch (filter.operator) {
      case ">":
      case ">=":
        return {
          from:
            typeof filter.operand === "number" ||
            typeof filter.operand === "string"
              ? (filter.operand as T)
              : undefined,
          fromOp: filter.operator,
        };
      case "<":
      case "<=":
        return {
          to:
            typeof filter.operand === "number" ||
            typeof filter.operand === "string"
              ? (filter.operand as T)
              : undefined,
          toOp: filter.operator,
        };
      case "and": {
        const a = extractRangeValues<T>(filter.operands[0]);
        const b = extractRangeValues<T>(filter.operands[1]);
        return { ...a, ...b };
      }
      default:
        return undefined;
    }
  } else {
    return undefined;
  }
};

export const updateFacetEnum = (
  fieldName: string,
  values: EnumOperandValue,
  updateFacetFilters: UpdateFacetFilterFunction,
  clearFilters: ClearFacetFunction,
): void => {
  if (values === undefined) return;
  if (values.length > 0) {
    // TODO: Assuming Includes by default but this might change to Include|Excludes
    updateFacetFilters(fieldName, {
      operator: "includes",
      field: fieldName,
      operands: values,
    });
  }
  // no values remove the filter
  else {
    clearFilters(fieldName);
  }
};

/**
 * returns the range [from to] for a "bucket"
 * @param x - current bucket index
 * @param units - custom units for this range: "years" or "days"
 * @param minimum - starting value of range
 */
const buildDayYearRangeBucket = (
  x: number,
  units: string,
  minimum: number,
): RangeBucketElement => {
  const from = minimum + x * DAYS_IN_DECADE;
  const to = minimum + (x + 1) * DAYS_IN_DECADE;
  return {
    from: from,
    to: to,
    key: `${from.toFixed(2)}-${to.toFixed(2)}`,
    label: `\u2265 ${(from / (units == "years" ? DAYS_IN_YEAR : 1)).toFixed(
      2,
    )} to < ${(to / (units == "years" ? DAYS_IN_YEAR : 1)).toFixed(
      2,
    )} ${units}`,
  };
};

/**
 * returns 10 value range from to for a "bucket"
 * @param x - current bucket index
 * @param units - string to append to label
 * @param minimum - staring value of range
 * @param fractionDigits - number of values to the right of the decimal point
 */
const build10UnitRange = (
  x: number,
  units: string,
  minimum: number,
  fractionDigits = 2,
): RangeBucketElement => {
  const from = minimum + x * 10;
  const to = minimum + (x + 1) * 10;
  return {
    from: from,
    to: to,
    key: `${from.toFixed(fractionDigits)}-${to.toFixed(fractionDigits)}`,
    label: `\u2265 ${from} to < ${to} ${units}`,
  };
};

/**
 * Builds a Dictionary like object contain the range and label for each "bucket" in the range
 * @param numBuckets - number of buckets to create
 * @param units - units such as days or percent
 * @param minimum - start value of range
 * @param rangeFunction - function to compute range boundaries
 */
const BuildRanges = (
  numBuckets: number,
  units: string,
  minimum,
  rangeFunction: (
    index: number,
    units: string,
    startValue: number,
  ) => RangeBucketElement,
): Record<string, RangeBucketElement> => {
  // build the range for the useRangeFacet call
  return [...Array(numBuckets)]
    .map((_x, i) => {
      return rangeFunction(i, units, minimum);
    })
    .reduce((r, x) => {
      r[x.key] = x;
      return r;
    }, {} as Record<string, RangeBucketElement>);
};
export const BuildRangeBuckets = (
  numBuckets: number,
  units: string,
  minimum: number,
): [Record<string, RangeBucketElement>] => {
  const RangeBuilder = {
    days: {
      builder: buildDayYearRangeBucket,
      label: "days",
    },
    years: {
      builder: buildDayYearRangeBucket,
      label: "years",
    },
    percent: {
      builder: build10UnitRange,
      label: "%",
    },
    year: {
      builder: build10UnitRange,
      label: "",
    },
  };

  const bucketEntries = BuildRanges(
    numBuckets,
    RangeBuilder[units].label,
    minimum,
    RangeBuilder[units].builder,
  );
  // build ranges for continuous range query
  const r = Object.keys(bucketEntries).map((x) => {
    return { from: bucketEntries[x].from, to: bucketEntries[x].to };
  });
  return [bucketEntries, r];
};
