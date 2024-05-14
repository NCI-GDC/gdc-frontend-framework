import { Middleware, Reducer } from "@reduxjs/toolkit";
import { endpointSlice, GdcApiRequest, GdcApiResponse } from "../gdcapi/gdcapi";
import { ProjectDefaults } from "../gdcapi/types";

export const projectsApiSlice = endpointSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (request: GdcApiRequest) => ({
        request,
        endpoint: "projects",
        fetchAll: false,
      }),
      transformResponse: (response: GdcApiResponse<ProjectDefaults>) => {
        if (response.data.hits)
          return {
            projectData: [...response.data.hits],
            pagination: response.data.pagination,
          };
        return {
          projectData: undefined,
        };
      },
    }),
  }),
});

export const { useGetProjectsQuery } = projectsApiSlice;

export const projectApiSliceMiddleware =
  projectsApiSlice.middleware as Middleware;
export const projectsApiSliceReducerPath: string = projectsApiSlice.reducerPath;
export const projectsApiReducer: Reducer = projectsApiSlice.reducer as Reducer;
