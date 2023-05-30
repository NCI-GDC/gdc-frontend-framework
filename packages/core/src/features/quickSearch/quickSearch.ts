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
  status: DataStatus;
}

const initialState: QuickSearchState = {
  searchList: [],
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
        const response = action.payload;

        state.searchList = response?.data?.query?.hits;
        state.status = "fulfilled";
        return state;
      })
      .addCase(fetchQuickSearch.pending, (state) => {
        state.searchList = [];
        state.status = "pending";
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
}> => ({
  data: {
    searchList: state.quickSearch.searchList,
  },
  status: state.quickSearch.status,
});

export const useQuickSearch = createUseCoreDataHook(
  fetchQuickSearch,
  selectSearchLists,
);
