import { graphqlAPISlice, buildCohortGqlOperator, FilterSet } from "@gff/core";

const graphQLQuery = `
  query scRNAseqCaseCountQuery($cohortFilters: FiltersArgument,
  $CnvSegmentCaseFilter: FiltersArgument) {
  viewer {
    explore {
      CnvSegmentCaseCount : cases {
        hits(case_filters: $cohortFilters, filters: $CnvSegmentCaseFilter, first: 0) {
          total
        }
      }
    }
  }
}`;

/**
 * Injects endpoints for case counts for sequenceReads
 */
const CnvSegmentCaseCountSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    CnvSegmentCaseCount: builder.query<number, FilterSet>({
      query: (cohortFilters) => {
        const graphQLFilters = {
          cohortFilters: buildCohortGqlOperator(cohortFilters),
          CnvSegmentCaseFilter: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "available_variation_data",
                  value: ["segment_cnv"],
                },
              },
              {
                op: "not",
                content: {
                  field: "segment_cnv.segment_cnv_id",
                  //value: 'missing'
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
        response?.data?.viewer?.explore?.CnvSegmentCaseCount?.hits?.total ?? 0,
    }),
  }),
});

export const { useLazyCnvSegmentCaseCountQuery } = CnvSegmentCaseCountSlice;
