import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../../dataAccess";
import { CoreState } from "../../../reducers";
import { GraphQLApiResponse } from "../../gdcapi/gdcgraphql";
import { fetchGenesSummaryQuery } from "./geneSummaryApi";

export const fetchGeneSummary = createAsyncThunk(
  "geneSummary/fetchGeneSummary",
  async ({ gene_id }: { gene_id: string }): Promise<GraphQLApiResponse> => {
    return await fetchGenesSummaryQuery({ gene_id });
  },
);

export interface geneSummaryInitialState {
  status: DataStatus;
  genes: any;
}

const initialState: geneSummaryInitialState = {
  status: "uninitialized",
  genes: {},
};

const slice = createSlice({
  name: "geneSummary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneSummary.fulfilled, (state, action) => {
        const response = action.payload;
        console.log("response, ", response);
        state.status = "fulfilled";
        const civic = response.data.viewer.explore.ssms?.aggregations
          ?.clinical_annotations__civic__gene_id?.buckets[0]?.key
          ? [
              response.data.viewer.explore.ssms?.aggregations
                ?.clinical_annotations__civic__gene_id?.buckets[0]?.key,
            ]
          : undefined;
        state.genes = {
          ...response.data.viewer.explore.genes.hits.edges[0].node,
          civic,
        };

        return state;
      })
      .addCase(fetchGeneSummary.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchGeneSummary.rejected, (state) => {
        state.status = "rejected";
        return state;
      });
  },
});

export const genesSummaryReducer = slice.reducer;

export const selectGenesSummaryData = (
  state: CoreState,
): CoreDataSelectorResponse<any> => ({
  data: {
    genes: state.genesSummary.genes,
  },
  status: state.genesSummary.status,
});

export const useGenesSummaryData = createUseCoreDataHook(
  fetchGeneSummary,
  selectGenesSummaryData,
);
