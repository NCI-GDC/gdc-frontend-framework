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

const graphqlQuery = `query CancerDistribution2($cnvAll: FiltersArgument, $cnvGain: FiltersArgument, $cnvLoss: FiltersArgument, $cnvTested: FiltersArgument, $cnvTestedByGene: FiltersArgument) {
  viewer {
    explore {
      cases {
        cnvAll: hits(filters: $cnvAll) {
          total
        }
        gain: aggregations(filters: $cnvGain) {
          project__project_id {
            buckets {
              doc_count
              key
            }
          }
        }
        loss: aggregations(filters: $cnvLoss) {
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
        cnvTestedByGene: hits(filters: $cnvTestedByGene) {
          total
        }
      }
    }
  }
}
`

const fetchCnvAnalysisQuery = async (gene : string) => {
  const graphqlFilters = {
    cnvAll: {
      "op": "and",
      "content": [
        {
          "op": "in",
          "content": {
            "field": "cases.available_variation_data",
            "value": ["cnv"]
          }        
        },
        {
          "op": "in",
          "content": {
            "field": "cnvs.cnv_change",
            "value": ["Gain", "Loss"]
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
    cnvGain: {
      "op": "and",
      "content": [
        {
          "op": "in",
          "content": {
            "field": "cases.available_variation_data",
            "value": ["cnv"]
          }        
        },
        {
          "op": "in",
          "content": {
            "field": "cnvs.cnv_change",
            "value": ["Gain"]
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
    cnvLoss: {
      "op": "and",
      "content": [
        {
          "op": "in",
          "content": {
            "field": "cases.available_variation_data",
            "value": ["cnv"]
          }        
        },
        {
          "op": "in",
          "content": {
            "field": "cnvs.cnv_change",
            "value": ["Loss"]
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
    cnvTested: {
      "op": "and",
      "content": [
        {
          "op": "in",
          "content": {
            "field": "cases.available_variation_data",
            "value": ["cnv"]
           }
        }
      ]
    },
    cnvTestedByGene: {
      "op": "and",
      "content": [
        {
          "op": "in",
          "content": {
            "field": "cases.available_variation_data",
            "value": ["cnv"]
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
    }
  };
  const results: GraphQLApiResponse<any> = await graphqlAPI(
    graphqlQuery,
    graphqlFilters,
  );

  return results;
};


export const fetchCnvPlot = createAsyncThunk("genes/cnvPlot", async (params : Record<string, string>) => {
  return await fetchCnvAnalysisQuery(params.gene);
});

interface CNVData {
  caseTotal: number;
  cases: Record<string, number>[];
  totalByGene: number;
}

interface CnvPlotState {
  readonly cnv?: CNVData;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState : CnvPlotState = { cnv: {cases: [], caseTotal: 0, mutationTotal: 0}, status: 'uninitialized'};

const slice = createSlice({
    name: "genes/cnvPlot",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchCnvPlot.fulfilled, (state, action) => {
          const response = action.payload;
          const gain = response?.data?.viewer?.explore?.cases?.gain?.project__project_id?.buckets.map(d => ({ gain: d.doc_count, project: d.key })) || [];
          const loss = response?.data?.viewer?.explore?.cases?.loss?.project__project_id?.buckets.map(d => ({ loss: d.doc_count, project: d.key })) || [];
          const total = response?.data?.viewer?.explore?.cases?.cnvTotal?.project__project_id?.buckets.map(d => ({ total: d.doc_count, project: d.key }))
 
          const merged = total.map(d => ({...d, ...gain.find(g => g.project === d.project), ...loss.find(l => l.project === d.project)}));
          state = {
            cnv:  {
              cases: merged,
              mutationTotal: response?.data?.viewer?.explore?.cases?.cnvAll?.total,
              caseTotal: response?.data?.viewer?.explore?.cases.cnvTestedByGene?.total, 
            },
            status: "fulfilled"
          }
          return state;
        })
        .addCase(fetchCnvPlot.pending, (state) => {
          state = {
            ...state,
            status: "pending",
          };
          return state;
        })
        .addCase(fetchCnvPlot.rejected, (state) => {
          state = {
            ...state,
            status: "rejected",
          };
          return state;
        });
    },
  });

  export const cnvPlotReducer = slice.reducer;


  export const selectCnvPlotData = (
    state: CoreState,
  ): CoreDataSelectorResponse<CnvPlotState> => {
    return {
      data: state.cnvPlot.cnv,
      status: state.cnvPlot.status,
      error: '',
    };
  };

  
  export const useCnvPlot = createUseCoreDataHook(
    fetchCnvPlot,
    selectCnvPlotData,
  ); 