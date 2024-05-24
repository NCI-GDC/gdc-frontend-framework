import { graphqlAPISlice } from "../gdcapi/gdcgraphql";

const graphQLQuery = `
    query pValue($data: [[Int]]!) {
      analysis {
        pvalue(data: $data)
      }
    }
  `;

const pValueSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    pValue: builder.query<number, number[][]>({
      query: (data) => ({
        graphQLQuery,
        graphQLFilters: {
          data,
        },
      }),
      transformResponse: (response) => response?.data?.analysis.pvalue,
    }),
  }),
});

export const { usePValueQuery } = pValueSlice;
