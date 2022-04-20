import { DataStatus } from "../../dataAcess";
import { isBucketsAggregation } from "../gdcapi/gdcapi";

export const convertFacetNameToGQL = (x: string) => x.replaceAll(".", "__");
export const normalizeGQLFacetName = (x: string) => x.replaceAll("__", ".");

export const buildGraphGLBucketQuery = (
  what: string,
  facetName: string,
  type = "explore",
): string => {
  const queryGQL = `
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
  return queryGQL;
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

export const processBuckets = (
  aggregations: Record<string, unknown>,
  state: { [index: string]: Record<string, unknown> },
) => {
  Object.entries(aggregations).forEach(([field, aggregation]) => {
    const normalizedField = normalizeGQLFacetName(field);
    if (isBucketsAggregation(aggregation)) {
      if (!(normalizedField in state)) {
        console.log("found:", normalizedField);
      }
      state[normalizedField].status = "fulfilled";
      state[normalizedField].buckets = aggregation.buckets.reduce(
        (facetBuckets, apiBucket) => {
          facetBuckets[apiBucket.key] = apiBucket.doc_count;
          return facetBuckets;
        },
        {} as Record<string, number>,
      );
    } else {
      // Unhandled aggregation
    }
  });
  return state;
};
