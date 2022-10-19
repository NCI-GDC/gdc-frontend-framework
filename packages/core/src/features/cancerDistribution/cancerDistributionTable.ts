import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { coreCreateApi } from "../../coreCreateApi";
import { Buckets } from "../gdcapi/gdcapi";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

interface GeneCancerDistributionTableResponse {
  viewer: {
    explore: {
      ssms: {
        aggregations: {
          occurrence__case__project__project_id: Buckets;
        };
      };
      cases: {
        filtered: {
          project__project_id: Buckets;
        };
        total: {
          project__project_id: Buckets;
        };
        cnvGain: {
          project__project_id: Buckets;
        };
        cnvLoss: {
          project__project_id: Buckets;
        };
        cnvTotal: {
          project__project_id: Buckets;
        };
      };
    };
  };
}

interface SSMSCancerDistributionTableResponse {
  viewer: {
    explore: {
      ssms: {
        aggregations: {
          occurrence__case__project__project_id: Buckets;
        };
      };
      cases: {
        filtered: {
          project__project_id: Buckets;
        };
        total: {
          project__project_id: Buckets;
        };
      };
    };
  };
}

export const cancerDistributionTableApiSlice = coreCreateApi({
  reducerPath: "cancerDistributionTable",
  baseQuery: async (request) => {
    const results: GraphQLApiResponse<any> = await graphqlAPI(
      request.graphQLQuery,
      request.graphQLFilters,
    );

    return { data: results };
  },
  endpoints: (builder) => ({
    getGeneCancerDistributionTable: builder.query({
      query: (request: { gene: string }) => ({
        graphQLQuery: `
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
      `,
        graphQLFilters: {
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
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<GeneCancerDistributionTableResponse>,
      ) => {
        return {
          projects:
            response?.data?.viewer?.explore?.ssms?.aggregations
              ?.occurrence__case__project__project_id?.buckets,
          ssmFiltered: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.filtered?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
          ssmTotal: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.total?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
          cnvGain: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.cnvGain?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
          cnvLoss: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.cnvLoss?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
          cnvTotal: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.cnvTotal?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
        };
      },
    }),
    getSSMSCancerDistributionTable: builder.query({
      query: (request) => ({
        graphQLQuery: `query CancerDistributionSsmTable(
          $ssmTested: FiltersArgument
          $ssmCountsFilters: FiltersArgument
          $caseAggsFilter: FiltersArgument
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
        }`,
        graphQLFilters: {
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
            content: [
              {
                content: {
                  field: "ssms.ssm_id",
                  value: [request.ssms],
                },
                op: "in",
              },
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
          caseAggsFilter: {
            content: [
              {
                content: {
                  field: "ssms.ssm_id",
                  value: [request.ssms],
                },
                op: "in",
              },
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
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<SSMSCancerDistributionTableResponse>,
      ) => {
        return {
          projects:
            response?.data?.viewer?.explore?.ssms?.aggregations
              ?.occurrence__case__project__project_id?.buckets,
          ssmFiltered: Object.fromEntries(
            (
              response?.data?.viewer?.explore?.cases?.filtered
                ?.project__project_id as Buckets
            )?.buckets.map((b) => [b.key, b.doc_count]),
          ),
          ssmTotal: Object.fromEntries(
            response?.data?.viewer?.explore?.cases?.total?.project__project_id?.buckets.map(
              (b) => [b.key, b.doc_count],
            ),
          ),
        } as any;
      },
    }),
  }),
});

export const {
  useGetGeneCancerDistributionTableQuery,
  useGetSSMSCancerDistributionTableQuery,
} = cancerDistributionTableApiSlice;

export const cancerDistributionTableApiSliceMiddleware =
  cancerDistributionTableApiSlice.middleware as Middleware;
export const cancerDistributionTableApiSliceReducerPath: string =
  cancerDistributionTableApiSlice.reducerPath;
export const cancerDistributionTableApiReducer: Reducer =
  cancerDistributionTableApiSlice.reducer as Reducer;
