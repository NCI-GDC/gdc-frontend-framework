import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";
import { CoreState } from "../../reducers";

export type SetTypes = "cases" | "genes" | "ssms";

const initialState: Record<SetTypes, Record<string, string>> = {
  cases: {},
  genes: {},
  ssms: {},
};

const slice = createSlice({
  name: "sets",
  initialState,
  reducers: {
    addSets: (
      state,
      action: PayloadAction<
        {
          setType: SetTypes;
          setId: string;
          setName: string;
        }[]
      >,
    ) => {
      state = produce(state, (draft) => {
        action.payload.forEach((set) => {
          const existingSet = Object.entries(state[set.setType]).find(
            ([, name]) => name === set.setName,
          );
          // Replace existing set with the same name
          if (existingSet) {
            delete draft[set.setType][existingSet[0]];
          }
          draft[set.setType][set.setId] = set.setName;
        });
      });
      return state;
    },
    removeSets: (
      state,
      action: PayloadAction<
        {
          setType: SetTypes;
          setId: string;
        }[]
      >,
    ) => {
      state = produce(state, (draft) => {
        action.payload.forEach((set) => {
          delete draft[set.setType][set.setId];
        });
      });
      return state;
    },
    renameSet: (
      state,
      action: PayloadAction<{
        setType: SetTypes;
        setId: string;
        newSetName: string;
      }>,
    ) => {
      state = produce(state, (draft) => {
        draft[action.payload.setType][action.payload.setId] =
          action.payload.newSetName;
      });

      return state;
    },
  },
  extraReducers: {},
});

export const setsReducer = slice.reducer;
export const { addSets, removeSets, renameSet } = slice.actions;

export const selectSetsByType = (
  state: CoreState,
  setType: SetTypes,
): Record<string, string> => state.sets[setType];

export const selectAllSets = (
  state: CoreState,
): Record<SetTypes, Record<string, string>> => state.sets;
