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
                op: "in",
                content: {
                  field: "files.analysis.workflow_type",
                  value: ["sequence_read"],
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
        response?.data?.viewer?.repository?.sequenceReads?.hits?.total ?? -1,
    }),
  }),
});

export const { useSequenceReadCaseCountsQuery } = sequenceReadCaseCountSlice;
