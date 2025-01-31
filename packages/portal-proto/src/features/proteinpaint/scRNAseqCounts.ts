import { graphqlAPISlice, buildCohortGqlOperator, FilterSet } from "@gff/core";

const graphQLQuery = `
  query scRNAseqFileCountQuery($cohortFilters: FiltersArgument,
  $scRNAseqFileFilter: FiltersArgument) {
  viewer {
    explore {
      scRNAseqFileCount : cases {
        hits(case_filters: $cohortFilters, filters: $scRNAseqFileFilter, first: 0) {
          total
        }
      }
    }
  }
}`;

/**
 * Injects endpoints for case counts for sequenceReads
 */
const scRNAseqFileCountSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    scRNAseqFileCount: builder.query<number, FilterSet>({
      query: (cohortFilters) => {
        const graphQLFilters = {
          cohortFilters: buildCohortGqlOperator(cohortFilters),
          scRNAseqFileFilter: {
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
        response?.data?.viewer?.explore?.scRNAseqFileCount?.hits?.total ?? 0,
    }),
  }),
});

export const { useLazyScRNAseqFileCountQuery } = scRNAseqFileCountSlice;
