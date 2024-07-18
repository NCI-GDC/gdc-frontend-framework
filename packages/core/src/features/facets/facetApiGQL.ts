import { isBucketsAggregation, isStatsAggregation } from "../gdcapi/gdcapi";
import { GQLIndexType, GQLDocType } from "./types";
import { ERROR_UNHANDLED_AGGREGATION } from "../../constants";

export const convertFacetNameToGQL: (x: string) => string = (x: string) =>
  x.replaceAll(".", "__");
export const normalizeGQLFacetName: (x: string) => string = (x: string) =>
  x.replaceAll("__", ".");

export interface AliasedFieldQuery {
  facetName: string;
  alias?: string;
}

/**
 * Builds a GraphQL request for a set of Fields. This is an improvement on the above
 * as it requested the number of GDC API requests.
 * @param facetNames - array of \{ facetNames, and optionally an alias\}
 * @param docType - "cases" | "files" | "genes" | "projects" | "ssms" | "annotations"
 * @param index - which GraphQL index to query
 * @param useCaseFilters - whether to use case filters or not
 */
export const buildGraphGLBucketsQuery = (
  facetNames: ReadonlyArray<AliasedFieldQuery>,
  docType: GQLDocType,
  index?: GQLIndexType,
  useCaseFilters = false,
): string => {
  const queriedFacets = facetNames.map((facet: AliasedFieldQuery) => {
    return facet.alias !== undefined
      ? `${convertFacetNameToGQL(facet.alias)} : ${convertFacetNameToGQL(
          facet.facetName,
        )}`
      : convertFacetNameToGQL(facet.facetName);
  });

  if (index === undefined)
    return `
    query QueryBucketCounts($caseFilters: FiltersArgument, $filters: FiltersArgument) {
     viewer {
             ${docType} {
              aggregations(
                case_filters: $caseFilters,
                filters:$filters,
                aggregations_filter_themselves: false
              ) {
                 ${queriedFacets
                   .map((x) => {
                     return x + "{buckets { doc_count key }}";
                   })
                   .join(", ")}
                }
           }
        }
     }`;
  else
    return `query QueryBucketCounts(${
      useCaseFilters ? "$case_filters: FiltersArgument, " : ""
    }$filters: FiltersArgument) {
      viewer {
          ${index} {
            ${docType} {
              aggregations(
                ${useCaseFilters ? "case_filters: $case_filters," : ""}
                filters:$filters,
                aggregations_filter_themselves: false
              ) {
                 ${queriedFacets
                   .map((x) => {
                     return x + "{buckets { doc_count key }}";
                   })
                   .join(", ")}
              }
            }
          }
        }
      }
  `;
};

/**
 * Defines the function signature for Processing GQL Aggregation Responses
 * into FacetBuckets
 */
export type ProcessBucketsFunction = (
  requestId: string,
  aggregations: Record<string, unknown>,
  state: {
    [index: string]: Record<string, unknown>;
  },
) => {
  [index: string]: Record<string, unknown>;
};

export const processBuckets: ProcessBucketsFunction = (
  requestId: string,
  aggregations: Record<string, unknown>,
  state: { [index: string]: Record<string, unknown> },
) => {
  Object.entries(aggregations).forEach(([field, aggregation]) => {
    const normalizedField = normalizeGQLFacetName(field);
    if (isBucketsAggregation(aggregation)) {
      if (!(normalizedField in state)) {
        console.log("processBuckets: field is unexpected:", normalizedField); //TODO: remove this once confirm this is no longer a problem
      }

      if (state[normalizedField].requestId !== requestId) {
        return;
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
      state[normalizedField].status = "fulfilled";
      state[normalizedField].error = ERROR_UNHANDLED_AGGREGATION;
    }
  });
  return state;
};
