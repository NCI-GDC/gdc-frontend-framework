import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { CoreDispatch, CoreState } from "../../store";
import { GdcApiData } from "../gdcapi/gdcapi";
import {
  createUseCoreDataHook,
  CoreDataSelectorResponse,
  DataStatus,
} from "../../dataAcess";
import { fetchGenes } from "./genesApi";
import { fetchSSMOccurrences } from "./ssmOccurrencesApi";
import { fetchCNVOccurrences } from "./cnvOccurrencesApi";
import { fetchCases } from "./casesApi";
import { Gene, OncoGridDonor, CNVOccurrence, SSMOccurrence } from "./types";
import { selectGenomicAndCohortGqlFilters } from "../genomic/genomicFilters";

interface OncoGridParams {
  readonly consequenceTypeFilters: string[];
  readonly cnvFilters: string[];
}

interface OncoGridResponse {
  readonly warnings: Record<string, string>;
  readonly geneData?: GdcApiData<Gene>;
  readonly ssmData?: GdcApiData<SSMOccurrence>;
  readonly cnvData?: GdcApiData<CNVOccurrence>;
  readonly caseData?: GdcApiData<OncoGridDonor>;
}

export const fetchOncoGrid = createAsyncThunk<
  OncoGridResponse,
  OncoGridParams,
  { dispatch: CoreDispatch; state: CoreState }
>(
  "oncogrid/fetchAll",
  async ({
           consequenceTypeFilters,
           cnvFilters,
         }: OncoGridParams, thunkAPI): Promise<OncoGridResponse> => {

    const contextFilters =  selectGenomicAndCohortGqlFilters(thunkAPI.getState());
    const geneResponse = await fetchGenes(consequenceTypeFilters, contextFilters);

    if (!isEmpty(geneResponse.warnings)) {
      return { warnings: geneResponse.warnings };
    }

    const geneIds = geneResponse.data.hits.map((d) => d.gene_id);
    const caseResponse = await fetchCases(geneIds, consequenceTypeFilters);

    if (!isEmpty(caseResponse.warnings)) {
      return { warnings: caseResponse.warnings };
    }
    const caseIds = caseResponse.data.hits.map((d) => d.case_id);

    return Promise.all([
      fetchCNVOccurrences(geneIds, caseIds, cnvFilters),
      fetchSSMOccurrences(geneIds, caseIds, consequenceTypeFilters),
    ]).then(([cnvResponse, ssmResponse]) => {
      const warnings = cnvResponse.warnings || ssmResponse.warnings;
      return {
        warnings,
        geneData: geneResponse.data,
        ssmData: ssmResponse.data,
        cnvData: cnvResponse.data,
        caseData: caseResponse.data,
      };
    });
  },
);

export interface OncoGridData {
  readonly genes?: Gene[];
  readonly cases?: OncoGridDonor[];
  readonly ssmOccurrences?: SSMOccurrence[];
  readonly cnvOccurrences?: CNVOccurrence[];
}

export interface OncoGridState {
  readonly data: OncoGridData;
  readonly status: DataStatus;
  readonly error?: string;
}

const initialState: OncoGridState = {
  data: {
    genes: [],
    cases: [],
    ssmOccurrences: [],
    cnvOccurrences: [],
  },
  status: "uninitialized",
};

const slice = createSlice({
  name: "oncogrid",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOncoGrid.fulfilled, (state, action) => {
        const response = action.payload;
        if (!isEmpty(response.warnings)) {
          state.data = {};
          state.status = "rejected";
          state.error = response.warnings.filters;
          return state;
        }
        state.status = "fulfilled";
        state.data.genes = [...(response.geneData?.hits || [])];
        state.data.cases = [...(response.caseData?.hits || [])];
        state.data.ssmOccurrences = [...(response.ssmData?.hits || [])];
        state.data.cnvOccurrences = [...(response.cnvData?.hits || [])];
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
): CoreDataSelectorResponse<OncoGridData> => {
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
