import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { GDC_APP_API_AUTH } from "../../constants";
import { coreCreateApi } from "../../coreCreateApi";
import serializeQueryArgsWithDataRelease from "src/serializeQueryArgs";

export interface GraphQLFetchError {
  readonly url: string;
  readonly status: number;
  readonly statusText: string;
  readonly text: string;
  readonly variables?: Record<string, any>;
}

type UnknownJson = Record<string, any>;

export interface GraphQLApiResponse<H = UnknownJson> {
  readonly data: H;
  readonly errors: Record<string, string>;
}

export interface SortOption {
  field: string;
  order: string;
}

export interface TablePageOffsetProps {
  readonly pageSize?: number;
  readonly offset?: number;
  readonly sorts?: Array<SortOption>;
  readonly searchTerm?: string;
}

const buildGraphQLFetchError = async (
  res: Response,
  variables?: Record<string, any>,
): Promise<GraphQLFetchError> => {
  return {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    text: await res.text(),
    variables: variables,
  };
};

/**
 * Call the GDC GraphQL API
 * @param query - GraphQL query
 * @param variables - GraphQL variables
 * @category GDC API
 */
export const graphqlAPI = async <T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<GraphQLApiResponse<T>> => {
  const res = await fetch(`${GDC_APP_API_AUTH}/graphql`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (res.ok) return res.json();

  throw await buildGraphQLFetchError(res, variables);
};

export interface GraphqlApiSliceRequest {
  readonly graphQLQuery: string;
  readonly graphQLFilters: Record<string, unknown>;
}

export const graphqlAPISlice = coreCreateApi({
  reducerPath: "graphql",
  serializeQueryArgs: serializeQueryArgsWithDataRelease,
  baseQuery: async (request: GraphqlApiSliceRequest) => {
    let results: GraphQLApiResponse<any>;

    try {
      results = await graphqlAPI(request.graphQLQuery, request.graphQLFilters);
    } catch (e) {
      return { error: e as GraphQLFetchError };
    }

    return { data: results };
  },
  endpoints: () => ({}),
});

export const graphqlAPISliceMiddleware =
  graphqlAPISlice.middleware as Middleware;
export const graphqlAPISliceReducerPath: string = graphqlAPISlice.reducerPath;
export const graphqlAPIReducer: Reducer = graphqlAPISlice.reducer as Reducer;
