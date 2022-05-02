// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { coreCreateApi } from "../../api";
import type { Middleware, Reducer } from "@reduxjs/toolkit";
//import { CohortModel } from './cohort.model'
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
  // baseQuery: async (baseUrl, prepareHeaders, ...rest) => {
  //   const response = await fetch(`http://localhost:3500/${baseUrl}`, rest)
  //   return {data: await response.json()}
  // },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  endpoints: (builder) => ({
    //getCohorts: builder.query<PersistentCohort[], void>({
    getCohorts: builder.query<CohortModel[], void>({
      query: () => "/cohorts",
    }),
    //getCohortById: builder.query<CohortModel, string>({
    getCohortById: builder.query<CohortModel, string>({
      query: (id) => `/cohorts/${id}`,
    }),
    addCohort: builder.mutation<CohortModel, CohortModel>({
      query: (cohort) => ({
        url: "/cohorts",
        method: "POST",
        body: cohort,
      }),
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
    }),
    // getCohortByName: builder.query<string, string>({
    //   query: (name) => `/cohorts/${name}`,
    // }),
  }),
});

export const {
  useGetCohortsQuery,
  useGetCohortByIdQuery,
  useAddCohortMutation,
  useEditCohortMutation,
} = apiSlice;

export const apiSliceMiddleware = apiSlice.middleware as Middleware;
export const apiSliceReducerPath: string = apiSlice.reducerPath;
export const apiReducer: Reducer = apiSlice.reducer as Reducer;
