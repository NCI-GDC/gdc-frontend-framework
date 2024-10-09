import { combineReducers } from "redux";
import { createAppStore } from "@gff/core";
import { geneFrequencyFiltersReducer } from "./geneAndSSMFiltersSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { geneFrequencyExpandedReducer } from "./geneAndSSMFilterExpandedSlice";

const persistConfig = {
  key: "MutationFrequency",
  version: 1,
  storage,
  whitelist: ["filters", "filtersExpanded"],
};

export const reducers = combineReducers({
  filters: geneFrequencyFiltersReducer,
  filtersExpanded: geneFrequencyExpandedReducer,
});

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: persistReducer(persistConfig, reducers),
    name: "MutationFrequency",
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof reducers>;
