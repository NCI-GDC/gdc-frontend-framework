// This defines the middleware for the cohort API POC.

// For this slice to work, the mock cohort api must be started. To do this from
// the project root run the following command: node data/cohort-api-server.js

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { coreCreateApi } from "../../coreCreateApi";
import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { useCookies } from "react-cookie";

export interface CohortModel {
  id: string;
  name: string;
  facets?: string;
}

export const cohortApiSlice = coreCreateApi({
  reducerPath: "cohortApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3500",
    prepareHeaders: async (headers) => {
      headers.set("X-Context-ID", "FAKE-UUID-FOR-TESTING-CONTEXT-HEADER");
      return headers;
    },
    credentials: "include",
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  tagTypes: ["Cohort"],
  endpoints: (builder) => ({
    getCohorts: builder.query<CohortModel[], void>({
      query: () => "/cohorts",
      providesTags: (result = [], error, arg) => [
        "Cohort",
        ...result.map(({ id }) => ({ type: "Cohort", id })),
      ],
    }),
    getCohortById: builder.query<CohortModel, string>({
      query: (id) => `/cohorts/${id}`,
      providesTags: (result, error, arg) => [{ type: "Cohort", id: arg }],
    }),
    addCohort: builder.mutation<CohortModel, CohortModel>({
      query: (cohort) => ({
        url: "/cohorts",
        method: "POST",
        body: cohort,
      }),
      invalidatesTags: ["Cohort"],
    }),
    updateCohort: builder.mutation<CohortModel, CohortModel>({
      query: (cohort) => ({
        url: `/cohorts/${cohort.id}`,
        method: "PATCH",
        body: cohort,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Cohort", id: arg.id }],
    }),
    deleteCohort: builder.mutation<void, { id: string }>({
      query: (id) => ({
        url: `/cohorts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Cohort", id: arg }],
    }),
  }),
});

export const {
  useGetCohortsQuery,
  useGetCohortByIdQuery,
  useAddCohortMutation,
  useUpdateCohortMutation,
  useDeleteCohortMutation,
} = cohortApiSlice;

export const cohortApiSliceMiddleware = cohortApiSlice.middleware as Middleware;
export const cohortApiSliceReducerPath: string = cohortApiSlice.reducerPath;
export const cohortApiReducer: Reducer = cohortApiSlice.reducer as Reducer;
