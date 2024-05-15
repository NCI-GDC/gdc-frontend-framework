import { graphqlAPISlice } from "../../gdcapi/gdcgraphql";
import { buildCohortGqlOperator, FilterSet } from "../../cohort";

const graphQLQuery = `
  query sequenceReadCaseCountQuery($cohortFilters: FiltersArgument,
  $sequenceReadsCaseFilter: FiltersArgument) {
  viewer {
    repository {
      sequenceReads : cases {
        hits(filters: $sequenceReadsCaseFilter, case_filters: $cohortFilters, first: 0) {
          total
        }
      }
    }
  }
}`;

/**
 * Injects endpoints for case counts for sequenceReads
 */
const sequenceReadCaseCountSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    sequenceReadCaseCount: builder.query<number, FilterSet>({
      query: (cohortFilters) => {
        const graphQLFilters = {
          cohortFilters: buildCohortGqlOperator(cohortFilters),
          sequenceReadsCaseFilter: {
            op: "and",
            content: [
              {
                op: "=",
                content: {
                  field: "files.index_files.data_format",
                  value: "bai",
                },
              },
              {
                op: "=",
                content: {
                  field: "files.data_type",
                  value: "Aligned Reads",
                },
              },
              {
                op: "=",
                content: {
                  field: "files.data_format",
                  value: "bam",
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
        response?.data?.viewer?.repository?.sequenceReads?.hits?.total ?? 0,
    }),
  }),
});

export const { useLazySequenceReadCaseCountQuery } = sequenceReadCaseCountSlice;
