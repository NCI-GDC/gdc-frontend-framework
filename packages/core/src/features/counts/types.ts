import { QueryDefinition } from "@reduxjs/toolkit/query";
import { UseLazyQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { FilterSet } from "../cohort";
import {
  GraphqlApiSliceRequest,
  GraphQLApiResponse,
  GraphQLFetchError,
} from "../gdcapi/gdcgraphql";

export type CountHookLazyQuery = UseLazyQuery<
  QueryDefinition<
    FilterSet,
    (
      request: GraphqlApiSliceRequest,
    ) => Promise<
      | { error: GraphQLFetchError; data?: undefined }
      | { data: GraphQLApiResponse<any>; error?: undefined }
    >,
    never,
    number,
    "graphql"
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
