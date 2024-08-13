import { FromToRange, RangeBucketElement } from "../types";

export const radioStyle =
  "form-check-input form-check-input appearance-none rounded-full h-3 w-3 border border-base-light bg-base-lightest checked:bg-primary-dark checked:bg-primary-dark focus:ring-0 focus:ring-offset-0 focus:outline-none focus:bg-primary-darkest active:bg-primary-dark transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer";

/**
 * Given a range compute the key if possibly matches a predefined range
 * otherwise classify as "custom"
 * @param range - Range to classify
 * @param precision - number of values after .
 */
export const classifyRangeType = (
  range?: FromToRange<number>,
  precision = 1,
): string => {
  if (range === undefined) return "custom";
  if (
    range.fromOp == ">=" &&
    range.toOp == "<" &&
    range.from !== undefined &&
    range.to !== undefined
  )
    // builds a range "key"
    return `${range.from.toFixed(precision)}-${range.to.toFixed(precision)}`;

  return "custom";
};

export const buildRangeLabelsAndValues = (
  bucketRanges: Record<string, any>,
  totalCount: number,
  rangeData?: Record<string, string | number>,
  showZero = true,
) => {
  return Object.keys(bucketRanges).reduce((b, x) => {
    if (!showZero && rangeData && rangeData[x] == 0) return b;

    b[x] = {
      ...bucketRanges[x],
      key: x,
      value: rangeData ? rangeData[x] : undefined,
      valueLabel: rangeData
        ? `${rangeData[x]?.toLocaleString()} (${(
            ((rangeData[x] as number) / totalCount) *
            100
          ).toFixed(2)}%)`
        : "",
    };
    return b;
  }, {} as Record<string, RangeBucketElement>);
};
