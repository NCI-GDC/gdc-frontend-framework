import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GDC_APP_API_AUTH } from "../../constants";
import {
  CoreDataSelectorResponse,
  createUseCoreDataHook,
  DataStatus,
} from "../../dataAccess";
import { CoreState } from "../../reducers";
import { CoreDispatch } from "../../store";

export interface QuickSearchState {
  searchList: Array<Record<string, any>>;
  query: string;
  status: DataStatus;
  readonly requestId?: string;
}

const initialState: QuickSearchState = {
  searchList: [],
  query: "",
  status: "uninitialized",
};

interface QuickSearchInterface {
  data: {
    query: {
      hits: Array<Record<string, any>>;
    };
  };
}

export const fetchQuickSearch = createAsyncThunk<
  QuickSearchInterface,
  string,
  { dispatch: CoreDispatch; state: CoreState }
>("quickSearch/fetchQuickSearch", async (searchString: string) => {
  if (searchString.length > 0) {
    const response = await fetch(
      `${GDC_APP_API_AUTH}/quick_search?query=${searchString}&size=5`,
    );
    if (response.ok) {
      return await response.json();
    }

    throw Error(await response.text());
  }
});

const slice = createSlice({
  name: "quickSearch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuickSearch.fulfilled, (state, action) => {
        if (state.requestId != action.meta.requestId) return state;

        const response = action.payload;
        state.searchList = response?.data?.query?.hits;
        state.query = action.meta.arg;
        state.status = "fulfilled";
        return state;
      })
      .addCase(fetchQuickSearch.pending, (state, action) => {
        state.searchList = [];
        state.status = "pending";
        state.requestId = action.meta.requestId;
        return state;
      })
      .addCase(fetchQuickSearch.rejected, (state) => {
        state.searchList = [];
        state.status = "rejected";
        return state;
      });
  },
});

export const quickSearchReducer = slice.reducer;

export const selectSearchLists = (
  state: CoreState,
): CoreDataSelectorResponse<{
  searchList: Array<Record<string, any>>;
  query?: string;
}> => ({
  data: {
    searchList: state.quickSearch.searchList,
    query: state.quickSearch.query,
  },
  status: state.quickSearch.status,
});

export const useQuickSearch = createUseCoreDataHook(
  fetchQuickSearch,
  selectSearchLists,
);
