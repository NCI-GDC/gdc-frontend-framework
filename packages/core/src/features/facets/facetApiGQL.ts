import { isBucketsAggregation, isStatsAggregation } from "../gdcapi/gdcapi";
import { GQLIndexType, GQLDocType } from "./types";

export const convertFacetNameToGQL: (x: string) => string = (x: string) =>
  x.replaceAll(".", "__");
export const normalizeGQLFacetName: (x: string) => string = (x: string) =>
  x.replaceAll("__", ".");

/**
 * Builds a GraphQL request
 * @param facetName - name of the facet
 * @param docType - "cases" | "files" | "genes" | "projects" | "ssms"
 * @param index - which GraphQL index to query
 */
export const buildGraphGLBucketQuery = (
  facetName: string,
  docType: GQLDocType,
  index: GQLIndexType = "explore",
  alias?: string,
): string => {
  const queriedFacet =
    alias !== undefined
      ? `${convertFacetNameToGQL(alias)} : ${convertFacetNameToGQL(facetName)}`
      : convertFacetNameToGQL(facetName);

  if (docType == "projects")
    return `
    query QueryBucketCounts($caseFilters: FiltersArgument, $filters: FiltersArgument) {
     viewer {
             ${docType} {
              aggregations(
                case_filters: $caseFilters
                filters:$filters
                aggregations_filter_themselves: false
              ) {
                  ${queriedFacet} {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
            }
       }
     }`;
  else
    return `query QueryBucketCounts($caseFilters: FiltersArgument, $filters: FiltersArgument) {
      viewer {
          ${index} {
            ${docType} {
              aggregations(
                case_filters: $caseFilters
                filters:$filters
                aggregations_filter_themselves: false
              ) {
                ${queriedFacet} {
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

export interface AliasedFieldQuery {
  facetName: string;
  alias?: string;
}

/**
 * Builds a GraphQL request for a set of Fields. This is an improvement on the above
 * as it requested the number of GDC API requests.
 * @param facetNames - array of { facetNames, and optionally an alias}
 * @param docType - "cases" | "files" | "genes" | "projects" | "ssms"
 * @param index - which GraphQL index to query
 */
export const buildGraphGLBucketsQuery = (
  facetNames: ReadonlyArray<AliasedFieldQuery>,
  docType: GQLDocType,
  index: GQLIndexType = "explore",
): string => {
  const queriedFacets = facetNames.map((facet: AliasedFieldQuery) => {
    return facet.alias !== undefined
      ? `${convertFacetNameToGQL(facet.alias)} : ${convertFacetNameToGQL(
          facet.facetName,
        )}`
      : convertFacetNameToGQL(facet.facetName);
  });

  if (docType == "projects")
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
    return `query QueryBucketCounts($caseFilters: FiltersArgument, $filters: FiltersArgument) {
      viewer {
          ${index} {
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
        }
      }
  `;
};

/**
 * Defines the function signature for Processing GQL Aggregation Responses
 * into FacetBuckets
 */
export type ProcessBucketsFunction = (
  aggregations: Record<string, unknown>,
  state: {
    [index: string]: Record<string, unknown>;
  },
) => {
  [index: string]: Record<string, unknown>;
};

export const processBuckets: ProcessBucketsFunction = (
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
