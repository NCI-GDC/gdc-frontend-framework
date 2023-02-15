import {
  GraphQLApiResponse,
  graphqlAPISlice,
} from "../../../gdcapi/gdcgraphql";
import { cdFilters } from "./cdFilters";

// CD = Cancer Distribution

export interface CDTableGeneSummaryData {
  cd: string;
  // gene fields
}

export interface CDTableMutationSummaryData {
  cd: string;
  // mtn fields
}

const getCDQuery = (id: string, entity: string): string => {
  switch (entity) {
    case "genes": {
      const {
        ssmsTestedFilter,
        cnvLossFilters,
        cnvGainFilters,
        ...otherFilters
      } = cdFilters(id);
      console.log("otherFilters", otherFilters);
      // todo
      return ``;
    }
    case "ssms": {
      // todo
      return ``;
    }
    default: {
      return "";
    }
  }
};

const getCDFilters = (id: string, entity: string): Record<string, any> => {
  switch (entity) {
    case "genes": {
      return { id: id };
    }
    case "ssms": {
      return {};
    }
    default: {
      return {};
    }
  }
};

export const cancerDistributionDownloadSlice = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getCDTableGeneSummaryDL: builder.query({
      query: (request: { gene: string }) => ({
        graphQLQuery: getCDQuery(request.gene, "genes") as string,
        graphQLFilters: getCDFilters(request.gene, "genes") as Record<
          string,
          unknown
        >,
      }),
      transformResponse: (
        response: GraphQLApiResponse<any>,
      ): CDTableGeneSummaryData[] => {
        debugger;
        return [] as CDTableGeneSummaryData[];
      },
    }),
  }),
});

export const { useGetCDTableGeneSummaryDLQuery } =
  cancerDistributionDownloadSlice;
