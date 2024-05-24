import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { DAYS_IN_YEAR } from "../../constants";

const graphQLQuery = `
  query CohortComparison(
    $cohort1: FiltersArgument
    $cohort2: FiltersArgument
    $facets: [String]!
    $interval: Float
  ) {
    viewer {
      explore {
        cohort1: cases {
          hits(filters: $cohort1) {
            total
          }
          facets(filters: $cohort1, facets: $facets)
          aggregations(filters: $cohort1) {
            diagnoses__age_at_diagnosis {
              stats {
                min
                max
              }
              histogram(interval: $interval) {
                buckets {
                  doc_count
                  key
                }
              }
            }
          }
        }
        cohort2: cases {
          hits(filters: $cohort2) {
            total
          }
          facets(filters: $cohort2, facets: $facets)
          aggregations(filters: $cohort2) {
            diagnoses__age_at_diagnosis {
              stats {
                min
                max
              }
              histogram(interval: $interval) {
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
  }
`;

export const cohortFacetSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    cohortFacets: builder.query({
      query: ({
        facetFields,
        primaryCohortSetId,
        comparisonCohortSetId,
      }: {
        facetFields: string[];
        primaryCohortSetId: string;
        comparisonCohortSetId: string;
      }) => ({
        graphQLQuery,
        graphQLFilters: {
          cohort1: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.case_id",
                  value: [`set_id:${primaryCohortSetId}`],
                },
              },
            ],
          },
          cohort2: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "cases.case_id",
                  value: [`set_id:${comparisonCohortSetId}`],
                },
              },
            ],
          },
          facets: facetFields,
          interval: 10 * DAYS_IN_YEAR,
        },
      }),
      transformResponse: (response) => {
        const facets1 = JSON.parse(response.data.viewer.explore.cohort1.facets);
        const facets2 = JSON.parse(response.data.viewer.explore.cohort2.facets);

        facets1["diagnoses.age_at_diagnosis"] =
          response.data.viewer.explore.cohort1.aggregations.diagnoses__age_at_diagnosis.histogram;
        facets2["diagnoses.age_at_diagnosis"] =
          response.data.viewer.explore.cohort2.aggregations.diagnoses__age_at_diagnosis.histogram;

        return {
          aggregations: [facets1, facets2],
          caseCounts: [
            response.data.viewer.explore.cohort1.hits.total,
            response.data.viewer.explore.cohort2.hits.total,
          ],
        };
      },
    }),
  }),
});

export const { useCohortFacetsQuery } = cohortFacetSlice;
