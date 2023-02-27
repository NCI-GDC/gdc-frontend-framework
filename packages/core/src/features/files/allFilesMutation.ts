import { Reducer, Middleware } from "@reduxjs/toolkit";

import { GqlOperation } from "../gdcapi/filters";
import { GdcApiResponse, FileDefaults } from "../gdcapi/gdcapi";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { coreCreateApi } from "../../coreCreateApi";
import { GDC_API } from "../../constants";

export interface GdcFileIds {
  readonly id?: string;
  readonly file_id?: string;
}

export const allFilesApiSlice = coreCreateApi({
  reducerPath: "filesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${GDC_API}`,
  }),
  endpoints: (builder) => ({
    getAllFiles: builder.mutation<GdcFileIds[], GqlOperation>({
      query: (filters?: GqlOperation) => ({
        url: "/files",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          filters: filters,
          fields: "file_id",
          size: 10001, // set one over max add to cart function allows
        },
      }),
      transformResponse: (response: GdcApiResponse<Partial<FileDefaults>>) => {
        if (response.warnings && Object.keys(response.warnings).length > 0) {
          // TODO look into API endpoint to check how errors are handled
          console.error(Object.values(response.warnings));
          return [];
        } else {
          return [...response.data.hits];
        }
      },
    }),
  }),
});

export const { useGetAllFilesMutation } = allFilesApiSlice;

export const allFilesApiSliceMiddleware =
  allFilesApiSlice.middleware as Middleware;
export const allFilesApiSliceReducerPath: string = allFilesApiSlice.reducerPath;
export const allFilesApiReducer: Reducer = allFilesApiSlice.reducer as Reducer;
