import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  fetchGdcEntities,
  GdcApiRequest,
  GdcApiResponse,
} from "../gdcapi/gdcapi";

export interface caseFileType {
  access: "open" | "controlled";
  acl: Array<string>;
  data_type: string;
  file_id: string;
  file_name: string;
  file_size: number;
  state: string;
}
export interface caseSummaryDefaults {
  annotations?: Array<{ annotation_id: string }>;
  case_id: string;
  disease_type: string;
  files?: Array<caseFileType>;
  id: string;
  primary_site: string;
  project: {
    name: string;
    program: {
      name: string;
    };
    project_id: string;
  };
  submitter_id: string;
  summary: {
    data_categories: Array<{
      data_category: string;
      file_count: number;
    }>;
    experimental_strategies: Array<{
      experimental_strategy: string;
      file_count: number;
    }>;
    file_count: number;
  };
}

export const fetchGdcCaseSummary = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<caseSummaryDefaults>> => {
  return fetchGdcEntities("cases", request);
};

export interface CaseSummaryState {
  readonly casesData: CoreDataSelectorResponse<caseSummaryDefaults>;
}

export const caseSummaryinitialState: CaseSummaryState = {
  casesData: {
    status: "uninitialized",
  },
};

export const fetchCasesSummary = createAsyncThunk<
  GdcApiResponse<caseSummaryDefaults>,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
>("cases/fetchCases", async (request?: GdcApiRequest) => {
  return fetchGdcCaseSummary(request);
});

const slice = createSlice({
  name: "caseSummary",
  initialState: caseSummaryinitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCasesSummary.fulfilled, (state, action) => {
        const response = action.payload.data.hits[0];
        state.casesData.data = { ...response };
        state.casesData.status = "fulfilled";
        state.casesData.error = undefined;

        return state;
      })
      .addCase(fetchCasesSummary.pending, (state) => {
        state.casesData = {
          data: undefined,
          status: "pending",
          error: undefined,
        };
        return state;
      })
      .addCase(fetchCasesSummary.rejected, (state) => {
        state.casesData = {
          data: undefined,
          status: "rejected",
          error: undefined,
        };
        return state;
      });
  },
});

export const caseSummarySliceReducer = slice.reducer;

export const selectCaseSummaryData = (
  state: CoreState,
): CoreDataSelectorResponse<caseSummaryDefaults> => {
  return state.caseSummary.casesData;
};

export const useCaseSummary = createUseCoreDataHook(
  fetchCasesSummary,
  selectCaseSummaryData,
);
