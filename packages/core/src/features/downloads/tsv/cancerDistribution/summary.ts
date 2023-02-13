import {
  GraphQLApiResponse,
  graphqlAPISlice,
} from "../../../gdcapi/gdcgraphql";

// CD = Cancer Distribution

export interface CDTableGeneSummaryData {
  cd: string;
  // gene fields
}

export interface CDTableMutationSummaryData {
  cd: string;
  // mtn fields
}

export const cancerDistributionDownloadSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getCDTableGeneSummaryDL: builder.query({
      query: (request: { id: string }) => ({
        graphQLQuery: `${request.id}` as string,
        graphQLFilters: {} as Record<string, unknown>,
      }),
      transformResponse: (
        response: GraphQLApiResponse<any>,
      ): CDTableGeneSummaryData[] => {
        // response?.data?.?...
        console.log("response", response);

        return [] as CDTableGeneSummaryData[];
      },
    }),
  }),
});

export const { useGetCDTableGeneSummaryDLQuery } =
  cancerDistributionDownloadSlice;
