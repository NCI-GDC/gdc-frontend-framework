import { gql } from "graphql-request";
import { GetCountsByGeneResponse, geneFilterHandler } from "./constants";
import { coreCreateApi } from "../../coreCreateApi";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";

const exploreCasesAggregatedProjectsBucketsQuery = gql`
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
`;

export const rtkGraphQL = coreCreateApi({
  baseQuery: graphqlRequestBaseQuery({
    url: "https://api.gdc.cancer.gov/v0/graphql",
  }),
  endpoints: (builder) => ({
    getProjectDocCountsByGene: builder.query<GetCountsByGeneResponse, any>({
      query: (geneId: any) => ({
        document: exploreCasesAggregatedProjectsBucketsQuery,
        variables: geneFilterHandler(geneId),
      }),
    }),
  }),
});

export const { useGetProjectDocCountsByGeneQuery } = rtkGraphQL;
