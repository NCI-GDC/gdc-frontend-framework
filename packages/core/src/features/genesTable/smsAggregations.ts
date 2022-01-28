import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreDataSelectorResponse, createUseCoreDataHook, DataStatus } from "../../dataAcess";
import { castDraft } from "immer";
import { CoreDispatch, CoreState } from "../../store";
import {
  GraphQLApiResponse,
  graphqlAPI,
} from "../gdcapi/gdcgraphql";


const SSMSAggregationsQuery = `
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

export interface KeyCount {
  readonly key: string;
  readonly doc_count: number;
}

export interface SMSAggregations {
  readonly keyvalues: ReadonlyArray<KeyCount>;
}

interface SMSAggregationsQueryProps {
  readonly field?: string;
  readonly ids: ReadonlyArray<string>;
}


export const fetchSmsAggregations = createAsyncThunk <
  GraphQLApiResponse,
  SMSAggregationsQueryProps,
  { dispatch: CoreDispatch; state: CoreState }
  > (
  "ssmsAggregations",
  async ({  ids, field = "consequence.transcript.gene.gene_id"} : SMSAggregationsQueryProps): Promise<GraphQLApiResponse> => {
  const graphQlFilters = {
      "ssmCountsfilters": {
      "content": [
        {
          "op": "in",
          "content": {
            "field": "cases.primary_site",
            "value": [
              "kidney"
            ]
          }
        },
        {
          "content": {
            "field": field,
            "value": ids,
          },
          "op": "in"
        },
        {
          "content": {
            "field": "genes.is_cancer_gene_census",
            "value": [
              "true"
            ]
          },
          "op": "in"
        }
      ],
        "op": "and"
    }

    };

    return await graphqlAPI(SSMSAggregationsQuery, graphQlFilters);
  }
);



export interface SSMSAggregationsState {
  readonly aggregations: SMSAggregations;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: SSMSAggregationsState = {
  aggregations: { keyvalues:  [] },
  status: "uninitialized",
};


const slice = createSlice({
  name: "ssmsAggregations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSmsAggregations.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.warnings) {
          state = castDraft(initialState);
          state.status = "rejected";
          state.error = response.warnings.filters;
        }
        console.log(response);
        const data = response.data.ssmsAggregationsViewer.explore.ssms.aggregations.consequence__transcript__gene__gene_id;
        //  Note: change this to the field parameter
        state.aggregations = data.buckets;
         state.status = "fulfilled";
        state.error = undefined;
        return state;
      })
      .addCase(fetchSmsAggregations.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchSmsAggregations.rejected, (state, action) => {
        state.status = "rejected";
        if (action.error) {
          state.error = action.error.message;
        }
        return state;
      });
  },
});

export const ssmsAggregationsReducer = slice.reducer;

export const selectSSMSAggregationState = (state: CoreState): SMSAggregations => state.ssmsAggregations.aggregations;

export const selectSSMSAggregationData = (
  state: CoreState,
): CoreDataSelectorResponse<SMSAggregations> => {
  return {
    data: state.ssmsAggregations.aggregations,
    status: state.ssmsAggregations.status,
    error: state.ssmsAggregations.error,
  };
};

export const useSSMSAggregations = createUseCoreDataHook(fetchSmsAggregations, selectSSMSAggregationData);
