import { omitBy, some, capitalize } from "lodash";
import { NumericFromTo, Buckets, Stats } from "@gff/core";
import { CAPITALIZED_TERMS, SPECIAL_CASE_FIELDS } from "./constants";
import { CustomInterval, NamedFromTo } from "./types";

export const filterUsefulFacets = (
  facets: Record<string, Buckets | Stats>,
): Record<string, Buckets | Stats> => {
  return omitBy(facets, (aggregation) =>
    some([
      (aggregation as Buckets).buckets &&
        (aggregation as Buckets).buckets.filter(
          (bucket) => bucket.key !== "_missing",
        ).length === 0,
      (aggregation as Stats).stats && (aggregation as Stats).stats.count === 0,
    ]),
  );
};

export const createBuckets = (
  min: number,
  max: number,
  customInterval?: number,
): NumericFromTo[] => {
  if (min === max) {
    return [{ from: min, to: max + 1 }];
  }

  const numBuckets = customInterval
    ? Math.floor((max - min) / customInterval)
    : 5;
  const interval = customInterval ? customInterval : (max - min) / 5;

  return Array.from({ length: numBuckets }, (_, i) => ({
    from: i * interval + min,
    to:
      i + 1 === numBuckets
        ? customInterval
          ? max
          : max + 1
        : min + (i + 1) * interval,
  }));
};

export const toDisplayName = (field: string): string => {
  const parsed = field.split(".");
  const fieldName = parsed.at(-1);

  if (SPECIAL_CASE_FIELDS[fieldName]) {
    return SPECIAL_CASE_FIELDS[fieldName];
  }

  return fieldName
    .split("_")
    .map((w) =>
      CAPITALIZED_TERMS.includes(w) ? w.toUpperCase() : capitalize(w),
    )
    .join(" ");
};

export const parseFieldName = (
  field: string,
): { field_type: string; field_name: string; full: string } => {
  const parsed = field.split("__");
  const full = field.replaceAll("__", ".");
  if (parsed.at(-2) === "treatments") {
    return { field_type: parsed.at(-2), field_name: parsed.at(-1), full };
  }
  return { field_type: parsed.at(0), field_name: parsed.at(-1), full };
};

export const parseContinuousBucket = (bucket: string): string[] => {
  return bucket
    .split("-")
    .map((val, idx, src) => (src[idx - 1] === "" ? `-${val}` : val))
    .filter((val) => val !== "");
};

export const flattenBinnedData = (
  binnedData: Record<string, number | Record<string, number>>,
): Record<string, number> => {
  const flattenedValues = {};

  Object.entries(binnedData).forEach(([k, v]) => {
    if (Number.isInteger(v)) {
      flattenedValues[k] = v;
    } else {
      flattenedValues[k] = Object.values(v).reduce((a, b) => a + b);
    }
  });

  return flattenedValues;
};

export const isInterval = (
  customBinnedData: NamedFromTo[] | CustomInterval,
): customBinnedData is CustomInterval => {
  if (!Array.isArray(customBinnedData) && customBinnedData?.interval) {
    return true;
  }

  return false;
};

/**
 * Allows you to find the quantile (percentile) Q for any probability p
 * from https://rangevoting.org/Qnorm.html
 * @param p
 * @returns
 */
export const qnorm = (p: number): number => {
  // ALGORITHM AS 111, APPL.STATIST., VOL.26, 118-121, 1977.
  // Computes z = invNorm(p)

  const split = 0.42;

  const a0 = 2.50662823884;
  const a1 = -18.61500062529;
  const a2 = 41.39119773534;
  const a3 = -25.44106049637;
  const b1 = -8.4735109309;
  const b2 = 23.08336743743;
  const b3 = -21.06224101826;
  const b4 = 3.13082909833;
  const c0 = -2.78718931138;
  const c1 = -2.29796479134;
  const c2 = 4.85014127135;
  const c3 = 2.32121276858;
  const d1 = 3.54388924762;
  const d2 = 1.63706781897;

  const q = p - 0.5;

  let r: number;
  let ppnd: number;

  if (Math.abs(q) <= split) {
    r = q * q;
    ppnd =
      (q * (((a3 * r + a2) * r + a1) * r + a0)) /
      ((((b4 * r + b3) * r + b2) * r + b1) * r + 1);
  } else {
    r = p;
    if (q > 0) r = 1 - p;
    if (r > 0) {
      r = Math.sqrt(-Math.log(r));
      ppnd = (((c3 * r + c2) * r + c1) * r + c0) / ((d2 * r + d1) * r + 1);
      if (q < 0) ppnd = -ppnd;
    } else {
      ppnd = 0;
    }
  }

  return ppnd;
};
