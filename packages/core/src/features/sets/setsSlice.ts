import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { castDraft } from "immer";
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
        newSet: Record<string, string>;
      }>,
    ) => {
      state = castDraft({
        ...state,
        [action.payload.setType]: {
          ...state[action.payload.setType],
          ...action.payload.newSet,
        },
      });
      return state;
    },
  },
  extraReducers: {},
});

export const setsReducer = slice.reducer;
export const { addSet } = slice.actions;
export const selectSetExists = (
  state: CoreState,
  setType: SetTypes,
  name: string,
): boolean => Object.values(state.sets[setType]).includes(name);

export const selectSets = (
  state: CoreState,
  setType: SetTypes,
): Record<string, string> => state.sets[setType];
