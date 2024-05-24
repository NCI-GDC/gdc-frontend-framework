import { graphqlAPISlice } from "../../gdcapi/gdcgraphql";
import { buildCohortGqlOperator, FilterSet } from "../../cohort";

const graphQLQuery = `
  query mafFileCountQuery($cohortFilters: FiltersArgument,
  $mafFileFilter: FiltersArgument) {
  viewer {
    explore {
      mafFileCount : cases {
        hits(case_filters: $cohortFilters, filters: $mafFileFilter, first: 0) {
          total
        }
      }
    }
  }
}`;

/**
 * Injects endpoints for case counts for sequenceReads
 */
const mafFileCountSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    mafFileCount: builder.query<number, FilterSet>({
      query: (cohortFilters) => {
        const graphQLFilters = {
          cohortFilters: buildCohortGqlOperator(cohortFilters),
          mafFileFilter: {
            op: "and",
            content: [
              {
                op: "in",
                content: {
                  field: "files.data_format",
                  value: "maf",
                },
              },
              {
                op: "in",
                content: {
                  field: "files.experimental_strategy",
                  value: ["WXS", "Targeted Sequencing"],
                },
              },
              {
                op: "in",
                content: {
                  field: "files.analysis.workflow_type",
                  value: "Aliquot Ensemble Somatic Variant Merging and Masking",
                },
              },
              {
                op: "in",
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
        response?.data?.viewer?.explore?.mafFileCount?.hits?.total ?? 0,
    }),
  }),
});

export const { useLazyMafFileCountQuery } = mafFileCountSlice;
