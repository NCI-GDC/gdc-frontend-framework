import { createSlice } from "@reduxjs/toolkit";
import { CoreState } from "../../reducers";

const initialState = {};

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

export const { addSet, removeSet } = slice.actions;
export const selectSets = (state: CoreState, setType: SetTypes) =>
  state.sets?.[setType] || {};
