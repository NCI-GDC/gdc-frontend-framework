import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  fetchGdcEntities,
  GdcApiRequest,
  GdcApiResponse,
} from "../gdcapi/gdcapi";
import { castDraft } from "immer";
import { caseSummaryDefaults } from "./types";

export const fetchGdcCaseSummary = async (
  request?: GdcApiRequest,
): Promise<GdcApiResponse<caseSummaryDefaults>> => {
  return fetchGdcEntities("cases", request);
};

export interface CaseSummaryState {
  readonly data?: caseSummaryDefaults;
  readonly status: DataStatus;
  readonly requestId?: string;
}

export const caseSummaryinitialState: CaseSummaryState = {
  status: "uninitialized",
};

export const fetchCasesSummary = createAsyncThunk<
  GdcApiResponse<caseSummaryDefaults>,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
>("cases/fetchCases", async (request?: GdcApiRequest) =>
  fetchGdcCaseSummary(request),
);

const slice = createSlice({
  name: "caseSummary",
  initialState: caseSummaryinitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCasesSummary.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;

        const response = action.payload.data.hits[0];
        state.data = castDraft(response);
        state.status = "fulfilled";

        return state;
      })
      .addCase(fetchCasesSummary.pending, (state, action) => {
        state.data = undefined;
        state.status = "pending";
        state.requestId = action.meta.requestId;
        return state;
      })
      .addCase(fetchCasesSummary.rejected, (state) => {
        state.data = undefined;
        state.status = "rejected";
        return state;
      });
  },
});

export const caseSummarySliceReducer = slice.reducer;

export const selectCaseSummaryData = (
  state: CoreState,
): CoreDataSelectorResponse<caseSummaryDefaults> => {
  return {
    data: state.caseSummary.data,
    status: state.caseSummary.status,
  };
};

export const useCaseSummary = createUseCoreDataHook(
  fetchCasesSummary,
  selectCaseSummaryData,
);
