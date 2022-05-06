import { DataStatus } from "../../dataAcess";
import { isBucketsAggregation, isStatsAggregation } from "../gdcapi/gdcapi";

export const convertFacetNameToGQL: (x: string) => string = (x: string) =>
  x.replaceAll(".", "__");
export const normalizeGQLFacetName: (x: string) => string = (x: string) =>
  x.replaceAll("__", ".");

export const buildGraphGLBucketQuery = (
  what: string,
  facetName: string,
  type = "explore",
): string => {
  return `
  query QueryBucketCounts($filters_0: FiltersArgument!) {
      viewer {
          ${type} {
            ${what} {
              aggregations(
                filters: $filters_0
                aggregations_filter_themselves: false
              ) {
                ${convertFacetNameToGQL(facetName)} {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
            }
          }
        }
      }
  `;
};

export interface BucketCountsQueryProps {
  readonly type: string;
  readonly what: string;
  readonly facetName: string;
}

export interface FacetBuckets {
  readonly status: DataStatus;
  readonly error?: string;
  readonly buckets?: Record<string, number>;
}

export type processBuckets = (
  aggregations: Record<string, unknown>,
  state: {
    [index: string]: Record<string, unknown>;
  },
) => {
  [index: string]: Record<string, unknown>;
};

export const processBuckets: processBuckets = (
  aggregations: Record<string, unknown>,
  state: { [index: string]: Record<string, unknown> },
) => {
  Object.entries(aggregations).forEach(([field, aggregation]) => {
    const normalizedField = normalizeGQLFacetName(field);
    if (isBucketsAggregation(aggregation)) {
      if (!(normalizedField in state)) {
        console.log("processBuckets: field is unexpected:", normalizedField); //TODO: remove this once confirm this is no longer a problem
      }
      state[normalizedField].status = "fulfilled";
      state[normalizedField].buckets = aggregation.buckets.reduce(
        (facetBuckets, apiBucket) => {
          facetBuckets[apiBucket.key] = apiBucket.doc_count;
          return facetBuckets;
        },
        {} as Record<string, number>,
      );
    } else if (isStatsAggregation(aggregation)) {
      //TODO: This seems dependent on the type of
      //  the facet, which is not known here
      state[normalizedField].status = "fulfilled";
      state[normalizedField].buckets = {
        count: aggregation.stats.count,
      };
    } else {
      // Unhandled aggregation
    }
  });
  return state;
};
