import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DataStatus, CoreDataSelectorResponse } from "../../dataAccess";
import { CoreDispatch } from "../../store";
import { CoreState } from "../../reducers";
import { getGdcHistory, HistoryDefaults } from "../gdcapi/gdcapi";

export const fetchHistory = createAsyncThunk<
  ReadonlyArray<HistoryDefaults>,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("facet/fetchHistory", async (uuid: string) => {
  return await getGdcHistory(uuid);
});

export interface HistoryState {
  // history by project id
  readonly history: Record<string, HistoryDefaults[]>;
  readonly status: DataStatus;
  readonly error?: string;
  readonly requestId?: string;
}

const initialState: HistoryState = {
  history: {},
  status: "uninitialized",
};

const slice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;

        //history only available through individual project api call
        const response = action.payload;
        const uuid = action?.meta?.arg;

        if (response?.length) {
          state.history = {
            [uuid]: [...response],
          };
        } else {
          state.history = {};
        }
        state.status = "fulfilled";
        return state;
      })
      .addCase(fetchHistory.pending, (state, action) => {
        state.status = "pending";
        state.requestId = action.meta.requestId;
        state.error = undefined;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;
        state.status = "rejected";
        // TODO get error from action
        state.error = undefined;
        return state;
      });
  },
});

export const historyReducer = slice.reducer;

export const selectHistoryState = (state: CoreState): HistoryState =>
  state.history;

export const selectHistory = (
  state: CoreState,
): ReadonlyArray<HistoryDefaults[]> => {
  return Object.values(state.history.history);
};

export const selectHistoryData = (
  state: CoreState,
): CoreDataSelectorResponse<ReadonlyArray<HistoryDefaults[]>> => {
  return {
    data: Object.values(state.history.history),
    status: state.history.status,
    error: state.history.error,
  };
};
