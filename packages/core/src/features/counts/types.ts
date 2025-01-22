import { TypedUseLazyQuery } from "@reduxjs/toolkit/query/react";
import { FilterSet } from "../cohort";
import {
  GraphqlApiSliceRequest,
  GraphQLApiResponse,
  GraphQLFetchError,
} from "../gdcapi/gdcgraphql";

export type CountHookLazyQuery = TypedUseLazyQuery<
  number,
  FilterSet,
  (
    request: GraphqlApiSliceRequest,
  ) => Promise<
    | { error: GraphQLFetchError | string; data?: undefined }
    | { data: GraphQLApiResponse<any>; error?: undefined }
  >
>;

export type CountQueryResponse = {
  data: number; // return count or 0 if not loaded
  isFetching: boolean; // return true if fetching
  isError: boolean; // return true if error
  isSuccess: boolean; // return true if success
};

export type CountHook = () => CountQueryResponse;

export type CountHookMap = { [key: string]: CountHook };
