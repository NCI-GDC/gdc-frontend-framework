import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./appApi";

const expandSlice = createSlice({
  name: "projectCenter/filterExpand",
  initialState: {},
  reducers: {
    toggleProjectFilter: (
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

export const projectCenterExpandedReducer = expandSlice.reducer;

export const { toggleProjectFilter, toggleAllFilters } = expandSlice.actions;

export const selectFilterExpanded = (state: AppState, field: string): boolean =>
  state.projectExpandedState?.[field];

export const selectAllFiltersCollapsed = (state: AppState): boolean =>
  Object.values(state.projectExpandedState).every((e) => !e);
