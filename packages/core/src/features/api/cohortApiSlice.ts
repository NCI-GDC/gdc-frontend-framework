// This defines the middleware for the cohort API POC.

// For this slice to work, the mock cohort api must be started. See
// data/cohort-api-server.js for additional details.

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { coreCreateApi } from "../../coreCreateApi";
import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { CohortModel, ContextModel } from "./cohortApiTypes";

export const cohortApiSlice = coreCreateApi({
  reducerPath: "cohortApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3500",
    prepareHeaders: async (headers) => {
      headers.set("X-Context-ID", "FAKE-UUID-FOR-TESTING-CONTEXT-HEADER-BAD");
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Cohort", "Context"],
  endpoints: (builder) => ({
    // cohort endpoints
    getCohorts: builder.query<CohortModel[], void>({
      query: () => "/cohorts",
      providesTags: (result = []) => [
        //"Cohort",
        { type: "Cohort", id: "LIST" },
        ...result.map(({ id }) => ({ type: "Cohort" as const, id })),
      ],
    }),
    getCohortsByContextId: builder.query<CohortModel[], string>({
      query: (context_id) => `/cohorts?context_id=${context_id}`,
      providesTags: (result = []) => [
        { type: "Cohort", id: "LIST" },
        ...result.map(({ id }) => ({ type: "Cohort" as const, id })),
      ],
    }),
    getCohortById: builder.query<CohortModel, string>({
      query: (id) => `/cohorts/${id}`,
      providesTags: (_result, _error, arg) => [{ type: "Cohort", id: arg }],
    }),
    addCohort: builder.mutation<CohortModel, Partial<CohortModel>>({
      query: (cohort) => ({
        url: "/cohorts",
        method: "POST",
        body: cohort,
      }),
      invalidatesTags: [{ type: "Cohort", id: "LIST" }],
    }),
    updateCohort: builder.mutation<CohortModel, Partial<CohortModel>>({
      query: (cohort) => ({
        url: `/cohorts/${cohort.id}`,
        method: "PATCH",
        body: cohort,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Cohort", id: arg.id },
      ],
    }),
    deleteCohort: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cohorts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Cohort", id: arg }],
    }),

    // context endpoints
    getContexts: builder.query<ContextModel[], void>({
      query: () => "/contexts",
      providesTags: (result = []) => [
        { type: "Context", id: "LIST" },
        ...result.map(({ id }) => ({ type: "Context" as const, id })),
      ],
    }),
    getContextById: builder.query<ContextModel, string>({
      query: (id) => `/contexts/${id}`,
      providesTags: (_result, _error, arg) => [{ type: "Context", id: arg }],
    }),
    addContext: builder.mutation<ContextModel, void>({
      query: () => ({
        url: "/contexts",
        method: "POST",
      }),
      invalidatesTags: [{ type: "Context", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCohortsQuery,
  useGetCohortsByContextIdQuery,
  useGetCohortByIdQuery,
  useAddCohortMutation,
  useUpdateCohortMutation,
  useDeleteCohortMutation,
  useGetContextsQuery,
  useGetContextByIdQuery,
  useAddContextMutation,
} = cohortApiSlice;

export const cohortApiSliceMiddleware = cohortApiSlice.middleware as Middleware;
export const cohortApiSliceReducerPath: string = cohortApiSlice.reducerPath;
export const cohortApiReducer: Reducer = cohortApiSlice.reducer as Reducer;
