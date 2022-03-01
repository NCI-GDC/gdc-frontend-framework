import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAcess";
import { CoreState } from "../../store";
import { GraphQLApiResponse, graphqlAPI } from "../gdcapi/gdcgraphql";

const graphqlQuery = `query CancerDistribution($caseAggsFilters: FiltersArgument, $ssmTested: FiltersArgument, $ssmFilters: FiltersArgument) {
  viewer {
    explore {
      ssms {
        hits(first: 0, filters: $ssmFilters) {
          total
        }
      }
      cases {
        ssmFiltered: aggregations(filters: $caseAggsFilters) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        },
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

const fetchSmssAnalysisQuery = async (gene: string, ssms: string) => {
  const graphqlFilters = gene
    ? {
        caseAggsFilters: {
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
              op: "in",
              content: {
                field: "genes.gene_id",
                value: [gene],
              },
            },
            {
              op: "not",
              content: {
                field: "cases.gene.ssm.observation.observation_id",
                value: "MISSING",
              },
            },
          ],
        },
        ssmFilters: {
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
              op: "in",
              content: {
                field: "genes.gene_id",
                value: [gene],
              },
            },
          ],
        },
        ssmTested: {
          op: "and",
          content: [
            {
              op: "in",
              content: {
                field: "cases.available_variation_data",
                value: ["ssm"],
              },
            },
          ],
        },
      }
    : {
        caseAggsFilters: {
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
              op: "in",
              content: {
                field: "ssms.ssm_id",
                value: [ssms],
              },
            },
          ],
        },
        ssmTested: {
          op: "and",
          content: [
            {
              op: "in",
              content: {
                field: "cases.available_variation_data",
                value: ["ssm"],
              },
            },
          ],
        },
      };

  const results: GraphQLApiResponse<any> = await graphqlAPI(
    graphqlQuery,
    graphqlFilters,
  );

  return results;
};

export const fetchSmssPlot = createAsyncThunk(
  "genes/smssPlot",
  async ({ gene, ssms} : ({ gene: string, ssms: string})) => {
    return await fetchSmssAnalysisQuery(gene, ssms);
  },
);

interface SmssPlotPoint {
  readonly project: string;
  readonly smssCount: number;
  readonly totalCount: number;
}

interface smsCaseData {
  readonly cases: SmssPlotPoint[];
  readonly smssCount: number;
}

export interface SMSPlotState {
  readonly smss: smsCaseData;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: SMSPlotState = {
  smss: { cases: [], smssCount: 0 },
  status: "uninitialized",
};

interface GraphQLDoc {
  readonly key: string;
  readonly doc_count: number;
}

const slice = createSlice({
  name: "genes/smssPlot",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSmssPlot.fulfilled, (state, action) => {
        const response = action.payload;
        const smss =
          response?.data?.viewer?.explore?.cases?.ssmFiltered?.project__project_id?.buckets.map(
            (d : GraphQLDoc) => ({ smssCount: d.doc_count, project: d.key }),
          ) || [];
        const total =
          response?.data?.viewer?.explore?.cases?.total?.project__project_id?.buckets.map(
            (d : GraphQLDoc) => ({ totalCount: d.doc_count, project: d.key }),
          );

        const merged = smss.map((d : SmssPlotPoint) => ({
          ...d,
          ...total.find((t : SmssPlotPoint) => t.project === d.project),
        }));
        state = {
          smss: {
            cases: merged,
            smssCount: response?.data?.viewer?.explore?.ssms?.hits?.total,
          },
          status: "fulfilled",
        };
        return state;
      })
      .addCase(fetchSmssPlot.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchSmssPlot.rejected, (state, action) => {
        state.status = "rejected";
        if (action.error) {
          state.error = action.error.message;
        }
        return state;
      });
  },
});

export const smssPlotReducer = slice.reducer;

export const selectSmssPlotData = (
  state: CoreState,
): CoreDataSelectorResponse<any> => {
  return {
    data: state.smssPlot.smss,
    status: state.smssPlot.status,
    error: state.smssPlot.error,
  };
};

export const useSmssPlot = createUseCoreDataHook(
  fetchSmssPlot,
  selectSmssPlotData,
);
