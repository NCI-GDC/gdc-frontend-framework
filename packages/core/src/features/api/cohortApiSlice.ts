// This isn't working. I think the problem is that this causes endpoints to be injected
// at runtime but for pages to use this functionality they import from the compiled
// library @gff/core which won't have this. Attempting to import directly from this file
// doesn't seem to work

// import { apiSlice } from "./apiSlice";
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
// import { coreCreateApi } from "../../coreCreateApi";

// export interface CohortModel {
//   id: string;
//   name: string;
//   facets?: string;
// }

// //const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Cohort']})

// export const cohortApiSlice = apiSlice.injectEndpoints({
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   endpoints: (builder) => ({
//     getCohorts: builder.query<CohortModel[], void>({
//       query: () => "/cohorts",
//     }),
//     getCohortById: builder.query<CohortModel, string>({
//       query: (id) => `/cohorts/${id}`,
//     }),
//     addCohort: builder.mutation<CohortModel, CohortModel>({
//       query: (cohort) => ({
//         url: "/cohorts",
//         method: "POST",
//         body: cohort,
//       }),
//     }),
//     updateCohort: builder.mutation<CohortModel, CohortModel>({
//       query: (cohort) => ({
//         url: `/cohorts/${cohort.id}`,
//         method: "PATCH",
//         body: cohort,
//       }),
//     }),
//     deleteCohort: builder.mutation<void, { id: string }>({
//       query: (id) => ({
//         url: `/cohorts/${id}`,
//         method: "DELETE",
//       }),
//     }),
//   }),
// })

// export const {
//   useGetCohortsQuery,
//   useGetCohortByIdQuery,
//   useAddCohortMutation,
//   useUpdateCohortMutation,
//   useDeleteCohortMutation,
// } = cohortApiSlice
