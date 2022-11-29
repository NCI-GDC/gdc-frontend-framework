import { combineReducers } from "redux";
import { createAppStore } from "@gff/core";
import { pickedGenesReducer } from "./pickedGenesSlice";
import { geneFrequencyFiltersReducer } from "./geneAndSSMFiltersSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "MutationFrequency",
  version: 1,
  storage,
  whitelist: ["filters"],
};

const reducers = combineReducers({
  filters: geneFrequencyFiltersReducer,
  selectedGenes: pickedGenesReducer,
});

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: persistReducer(persistConfig, reducers),
    name: "MutationFrequency",
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof reducers>;
