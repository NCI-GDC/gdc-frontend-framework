import { createAsyncThunk, Reducer } from "@reduxjs/toolkit";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { GqlOperation } from "../gdcapi/filters";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";
import {
  endpointSlice,
  GdcApiRequest,
  GdcApiResponse,
  ProjectDefaults,
} from "../gdcapi/gdcapi";

const graphQLQuery = `
  query ClinicalAnalysisResult(
    $filters: FiltersArgument
    $facets: [String]!
  ) {
    viewer {
      repository {
        cases {
          facets(facets: $facets, filters: $filters)
          hits(first: 0, filters: $filters) {
            total
          }
        }
      }
    }
  }
`;

export const fetchClinicalAnalysisResult = createAsyncThunk<
  GraphQLApiResponse,
  {
    filters: GqlOperation;
    facets: string[];
  },
  { dispatch: CoreDispatch; state: CoreState }
>("clinicalAnalysisResult", async ({ filters, facets }) => {
  const graphQLFilters = {
    filters,
    facets,
  };
  return await graphqlAPI(graphQLQuery, graphQLFilters);
});

/**
 *  RTK Query endpoint to fetch clinical analysis data using case_filter with the cases endpoint
 */

export const clinicalAnalysisApiSlice = endpointSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClinicalAnalysis: builder.query({
      query: (request: GdcApiRequest) => ({
        request,
        endpoint: "cases",
        fetchAll: false,
      }),
      transformResponse: (response: GdcApiResponse<ProjectDefaults>) => {
        if (response.data.aggregations) return response.data.aggregations;
        return {};
      },
    }),
  }),
});

export const { useGetClinicalAnalysisQuery } = clinicalAnalysisApiSlice;

export const clinicalAnalysisApiReducer: Reducer =
  clinicalAnalysisApiSlice.reducer as Reducer;
