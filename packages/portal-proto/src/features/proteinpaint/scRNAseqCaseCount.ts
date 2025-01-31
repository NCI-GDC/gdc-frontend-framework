import { graphqlAPISlice, buildCohortGqlOperator, FilterSet } from "@gff/core";

const graphQLQuery = `
  query scRNAseqCaseCountQuery($cohortFilters: FiltersArgument,
  $scRNAseqCaseFilter: FiltersArgument) {
  viewer {
    explore {
      scRNAseqCaseCount : cases {
        hits(case_filters: $cohortFilters, filters: $scRNAseqCaseFilter, first: 0) {
          total
        }
      }
    }
  }
}`;

/**
 * Injects endpoints for case counts for sequenceReads
 */
const scRNAseqCaseCountSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    scRNAseqCaseCount: builder.query<number, FilterSet>({
      query: (cohortFilters) => {
        const graphQLFilters = {
          cohortFilters: buildCohortGqlOperator(cohortFilters),
          scRNAseqCaseFilter: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "files.data_format",
                  value: "tsv",
                },
              },
              {
                op: "in",
                content: {
                  field: "files.data_type",
                  value: "Single Cell Analysis",
                },
              },
              {
                op: "in",
                content: {
                  field: "files.experimental_strategy",
                  value: ["scRNA-Seq"],
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
        response?.data?.viewer?.explore?.scRNAseqCaseCount?.hits?.total ?? 0,
    }),
  }),
});

export const { useLazyScRNAseqCaseCountQuery } = scRNAseqCaseCountSlice;
