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

export const apiSlice = coreCreateApi({
  reducerPath: "pocCohortApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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
    }),
    addCohort: builder.mutation<CohortModel, CohortModel>({
      query: (cohort) => ({
        url: "/cohorts",
        method: "POST",
        body: cohort,
      }),
      invalidatesTags: ["Cohort"],
    }),
    editCohort: builder.mutation<
      CohortModel,
      { id: string; data: Partial<CohortModel> }
    >({
      query: (id, data) => ({
        url: `cohorts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Cohort"],
    }),
    deleteCohort: builder.mutation<void, { id: string }>({
      query: (id) => ({
        url: `cohorts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cohort"],
    }),
  }),
});

export const {
  useGetCohortsQuery,
  useGetCohortByIdQuery,
  useAddCohortMutation,
  useEditCohortMutation,
  useDeleteCohortMutation,
} = apiSlice;

export const apiSliceMiddleware = apiSlice.middleware as Middleware;
export const apiSliceReducerPath: string = apiSlice.reducerPath;
export const apiReducer: Reducer = apiSlice.reducer as Reducer;
