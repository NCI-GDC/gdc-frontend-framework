import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
} from "../../dataAcess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import {
  CaseDefaults,
  fetchGdcCases,
  GdcApiRequest,
  GdcApiResponse,
} from "../gdcapi/gdcapi";
import { castDraft } from "immer";

export interface CasesState {
  readonly casesData: CoreDataSelectorResponse<ReadonlyArray<CaseDefaults>>;
}

const initialState: CasesState = {
  casesData: {
    status: "uninitialized",
  },
};

/**
 * The requests argument may go away as the contextual data model is built out.
 */
export const fetchCases = createAsyncThunk<
  GdcApiResponse<CaseDefaults>,
  GdcApiRequest,
  { dispatch: CoreDispatch; state: CoreState }
>("cases/fetchCases", async (request?: GdcApiRequest) => {
  return fetchGdcCases(request);
});

const slice = createSlice({
  name: "cases",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.casesData.data = castDraft(action.payload.data.hits);
        state.casesData.status = "fulfilled";
        state.casesData.error = undefined;
        return state;
      })
      .addCase(fetchCases.pending, (state) => {
        state.casesData = {
          status: "pending",
        };
        return state;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.casesData = {
          status: "rejected",
        };
        if (action.error) {
          state.casesData.error = action.error.message;
        }

        return state;
      });
  },
});

export const casesReducer = slice.reducer;

export const selectCasesData = (
  state: CoreState,
): CoreDataSelectorResponse<ReadonlyArray<CaseDefaults>> => {
  return state.cases.casesData;
};

export const useCases = createUseCoreDataHook(fetchCases, selectCasesData);
