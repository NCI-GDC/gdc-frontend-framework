import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { CoreState } from "../../store";
import { GdcApiData, GdcApiResponse } from "../gdcapi/gdcapi";
import {
  createUseCoreDataHook,
  CoreDataSelectorResponse,
  DataStatus,
} from "../../dataAcess";
import { fetchGenes } from "./genesApi";
import { fetchSSMOccurrences } from "./ssmOccurrencesApi";
import { fetchCNVOccurrences } from "./cnvOccurrencesApi";
import { fetchCases } from "./casesApi";

interface OncoGridParams {
  readonly consequenceTypeFilters: string[];
  readonly cnvFilters: string[];
}

interface OncoGridResponse extends GdcApiResponse {
  readonly ssmData?: GdcApiData<any>;
  readonly cnvData?: GdcApiData<any>;
  readonly caseData?: GdcApiData<any>;
}

export const fetchOncoGrid = createAsyncThunk(
  "oncogrid/fetchAll",
  async ({
    consequenceTypeFilters,
    cnvFilters,
  }: OncoGridParams): Promise<OncoGridResponse> => {
    const geneResponse = await fetchGenes(consequenceTypeFilters);

    if (!isEmpty(geneResponse.warnings)) {
      return geneResponse;
    }

    const geneIds = geneResponse.data.hits.map((d) => d.gene_id) as string[];
    const caseResponse = await fetchCases(geneIds, consequenceTypeFilters);

    if (!isEmpty(caseResponse.warnings)) {
      return caseResponse;
    }
    const caseIds = caseResponse.data.hits.map((d) => d.case_id) as string[];

    return Promise.all([
      fetchCNVOccurrences(geneIds, caseIds, cnvFilters),
      fetchSSMOccurrences(geneIds, caseIds, consequenceTypeFilters),
    ]).then(([cnvResponse, ssmResponse]) => {
      const warnings = cnvResponse.warnings || ssmResponse.warnings;
      return {
        warnings,
        data: geneResponse.data,
        ssmData: ssmResponse.data,
        cnvData: cnvResponse.data,
        caseData: caseResponse.data,
      };
    });
  },
);

interface OncoGridData {
  readonly genes?: Record<any, any>[];
  readonly cases?: Record<any, any>[];
  readonly ssmOccurrences?: Record<any, any>[];
  readonly cnvOccurrences?: Record<any, any>[];
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
        state.data.genes = [...response.data.hits];
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
