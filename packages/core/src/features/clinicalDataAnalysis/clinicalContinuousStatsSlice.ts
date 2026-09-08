import { GraphQLApiResponse, graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { GqlOperation, GqlRange } from "../gdcapi/filters";

interface ClinicalContinuousStatsResponse {
  viewer: {
    explore: {
      cases: {
        aggregations: {
          [field: string]: {
            stats: {
              Min: number;
              Max: number;
              Mean: number;
              SD: number;
            };
            percentiles: {
              Median: number;
              IQR: number;
              q1: number;
              q3: number;
            };
            range: {
              buckets: Array<{
                doc_count: number;
                key: string;
              }>;
            };
          };
        };
      };
    };
  };
}

export interface ClinicalContinuousStatsData {
  readonly min: number;
  readonly max: number;
  readonly mean: number;
  readonly std_dev: number;
  readonly iqr: number;
  readonly median: number;
  readonly q1: number;
  readonly q3: number;
  readonly buckets: Record<string, number>;
}

interface ClinicalContinuousStatsInputs {
  field: string;
  queryFilters: GqlOperation;
  rangeFilters: GqlRange;
}

const continuousDataStatsApi = graphqlAPISlice.injectEndpoints({
  endpoints: (builder) => ({
    getContinuousDataStats: builder.query<
      ClinicalContinuousStatsData,
      ClinicalContinuousStatsInputs
    >({
      query: ({ field, queryFilters, rangeFilters }) => ({
        graphQLQuery: `query ContinuousAggregationQuery($queryFilters: FiltersArgument, $rangeFilters: FiltersArgument) {
        viewer {
          explore {
            cases {
              aggregations(case_filters: $queryFilters) {
                ${field} {
                  stats {
                    Min : min
                    Max: max
                    Mean: avg
                    SD: std_deviation
                  }
                  percentiles {
                    Median: median
                    IQR: iqr
                    q1: quartile_1
                    q3: quartile_3
                  }
                  range(ranges: $rangeFilters) {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
              }
            }
          }
        }
      }`,
        graphQLFilters: {
          queryFilters,
          rangeFilters,
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<ClinicalContinuousStatsResponse>,
        _,
        arg,
      ) => {
        const aggregation =
          response.data.viewer.explore.cases.aggregations[arg.field];
        return {
          min: aggregation.stats.Min,
          max: aggregation.stats.Max,
          mean: aggregation.stats.Mean,
          std_dev: aggregation.stats.SD,
          iqr: aggregation.percentiles.IQR,
          median: aggregation.percentiles.Median,
          q1: aggregation.percentiles.q1,
          q3: aggregation.percentiles.q3,
          buckets: aggregation.range.buckets.reduce(
            (facetBuckets, apiBucket) => {
              facetBuckets[apiBucket.key] = apiBucket.doc_count;
              return facetBuckets;
            },
            {} as Record<string, number>,
          ),
        };
      },
    }),
  }),
});

export const { useGetContinuousDataStatsQuery } = continuousDataStatsApi;
