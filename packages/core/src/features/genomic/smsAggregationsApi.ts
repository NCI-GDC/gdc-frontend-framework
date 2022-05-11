import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

export const SSMSAggregationsQuery = `
query SsmsAggregations (
  $ssmCountsfilters: FiltersArgument
) {
  ssmsAggregationsViewer: viewer {
    explore {
      ssms {
        aggregations(filters: $ssmCountsfilters, aggregations_filter_themselves: true) {
          consequence__transcript__gene__gene_id {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
}
`;

interface SMSAggregationsQueryProps {
  readonly field?: string;
  readonly ids: ReadonlyArray<string>;
  readonly filters: ReadonlyArray<Record<string, unknown>>;
}

export const fetchSmsAggregations = async ({
  ids,
  field = "consequence.transcript.gene.gene_id",
  filters,
}: SMSAggregationsQueryProps): Promise<GraphQLApiResponse> => {
  const graphQlFilters = {
    ssmCountsfilters: {
      content: [
        ...[
          {
            content: {
              field: field,
              value: ids,
            },
            op: "in",
          },
        ],
        ...filters,
      ],
      op: "and",
    },
  };

  return await graphqlAPI(SSMSAggregationsQuery, graphQlFilters);
};
