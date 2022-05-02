// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { coreCreateApi } from "../../api";
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
    getCohorts: builder.query<string, void>({
      query: () => "/cohorts",
    }),
    getCohortById: builder.query<CohortModel, string>({
      query: (id) => `/cohorts/${id}`,
    }),
    // getCohortByName: builder.query<string, string>({
    //   query: (name) => `/cohorts/${name}`,
    // }),
  }),
});

export const {
  useGetCohortsQuery,
  useGetCohortByIdQuery,
  // useGetCohortByNameQuery,
} = apiSlice;
