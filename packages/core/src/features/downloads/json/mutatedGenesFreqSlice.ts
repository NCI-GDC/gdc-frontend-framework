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
  viewer: {
    explore: {
      genes: {
        hits: {
          edges: Array<{
            node: {
              symbol: string;
              name: string;
              cytoband: string[];
              biotype: string;
              gene_id: string;
            };
          }>;
        };
      };
    };
  };
}

export interface MutatedGenesFreqState {
  readonly genes?: MutatedGene[];
  readonly status: DataStatus;
}

const initialState: MutatedGenesFreqState = {
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
        state.status = "fulfilled";

        const edges = response.data.viewer.explore.genes.hits.edges;
        if (edges.length === 0) return undefined;
        // todo

        return state;
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
): CoreDataSelectorResponse<{ genes: MutatedGenesFreqData | undefined }> => {
  return {
    data: {
      genes: state.downloads.mutatedGenesFreq.genes,
    },
    status: state.downloads.mutatedGenesFreq.status,
  };
};

export const useMutatedGenesFreq = createUseCoreDataHook(
  fetchMutatedGenesFreqs,
  selectMutatedGenesFreqData,
);
