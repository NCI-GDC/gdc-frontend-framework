import { graphqlAPISlice } from "../../gdcapi/gdcgraphql";
import { buildCohortGqlOperator, FilterSet } from "../../cohort";

const graphQLQuery = `
  query countsQuery($filters: FiltersArgument,
  $sequenceReadsCaseFilter: FiltersArgument) {
  viewer {
    repository {
      sequenceReads : cases {
        hits(filters: $sequenceReadsCaseFilter, case_filters: $filters, first: 0) {
          total
        }
      }
    }
  }
}`;

const sequenceReadCaseCountSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    sequenceReadCaseCounts: builder.query<number, FilterSet>({
      query: (cohortFilters) => {
        const graphQLFilters = {
          filters: buildCohortGqlOperator(cohortFilters),
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

export const { useLazySequenceReadCaseCountsQuery } =
  sequenceReadCaseCountSlice;
