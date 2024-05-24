import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { GqlOperation } from "../gdcapi/filters";

const graphQLQuery = `query Queries($caseFilters: FiltersArgument, $filters: FiltersArgument) {
  viewer {
    cart_summary {
      aggregations(case_filters: $caseFilters, filters: $filters) {
        fs {
          value
        }
      }
    }
    repository {
      cases {
          hits(case_filters: $caseFilters, filters: $filters, first: 0) {
            total
          }
        }
    }
  }
}`;

interface TotalFileSizeRequest {
  cohortFilters?: GqlOperation; // filters for the cohort
  localFilters?: GqlOperation; // filters for the repository
}

export interface FilesSizeData {
  total_file_size: number;
  total_case_count: number;
}

const totalFileSizeSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    totalFileSize: builder.query<FilesSizeData, TotalFileSizeRequest>({
      query: ({ cohortFilters, localFilters }) => {
        const graphQLFilters = {
          filters: localFilters ?? {},
          caseFilters: cohortFilters ?? {},
        };
        return { graphQLQuery, graphQLFilters };
      },
      transformResponse: (response) => ({
        total_file_size:
          response?.data?.viewer?.cart_summary?.aggregations.fs?.value,
        total_case_count:
          response?.data?.viewer?.repository?.cases?.hits?.total,
      }),
    }),
  }),
});

export const { useTotalFileSizeQuery } = totalFileSizeSlice;
