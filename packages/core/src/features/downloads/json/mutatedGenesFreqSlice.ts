import {
  CoreDataSelectorResponse,
  CoreDispatch,
  CoreState,
  createUseCoreDataHook,
  DataStatus,
  GqlOperation,
  graphqlAPI,
} from "@gff/core";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLApiResponse } from "../../gdcapi/gdcgraphql";

export const graphQLQuery = `
query MutatedGenesFreq(
  $genesTable_size: Int
  $genesTable_offset: Int
  $score: String
) {
  genesTableDownloadViewer: viewer {
    explore {
      genes {
        hits(
          first: $genesTable_size
          offset: $genesTable_offset
          score: $score
        ) {
          total
          edges {
            node {
              symbol
              name
              cytoband
              biotype
              gene_id
            }
          }
        }
      }
    }
  }
}
`;

export const fetchMutatedGenesFreqs = createAsyncThunk<
  GraphQLApiResponse,
  GqlOperation,
  { dispatch: CoreDispatch; state: CoreState }
>("mutatedGenesFreq/mutatedGenesFreqs", async (filters?: GqlOperation) => {
  const graphQlFilters = filters ? { filters: filters } : {};
  return await graphqlAPI(graphQLQuery, graphQlFilters);
});

export interface MutatedGene {
  symbol: string;
  name: string;
  cytoband: string[];
  biotype: string;
  gene_id: string;
}

export interface MutatedGenesFreqData {
  genes: Array<MutatedGene>;
}

export interface MutatedGenesFreqState {
  readonly data: MutatedGenesFreqData;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: MutatedGenesFreqState = {
  data: {
    genes: [],
  },
  status: "uninitialized",
};

const slice = createSlice({
  name: "genes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMutatedGenesFreqs.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.errors) {
          state.status = "rejected";
        } else {
          state.data = {
            genes: response?.data?.explore?.genes,
          };
          state.status = "fulfilled";
        }
      })
      .addCase(fetchMutatedGenesFreqs.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMutatedGenesFreqs.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export const mutatedGenesFreqReducer = slice.reducer;

export const selectMutatedGenesFreqData = (
  state: CoreState,
): CoreDataSelectorResponse<MutatedGenesFreqData> => {
  return {
    data: state.mutatedGenesFreq.genes.data,
    status: state.mutatedGenesFreq.genes.status,
  };
};

export const useMutatedGenesFreq = createUseCoreDataHook(
  fetchMutatedGenesFreqs,
  selectMutatedGenesFreqData,
);
