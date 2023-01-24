import {
  CoreDataSelectorResponse,
  CoreState,
  createUseCoreDataHook,
  DataStatus,
} from "@gff/core";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLApiResponse } from "../../gdcapi/gdcgraphql";
import {
  fetchMutatedGenesFreqQuery,
  MutatedGenesFreqResponse,
} from "./mutatedGenesFreqApi";

export const fetchMutatedGenesFreq = createAsyncThunk(
  "mutatedGenesFreq/fetchMutatedGenesFreq",
  async ({
    genomic_filters,
  }: {
    genomic_filters: any;
  }): Promise<GraphQLApiResponse<MutatedGenesFreqResponse>> => {
    return await fetchMutatedGenesFreqQuery({ genomic_filters });
  },
);

export interface MutatedGenesFreqData {
  symbol: string;
  name: string;
  cytoband: string[];
  biotype: string;
  gene_id: string;
}

export interface MutatedGenesFreqInitialState {
  status: DataStatus;
  mutatedGenes?: MutatedGenesFreqData;
}

const initialState: MutatedGenesFreqInitialState = {
  status: "uninitialized",
};

const slice = createSlice({
  name: "mutatedGenes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMutatedGenesFreq.fulfilled, (state, action) => {
        const response = action.payload;
        state.status = "fulfilled";
        const edges = response?.data?.viewer?.explore?.genes?.hits?.edges;
        if (edges.length === 0) return undefined;

        const {
          node: { symbol, name, cytoband, biotype, gene_id },
        } = edges[0];
        const frequencies = {
          symbol: symbol,
          name: name,
          cytoband: cytoband,
          biotype: biotype,
          gene_id: gene_id,
        };
        state.mutatedGenes = { ...frequencies };

        return state;
      })
      .addCase(fetchMutatedGenesFreq.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMutatedGenesFreq.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export const mutatedGenesFreqReducer = slice.reducer;

export const selectMutatedGenesFreqData = (
  state: CoreState,
): CoreDataSelectorResponse<{
  mutatedGenes: MutatedGenesFreqData | undefined;
}> => {
  return {
    data: {
      mutatedGenes: state.downloads.mutatedGenesFreq.mutatedGenes,
    },
    status: state.downloads.mutatedGenesFreq.status,
  };
};

export const useMutatedGenesFreq = createUseCoreDataHook(
  fetchMutatedGenesFreq,
  selectMutatedGenesFreqData,
);
