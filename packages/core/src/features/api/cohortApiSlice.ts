// import { apiSlice } from "./apiSlice";

// export interface CohortModel {
//   id: string;
//   name: string;
//   facets?: string;
// }

// const apiWithTag = apiSlice.enhanceEndpoints({addTagTypes: ['Cohort']})

// export const cohortApiSlice = apiWithTag.injectEndpoints({
//   endpoints: (builder) => ({
//     getCohorts: builder.query<CohortModel[], void>({
//       query: () => "/cohorts",
//       providesTags: (result = [], error, arg) => [{ type: 'Cohort', arg}],
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
//       invalidatesTags: ['Cohort']
//     }),
//     editCohort: builder.mutation<
//       CohortModel,
//       { id: string; data: Partial<CohortModel> }
//     >({
//       query: (id, data) => ({
//         url: `cohorts/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: ['Cohort']
//     }),
//     deleteCohort: builder.mutation<void, { id: string }>({
//       query: (id) => ({
//         url: `cohorts/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ['Cohort']
//     })
//   }),
// })

// export const {
//   useGetCohortsQuery,
//   useGetCohortByIdQuery,
//   useAddCohortMutation,
// } = cohortApiSlice
