import { graphqlAPISlice } from "../../gdcapi/gdcgraphql";
import { buildCohortGqlOperator, FilterSet } from "../../cohort";

const graphQLQuery = `
  query geneExpressionCountQuery($cohortFilters: FiltersArgument,
  $geneExpressionFilter: FiltersArgument) {
  viewer {
    repository {
      geneExpression : cases {
        hits(filters: $geneExpressionFilter, case_filters: $cohortFilters, first: 0) {
          total
        }
      }
    }
  }
}`;

/**
 * Injects endpoints for case counts for sequenceReads
 */
const geneExpressionCaseCountSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    geneExpressionCaseCount: builder.query<number, FilterSet>({
      query: (cohortFilters) => {
        const graphQLFilters = {
          cohortFilters: buildCohortGqlOperator(cohortFilters),
          geneExpressionFilter: {
            op: "and",
            content: [
              {
                op: "=",
                content: {
                  field: "files.analysis.workflow_type",
                  value: "STAR - Counts",
                },
              },
              {
                op: "=",
                content: {
                  field: "files.access",
                  value: "open",
                },
              },
            ],
          },
        };
        return {
          graphQLFilters,
          graphQLQuery,
        };
      },
      transformResponse: (response) =>
        response?.data?.viewer?.repository?.geneExpression?.hits?.total ?? 0,
    }),
  }),
});

export const { useLazyGeneExpressionCaseCountQuery } =
  geneExpressionCaseCountSlice;
