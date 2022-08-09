import { createApi } from "@reduxjs/toolkit/query/react";
import { gql } from "graphql-request";
import { getGraphQLGeneId, GetCountsByGeneResponse } from "./constants";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";

export const rtkGraphQL = createApi({
  baseQuery: graphqlRequestBaseQuery({
    url: "https://api.gdc.cancer.gov/v0/graphql",
  }),
  endpoints: (builder) => ({
    getProjectDocCountsByGene: builder.query<
      GetCountsByGeneResponse,
      { geneId: string }
    >({
      query: ({ geneId }) => ({
        document: gql`
          query getProjectDocCountsByGene($filters_1: FiltersArgument) {
            explore {
              cases {
                aggregations(filters: $filters_1) {
                  project__project_id {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
              }
            }
          }
        `,
        variables: getGraphQLGeneId(geneId),
      }),
    }),
  }),
});

export const { useGetProjectDocCountsByGeneQuery } = rtkGraphQL;
