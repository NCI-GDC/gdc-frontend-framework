import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CoreState } from "../../store";
import { createUseCoreDataHook, CoreDataSelectorResponse, DataStatus } from "../../dataAcess";
import { fetchGenes } from "./genesApi";
import { fetchSSMOccurrences } from "./ssmOccurrencesApi";
import { fetchCNVOccurrences } from "./cnvOccurrencesApi";
import { fetchCases } from "./casesApi";

interface OncoGridParams {
  readonly consequenceTypeFilters: string[];
  readonly cnvFilters: string[];
}

export const fetchOncoGrid = createAsyncThunk(
  "oncogrid/fetchAll",
  async ({ consequenceTypeFilters, cnvFilters }: OncoGridParams) => {
    const geneData = await fetchGenes(consequenceTypeFilters);
    const geneIds = geneData.data.hits.map((d) => d.gene_id) as string[];
    const caseData = await fetchCases(geneIds, consequenceTypeFilters);
    const caseIds = caseData.data.hits.map((d) => d.case_id) as string[];

    let cnvOccurrences;
    let ssmOccurrences;

    await Promise.all([
      fetchCNVOccurrences(geneIds, caseIds, cnvFilters),
      fetchSSMOccurrences(geneIds, caseIds, consequenceTypeFilters),
    ]).then((values) => {
      cnvOccurrences = values[0].data.hits;
      ssmOccurrences = values[1].data.hits;
    });

    return {
      genes: geneData.data.hits,
      cases: geneData.data.hits,
      cnvOccurrences,
      ssmOccurrences,
    };
  },
);

export interface OncoGridState {
  data: any;
  status: DataStatus;
  error?: string;
}

const initialState: OncoGridState = {
  data: {
    genes: [],
    cases: [],
    ssmOccurrences: [],
    cnvOccurences: [],
  },
  status: "uninitialized",
  error: "",
};

const slice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOncoGrid.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.data = action.payload;
        state.error = undefined;
        return state;
      })
      .addCase(fetchOncoGrid.pending, (state) => {
        state.status = "pending";
        return state;
      })
      .addCase(fetchOncoGrid.rejected, (state, action) => {
        state.status = "rejected";

        if (action.error) {
          state.error = action.error.message;
        }

        return state;
      });
  },
});

export const selectOncoGridData = (
  state: CoreState,
): CoreDataSelectorResponse<OncoGridState> => {
  return {
    data: state.oncogrid.data,
    status: state.oncogrid.status,
    error: state.oncogrid.error,
  };
};

export const oncoGridReducer = slice.reducer;

export const useOncoGrid = createUseCoreDataHook(
  fetchOncoGrid,
  selectOncoGridData,
);
