import { Middleware, Reducer } from "@reduxjs/toolkit";
import { coreCreateApi } from "src/coreCreateApi";
import { GDC_APP_API_AUTH } from "src/constants";

export const projectsApiSlice = coreCreateApi({
  reducerPath: "projectApi",
  baseQuery: async ({ request }) => {
    const res = await fetch(`${GDC_APP_API_AUTH}/projects/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...request,
        fields: request?.fields?.join(","),
        expand: request?.expand?.join(","),
      }),
    });
    if (res.ok) {
      return { data: await res.json() };
    }

    return { error: { status: res.status, data: await res.text() } };
  },
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (request) => ({
        request,
      }),
      transformResponse: (response) => {
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
