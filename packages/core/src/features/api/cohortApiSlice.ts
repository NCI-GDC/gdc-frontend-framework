// import { apiSlice } from "./apiSlice";

// export interface CohortModel {
//   id: string;
//   name: string;
//   facets?: string;
// }

// //const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Cohort']})

// export const cohortApiSlice = apiSlice.injectEndpoints({
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
//   }),
// })

// export const {
//   useGetCohortsQuery,
//   useGetCohortByIdQuery,
//   useAddCohortMutation,
// } = cohortApiSlice
