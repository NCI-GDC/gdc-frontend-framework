import { GqlOperation } from "../gdcapi/filters";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

export const SSMSAggregationsQuery = `
query SsmsAggregations (
  $ssmCountsfilters: FiltersArgument
  $caseFilters: FiltersArgument
) {
  ssmsAggregationsViewer: viewer {
    explore {
      ssms {
        aggregations(case_filters: $caseFilters, filters: $ssmCountsfilters, aggregations_filter_themselves: true) {
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
  readonly caseFilters?: GqlOperation;
}

export const fetchSmsAggregations = async ({
  ids,
  field = "consequence.transcript.gene.gene_id",
  filters,
  caseFilters,
}: SMSAggregationsQueryProps): Promise<GraphQLApiResponse> => {
  const graphQlFilters = {
    caseFilters: caseFilters ? caseFilters : {},
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
