import { omitBy, some, capitalize } from "lodash";
import {
  NumericFromTo,
  Buckets,
  Stats,
  GqlOperation,
  GqlUnion,
  GqlIntersection,
} from "@gff/core";
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
 * Flatten nested ands into a root level and.
 * This is necessary because the GDC GraphQL API does not appear to support nested ands
 * for this type of query.
 * @param filters
 */
export const flattenIfNestedAndOr = (filters: GqlOperation): GqlOperation => {
  // if there are no filters, return;
  if (filters === undefined) return filters;
  const root = filters as GqlUnion | GqlIntersection;
  if (root.content.length == 0) return filters;
  // if the child is an and,or, flatten it
  return root.content.reduce(
    (acc: GqlIntersection, cur: GqlOperation) => {
      if (cur.op === "and" || cur.op === "or") {
        return {
          op: "and",
          content: [...acc.content, ...cur.content],
        };
      }
      return {
        // if the child is not an and,or, just add it to the list
        op: "and",
        content: [...acc.content, cur],
      };
    },
    { op: "and", content: [] },
  );
};
