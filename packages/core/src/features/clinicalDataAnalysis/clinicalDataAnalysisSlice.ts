import { Reducer } from "@reduxjs/toolkit";

import {
  endpointSlice,
  GdcApiRequest,
  GdcApiResponse,
  ProjectDefaults,
} from "../gdcapi/gdcapi";
import { graphqlAPISlice } from "../gdcapi/gdcgraphql";
import { GqlOperation, GqlRange } from "../gdcapi/filters";

/**
 *  RTK Query endpoint to fetch clinical analysis data using case_filter with the cases endpoint
 */

export const clinicalAnalysisApiSlice = endpointSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClinicalAnalysis: builder.query({
      query: (request: GdcApiRequest) => ({
        request,
        endpoint: "cases",
        fetchAll: false,
      }),
      transformResponse: (response: GdcApiResponse<ProjectDefaults>) => {
        if (response.data.aggregations) return response.data.aggregations;
        return {};
      },
    }),
  }),
});

export interface ClinicalContinuousStatsData {
  min: number;
  max: number;
  mean: number;
  std_dev: number;
  iqr: number;
  median: number;
  q1: number;
  q3: number;
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
              aggregations(filters: $queryFilters) {
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
      transformResponse: (response, _, arg) => {
        return {
          min: response.data.viewer.explore.cases.aggregations[arg.field].stats
            .Min,
          max: response.data.viewer.explore.cases.aggregations[arg.field].stats
            .Max,
          mean: response.data.viewer.explore.cases.aggregations[arg.field].stats
            .Mean,
          std_dev:
            response.data.viewer.explore.cases.aggregations[arg.field].stats.SD,
          iqr: response.data.viewer.explore.cases.aggregations[arg.field]
            .percentiles.IQR,
          median:
            response.data.viewer.explore.cases.aggregations[arg.field]
              .percentiles.Median,
          q1: response.data.viewer.explore.cases.aggregations[arg.field]
            .percentiles.q1,
          q3: response.data.viewer.explore.cases.aggregations[arg.field]
            .percentiles.q3,
        };
      },
    }),
  }),
});

export const { useGetContinuousDataStatsQuery } = continuousDataStatsApi;

export const { useGetClinicalAnalysisQuery } = clinicalAnalysisApiSlice;

export const clinicalAnalysisApiReducer: Reducer =
  clinicalAnalysisApiSlice.reducer as Reducer;
