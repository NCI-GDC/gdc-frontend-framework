import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { coreCreateApi } from "../../coreCreateApi";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

export const cancerDistributionTableApiSlice = coreCreateApi({
  reducerPath: "cancerDistributionTable",
  baseQuery: async ({ request }) => {
    const graphQLQuery = `
      query CancerDistributionTable(
        $ssmTested: FiltersArgument
        $ssmCountsFilters: FiltersArgument
        $caseAggsFilter: FiltersArgument
        $cnvGainFilter: FiltersArgument
        $cnvLossFilter: FiltersArgument
        $cnvTested: FiltersArgument
      ) {
        viewer {
          explore {
            ssms {
              aggregations(filters: $ssmCountsFilters) {
                occurrence__case__project__project_id {
                  buckets {
                    key
                    doc_count
                  }
                }
              }
            }
            cases {
              filtered: aggregations(filters: $caseAggsFilter) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
              cnvGain: aggregations(filters: $cnvGainFilter) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
              cnvLoss: aggregations(filters: $cnvLossFilter) {
                project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
              cnvTotal: aggregations(filters: $cnvTested) {
                 project__project_id {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
              total: aggregations(filters: $ssmTested) {
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
      }
    `;

    const graphQLFilters = {
      ssmTested: {
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["ssm"],
            },
            op: "in",
          },
        ],
        op: "and",
      },
      ssmCountsFilters: {
        op: "and",
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["ssm"],
            },
            op: "in",
          },
          {
            op: "in",
            content: {
              field: "genes.gene_id",
              value: [request.gene],
            },
          },
        ],
      },
      caseAggsFilter: {
        op: "and",
        content: [
          {
            op: "in",
            content: {
              field: "cases.available_variation_data",
              value: ["ssm"],
            },
          },
          {
            op: "NOT",
            content: {
              field: "cases.gene.ssm.observation.observation_id",
              value: "MISSING",
            },
          },
          {
            op: "in",
            content: {
              field: "genes.gene_id",
              value: [request.gene],
            },
          },
        ],
      },
      cnvGainFilter: {
        op: "and",
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
          {
            content: {
              field: "cnvs.cnv_change",
              value: ["Gain"],
            },
            op: "in",
          },
          {
            op: "in",
            content: {
              field: "genes.gene_id",
              value: [request.gene],
            },
          },
        ],
      },
      cnvLossFilter: {
        op: "and",
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
          {
            content: {
              field: "cnvs.cnv_change",
              value: ["Loss"],
            },
            op: "in",
          },
          {
            op: "in",
            content: {
              field: "genes.gene_id",
              value: [request.gene],
            },
          },
        ],
      },
      cnvTested: {
        content: [
          {
            content: {
              field: "cases.available_variation_data",
              value: ["cnv"],
            },
            op: "in",
          },
        ],
        op: "and",
      },
    };

    const results: GraphQLApiResponse<any> = await graphqlAPI(
      graphQLQuery,
      graphQLFilters,
    );

    return { data: results };
  },
  endpoints: (builder) => ({
    getCancerDistributionTable: builder.query({
      query: (request) => ({
        request,
      }),
    }),
  }),
});

export const { useGetCancerDistributionTableQuery } =
  cancerDistributionTableApiSlice;

export const cancerDistributionTableApiSliceMiddleware =
  cancerDistributionTableApiSlice.middleware as Middleware;
export const cancerDistributionTableApiSliceReducerPath: string =
  cancerDistributionTableApiSlice.reducerPath;
export const cancerDistributionTableApiReducer: Reducer =
  cancerDistributionTableApiSlice.reducer as Reducer;
