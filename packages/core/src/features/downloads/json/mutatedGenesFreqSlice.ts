import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  DataStatus,
  createUseCoreDataHook,
} from "src/dataAccess";
import { GraphQLApiResponse } from "src/features/gdcapi/gdcgraphql";
import { CoreState } from "src/reducers";
import {
  fetchMutatedGenesFreqQuery,
  MutatedGenesFreqResponse,
} from "./mutatedGenesFreqApi";

export const fetchMutatedGenesFreq = createAsyncThunk(
  "mutatedGenesFreq/fetchMutatedGenesFreq",
  async ({
    currentFilters,
    size,
  }: {
    currentFilters: any;
    size: number;
  }): Promise<GraphQLApiResponse<MutatedGenesFreqResponse>> => {
    return await fetchMutatedGenesFreqQuery({ currentFilters, size });
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
        console.log("res", response);
        debugger;
        if (edges?.length === 0) return undefined;

        // const frequencies = {
        //   symbol: symbol,
        //   name: name,
        //   cytoband: cytoband,
        //   biotype: biotype,
        //   gene_id: gene_id,
        // };
        // state.mutatedGenes = { ...frequencies };
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

export const useMutatedGenesFreqData = createUseCoreDataHook(
  fetchMutatedGenesFreq,
  selectMutatedGenesFreqData,
);
