import { Reducer } from "@reduxjs/toolkit";
import { GdcApiRequest, GdcApiResponse } from "../gdcapi/types";
import { ProjectDefaults } from "../gdcapi/types";
import { endpointSlice } from "../gdcapi";

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
