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
}

export const fetchSmsAggregations = async ({
  ids,
  field = "consequence.transcript.gene.gene_id",
}: SMSAggregationsQueryProps): Promise<GraphQLApiResponse> => {
  const graphQlFilters = {
    ssmCountsfilters: {
      content: [
        {
          op: "in",
          content: {
            field: "cases.primary_site",
            value: ["kidney"],
          },
        },
        {
          content: {
            field: field,
            value: ids,
          },
          op: "in",
        },
        {
          content: {
            field: "genes.is_cancer_gene_census",
            value: ["true"],
          },
          op: "in",
        },
      ],
      op: "and",
    },
  };

  return await graphqlAPI(SSMSAggregationsQuery, graphQlFilters);
};
