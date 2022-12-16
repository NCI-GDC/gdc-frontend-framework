import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";
import { CoreState } from "../../reducers";

export type SetTypes = "case" | "gene" | "ssm";

const initialState: Record<SetTypes, Record<string, string>> = {
  case: {},
  gene: {},
  ssm: {},
};

const slice = createSlice({
  name: "sets",
  initialState,
  reducers: {
    addSet: (
      state,
      action: PayloadAction<{
        setType: SetTypes;
        setName: string;
        setId: string;
      }>,
    ) => {
      state = produce(state, (draft) => {
        const existingSet = Object.entries(state[action.payload.setType]).find(
          ([, name]) => name === action.payload.setName,
        );
        // Replace existing set with the same name
        if (existingSet) {
          delete draft[action.payload.setType][existingSet[0]];
        }
        draft[action.payload.setType][action.payload.setId] =
          action.payload.setName;
      });
      return state;
    },
  },
  extraReducers: {},
});

export const setsReducer = slice.reducer;
export const { addSet } = slice.actions;

export const selectSets = (
  state: CoreState,
  setType: SetTypes,
): Record<string, string> => state.sets[setType];
