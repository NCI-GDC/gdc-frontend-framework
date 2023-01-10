import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isEqual } from "lodash";
import { FilterGroup } from "@gff/core";
import { AppState } from "./appApi";

const initialState: FilterGroup[] = [];

const slice = createSlice({
  name: "geneFrequencyApp/filterGroups",
  initialState,
  reducers: {
    addNewFilterGroups: (state, action: PayloadAction<FilterGroup[]>) => {
      return [...state, ...action.payload];
    },
    removeFilterGroup: (state, action: PayloadAction<FilterGroup>) => {
      return state.filter((group) => !isEqual(group, action.payload));
    },
  },
});

export const geneFrequencyFilterGroupReducer = slice.reducer;
export const { addNewFilterGroups, removeFilterGroup } = slice.actions;
export const selectFilterGroups = (state: AppState): FilterGroup[] =>
  state.groups;
