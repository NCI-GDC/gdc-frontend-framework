// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { coreCreateApi } from "../../coreCreateApi";
import type { Middleware, Reducer } from "@reduxjs/toolkit";
//import { PersistentCohort } from '../../../portal-proto/src/features/cohortBuilder/CohortGroup'

export interface CohortModel {
  id: string;
  name: string;
  facets?: string;
}

// base api slice is empty, endpoints will be injected via feature slices

export const cohortApiSlice = coreCreateApi({
  reducerPath: "cohortApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3500",
    prepareHeaders: async (headers) => {
      headers.set("X-Context-ID", "FAKE-UUID-FOR-TESTING-CONTEXT-HEADER");
      return headers;
    },
  }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  //tagTypes: ["Cohorts", "Cohort"],
  tagTypes: ["Cohort"],
  // endpoints: () => ({
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
      //invalidatesTags: ["Cohorts", "Cohort"],
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
      // invalidatesTags: ["Cohort"],
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
