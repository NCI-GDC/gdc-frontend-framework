import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./appApi";

const expandSlice = createSlice({
  name: "geneFrequencyApp/filterExpand",
  initialState: {},
  reducers: {
    toggleFilter: (
      state,
      action: PayloadAction<{ field: string; expanded: boolean }>,
    ) => {
      return {
        ...state,
        [action.payload.field]: action.payload.expanded,
      };
    },
    toggleAllFilters: (state, action: PayloadAction<boolean>) => {
      return Object.fromEntries(
        Object.keys(state).map((k) => [k, action.payload]),
      );
    },
  },
});

export const geneFrequencyExpandedReducer = expandSlice.reducer;

export const { toggleFilter, toggleAllFilters } = expandSlice.actions;

export const selectFilterExpanded = (state: AppState, field: string): boolean =>
  state.filtersExpanded?.[field];

export const selectAllFiltersCollapsed = (state: AppState): boolean =>
  Object.values(state.filtersExpanded).every((e) => !e);
