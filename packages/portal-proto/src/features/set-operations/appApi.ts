import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createAppStore } from "@gff/core";
import { cohortCaseSetReducer } from "./cohortCaseSetsSlice";

const SETOPERATIONS_APP_NAME = "SetOperations";

const persistConfig = {
  key: SETOPERATIONS_APP_NAME,
  version: 1,
  storage,
  whitelist: ["setOperationsApp"],
};

// create the store, context and selector for the SetOperations
// The local store and context stores which cohorts have current case sets

const reducers = combineReducers({
  cohortCaseSets: cohortCaseSetReducer,
});

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: persistReducer(persistConfig, reducers),
    name: SETOPERATIONS_APP_NAME,
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof reducers>;
