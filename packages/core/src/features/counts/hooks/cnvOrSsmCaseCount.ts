import { graphqlAPISlice } from "../../gdcapi/gdcgraphql";
import { buildCohortGqlOperator, FilterSet, joinFilters } from "../../cohort";

const graphQLQuery = `
  query cnvOrSsmCaseCountQuery($ssmCaseFilter: FiltersArgument) {
  viewer {
    explore {
      cnvsOrSsmsCases : cases {
        hits(case_filters: $ssmCaseFilter, first: 0) {
          total
        }
      }
    }
  }
}`;

/**
 * Injects endpoints for case counts for ssmsCounts
 */
const cnvOrSsmCaseCount = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    cnvOrSsmCaseCount: builder.query<number, FilterSet>({
      query: (cohortFilters) => {
        const graphQLFilters = {
          ssmCaseFilter: buildCohortGqlOperator(
            joinFilters(cohortFilters ?? { mode: "and", root: {} }, {
              mode: "and",
              root: {
                "cases.available_variation_data": {
                  operator: "includes",
                  field: "cases.available_variation_data",
                  operands: ["ssm", "cnv"],
                },
              },
            }),
          ),
        };
        return {
          graphQLFilters,
          graphQLQuery,
        };
      },
      transformResponse: (response) =>
        response?.data?.viewer?.explore?.cnvsOrSsmsCases?.hits?.total ?? 0,
    }),
  }),
});

export const { useLazyCnvOrSsmCaseCountQuery } = cnvOrSsmCaseCount;
