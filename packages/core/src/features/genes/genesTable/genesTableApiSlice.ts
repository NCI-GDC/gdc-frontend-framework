import type { Middleware, Reducer } from "@reduxjs/toolkit";
// import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
// import { GraphQLClient } from 'graphql-request';
import { coreCreateApi } from "../../../coreCreateApi";
import { GDC_API_GQL } from "../../../constants";

// export const client = new GraphQLClient('/graphql')

export const genesTableApiSlice = coreCreateApi({
  reducerPath: "genesTableApi",
  //   baseQuery: graphqlRequestBaseQuery({ client }),
  baseQuery: async ({ request }) => {
    const res = await fetch(`${GDC_API_GQL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filters: JSON.stringify(request.filters),
      }),
    });
    if (res.ok) {
      return { data: await res.json() };
    }

    return { error: { status: res.status, data: await res.text() } };
  },
  endpoints: (builder) => ({
    getGenesTable: builder.query({
      query: (request) => ({
        request,
      }),
      transformResponse: (response: any): any => {
        console.log("response", response);
        return response;
      },
    }),
  }),
});

export const { useGetGenesTableQuery } = genesTableApiSlice;

export const genesTableApiSliceMiddleware =
  genesTableApiSlice.middleware as Middleware;
export const genesTableApiSliceReducerPath: string =
  genesTableApiSlice.reducerPath;
export const genesTableApiReducer: Reducer =
  genesTableApiSlice.reducer as Reducer;
