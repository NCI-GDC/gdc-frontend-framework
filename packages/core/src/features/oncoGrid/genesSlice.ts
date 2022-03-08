import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchGdcEntities } from "../gdcapi/gdcapi";
import { CoreDataSelectorResponse, DataStatus } from "../../dataAcess";
import { CoreState } from "../../store";
import { createUseCoreDataHook } from "../..";

export interface GenesState {
  readonly status: DataStatus;
  readonly data: any;
  readonly error?: string;
}

const initialState: GenesState = {
  data: [],
  status: "uninitialized",
};

export const fetchGenes = createAsyncThunk("oncogrid/fetchGenes", async () => {
  return fetchGdcEntities("analysis/top_mutated_genes_by_project", {
    fields: ["gene_id", "symbol", "is_cancer_gene_census"],
    size: 50,
    filters: {
      op: "and",
      content: [
        {
          content: { field: "genes.is_cancer_gene_census", value: ["true"] },
          op: "in",
        },
        {
          op: "not",
          content: {
            field: "ssms.consequence.transcript.annotation.vep_impact",
            value: "missing",
          },
        },
        {
          op: "in",
          content: {
            field: "ssms.consequence.transcript.consequence_type",
            value: ["stop_gained"],
          },
        },
      ],
    },
  });
});

const slice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenes.fulfilled, (state, action) => {
        state.data = action.payload.data.hits;
        state.status = "fulfilled";
        state.error = undefined;
        return state;
      })
      .addCase(fetchGenes.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchGenes.rejected, (state, action) => {
        state.status = "rejected";

        if (action.error) {
          state.error = action.error.message;
        }

        return state;
      });
  },
});

export const genesReducer = slice.reducer;

export const selectGenesState = (state: any) =>
  state.oncogrid.genes;

export const selectGenesData = (
  state: CoreState,
): CoreDataSelectorResponse<GenesState> => {
  return {
    data: state.oncogrid.genes.data,
    status: state.oncogrid.genes.status,
    error: state.oncogrid.genes.error,
  };
};

export const useOncoGridGenes = createUseCoreDataHook(
  fetchGenes,
  selectGenesData,
);