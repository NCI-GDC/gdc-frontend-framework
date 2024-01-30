// This defines the middleware for the cohort API POC.

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { coreCreateApi } from "../../coreCreateApi";
import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { CohortModel, CohortAdd, CohortUpdate } from "./cohortApiTypes";
import { GDC_API } from "../../constants";

export const cohortApiSlice = coreCreateApi({
  reducerPath: "cohortApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${GDC_API}`,
    credentials: "include",
  }),
  tagTypes: ["Cohort"],
  endpoints: (builder) => ({
    getCohortsByContextId: builder.query<CohortModel[], void>({
      query: () => "/cohorts?include_case_ids=true",
      providesTags: (result = []) => [
        { type: "Cohort", id: "LIST" },
        ...result.map(({ id }) => ({ type: "Cohort" as const, id })),
      ],
    }),
    getCohortById: builder.query<CohortModel, string>({
      query: (id) => `/cohorts/${id}`,
      providesTags: (_result, _error, arg) => [{ type: "Cohort", id: arg }],
    }),
    addCohort: builder.mutation<CohortModel, CohortAdd>({
      query: ({ cohort, delete_existing }) => ({
        url: `/cohorts?delete_existing=${delete_existing}`,
        method: "POST",
        body: cohort,
      }),
      invalidatesTags: [{ type: "Cohort", id: "LIST" }],
    }),
    updateCohort: builder.mutation<CohortModel, CohortUpdate>({
      query: (cohort) => ({
        url: `/cohorts/${cohort.id}`,
        method: "PUT",
        body: {
          name: cohort.name,
          filters: cohort.filters,
          type: cohort.type,
        },
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
  }),
});

export const {
  useGetCohortsByContextIdQuery,
  useGetCohortByIdQuery,
  useAddCohortMutation,
  useUpdateCohortMutation,
  useDeleteCohortMutation,
  useLazyGetCohortByIdQuery,
} = cohortApiSlice;

export const cohortApiSliceMiddleware = cohortApiSlice.middleware as Middleware;
export const cohortApiSliceReducerPath: string = cohortApiSlice.reducerPath;
export const cohortApiReducer: Reducer = cohortApiSlice.reducer as Reducer;
