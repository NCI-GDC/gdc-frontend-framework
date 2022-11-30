import { createSlice } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";

interface SetState {
  gene?: Record<string, string>;
  case?: Record<string, string>;
  mutation?: Record<string, string>;
}

const initialState: SetState = {
  gene: {
    lE1Zv4QB2Fwe_IoCxNcg: "Gene Set 1",
  },
};

type SetTypes = "gene" | "case" | "mutation";

/*
interface SetParams {
  setType: SetTypes;
  id: string;
  name: string;
}
*/

const slice = createSlice({
  name: "sets",
  initialState,
  reducers: {
    addSet: (state) => {
      return state;
    },
    removeSet: (state) => {
      return state;
    },
  },
  extraReducers: {},
});

export const setsReducer = slice.reducer;
export const { addSet, removeSet } = slice.actions;
export const selectSets = (state: CoreState, setType: SetTypes) =>
  state.sets?.[setType] || {};
