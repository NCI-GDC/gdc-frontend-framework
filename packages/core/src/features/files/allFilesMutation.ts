import { Reducer, Middleware } from "@reduxjs/toolkit";

import { GqlOperation } from "../gdcapi/filters";
import { GdcApiResponse, FileDefaults } from "../gdcapi/gdcapi";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { coreCreateApi } from "../../coreCreateApi";
import { GDC_API } from "../../constants";
import { GdcFile, mapFileData } from "./filesSlice";

export interface GdcFileIds {
  readonly id?: string;
  readonly file_id?: string;
}

interface AllFilesQueryProps {
  readonly caseFilters?: GqlOperation;
  readonly filters?: GqlOperation;
}

export const allFilesApiSlice = coreCreateApi({
  reducerPath: "filesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${GDC_API}`,
  }),
  endpoints: (builder) => ({
    getAllFiles: builder.mutation<GdcFileIds[], AllFilesQueryProps>({
      query: ({ caseFilters, filters }: AllFilesQueryProps) => ({
        url: "/files",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          case_filters: caseFilters,
          filters: filters,
          fields:
            "access,acl,file_id,file_size,state,file_name,cases.project.project_id",
          size: 10001, // set one over max add to cart function allows
        },
      }),
      transformResponse: (
        response: GdcApiResponse<FileDefaults>,
      ): GdcFile[] => {
        if (response.warnings && Object.keys(response.warnings).length > 0) {
          // TODO look into API endpoint to check how errors are handled
          console.error(Object.values(response.warnings));
          return [];
        } else {
          return mapFileData(response.data.hits);
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
