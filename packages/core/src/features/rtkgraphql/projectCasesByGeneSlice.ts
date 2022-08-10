import { gql, request, ClientError } from "graphql-request";
import { GetCountsByGeneResponse, geneFilterHandler } from "./constants";
import { coreCreateApi } from "../../coreCreateApi";

const graphqlBaseQuery =
  ({ baseUrl }: { baseUrl: any }) =>
  async ({ body }: { body: string }) => {
    try {
      const result = await request(baseUrl, body);
      return { data: result };
    } catch (error) {
      if (error instanceof ClientError) {
        return { error: { status: error.response.status, data: error } };
      }
      return { error: { status: 500, data: error } };
    }
  };

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
  baseQuery: graphqlBaseQuery({
    baseUrl: "https://api.gdc.cancer.gov/v0/graphql",
  }),
  endpoints: (builder) => ({
    getProjectDocCountsByGene: builder.query<GetCountsByGeneResponse, any>({
      query: (geneId: any) => ({
        url: "/",
        method: "POST",
        body: exploreCasesAggregatedProjectsBucketsQuery,
        variables: geneFilterHandler(geneId),
      }),
    }),
  }),
});

export const { useGetProjectDocCountsByGeneQuery } = rtkGraphQL;
