/**
 * Types and functions to support continuous Aggregations for numeric range data
 */

import { Buckets, Stats } from "../gdcapi/gdcapi";
import { normalizeGQLFacetName, ProcessBucketsFunction } from "./facetApiGQL";
import { isObject } from "../../ts-utils";

export interface RangeBuckets extends Stats {
  readonly range: Buckets;
}

/**
 * Returns true if aggregation object contains both a range and a stats member.
 * Is a typescript validating function for RangeBucket type
 * @param aggregation - object to test
 * @returns true if object has the members needed for RangeBucket
 */
export const isRangeBucketsAggregation = (
  aggregation: unknown,
): aggregation is RangeBuckets => {
  return (
    isObject(aggregation) && "range" in aggregation && "stats" in aggregation
  );
};

export const processRangeResults: ProcessBucketsFunction = (
  aggregations: Record<string, unknown>,
  state: { [index: string]: Record<string, unknown> },
) => {
  Object.entries(aggregations).forEach(([field, aggregation]) => {
    const normalizedField = normalizeGQLFacetName(field);
    if (isRangeBucketsAggregation(aggregation)) {
      state[normalizedField].status = "fulfilled";
      state[normalizedField].stats = aggregation.stats;
      state[normalizedField].buckets = aggregation.range.buckets.reduce(
        (facetBuckets, apiBucket) => {
          facetBuckets[apiBucket.key] = apiBucket.doc_count;
          return facetBuckets;
        },
        {} as Record<string, number>,
      );
    } else {
      // Unhandled aggregation
      // TODO: this smells and should at least be logged.
    }
  });
  return state;
};
