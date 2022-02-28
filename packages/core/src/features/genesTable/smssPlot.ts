import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAcess";
import { CoreState } from "../../store";
import {
  GraphQLApiResponse,
  graphqlAPI,
} from "../gdcapi/gdcgraphql";

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
`

const fetchSmssAnalysisQuery = async (gene : string) => {
  const graphqlFilters = {
    caseAggsFilters: {
      "op": "and",
      "content": [
        {
          "op": "in",
          "content": {
            "field": "cases.available_variation_data",
            "value": ["ssm"]
          }        
        },
        {
          "op": "in",
          "content": {
            "field": "genes.gene_id",
            "value": [gene]
          }
        },
        {
          "op": "not",
          "content": {
            "field": "cases.gene.ssm.observation.observation_id",
            "value": "MISSING"
          }
        }
      ]
    },
    ssmFilters: {
      "op": "and",
      "content": [
        {
          "op": "in",
          "content": {
            "field": "cases.available_variation_data",
            "value": ["ssm"]
          }        
        },
        {
          "op": "in",
          "content": {
            "field": "genes.gene_id",
            "value": [gene]
          }
        },
      ]
    },
    ssmTested: {
      "op": "and",
      "content": [
        {
          "op": "in",
          "content": {
            "field": "cases.available_variation_data",
            "value": ["ssm"]
          }        
        }
      ]
    },
  };

  const results: GraphQLApiResponse<any> = await graphqlAPI(
    graphqlQuery,
    graphqlFilters,
  );

  return results;
};


export const fetchSmssPlot = createAsyncThunk("genes/smssPlot", async (params : Record<string, string>) => {
  return await fetchSmssAnalysisQuery(params.gene);
});
 
interface SmssPlotPoint {
  readonly project: string;
  readonly smssCount: number;
  readonly totalCount: number; 
}

interface smsCaseData {
  readonly cases: SmssPlotPoint[];
  readonly smssCount: number;

}

interface SMSPlotState {
  readonly smss: smsCaseData;
  readonly cnv?: [];
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState : SMSPlotState = { smss: {cases: [], smssCount: 0}, status: 'uninitialized'};

const slice = createSlice({
    name: "genes/smssPlot",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchSmssPlot.fulfilled, (state, action) => {
          const response = action.payload;
          const smss = response?.data?.viewer?.explore?.cases?.ssmFiltered?.project__project_id?.buckets.map(d => ({ smssCount: d.doc_count, project: d.key })) || [];

          const total = response?.data?.viewer?.explore?.cases?.total?.project__project_id?.buckets.map(d => ({ totalCount: d.doc_count, project: d.key }))
 
          const merged = smss.map(d => ({...d, ...total.find(t => t.project === d.project)});
          state = {
            smss:  {
              cases: merged,
              smssCount: response?.data?.viewer?.explore?.ssms?.hits?.total,
            },
            status: "fulfilled"
          }
          return state;
        })
        .addCase(fetchSmssPlot.pending, (state) => {
          state = {
            ...state,
            status: "pending",
          };
          return state;
        })
        .addCase(fetchSmssPlot.rejected, (state) => {
          state = {
            ...state,
            status: "rejected",
          };
          return state;
        });
    },
  });

  export const smssPlotReducer = slice.reducer;

  export const selectSmssPlotData = (
    state: CoreState,
  ): CoreDataSelectorResponse<SMSPlotState> => {
    return {
      data: state.smssPlot.smss,
      status: state.smssPlot.status,
      error: '',
    };
  };
  
  export const useSmssPlot = createUseCoreDataHook(
    fetchSmssPlot,
    selectSmssPlotData,
  );
