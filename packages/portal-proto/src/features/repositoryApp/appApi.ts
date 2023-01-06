import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { repositoryConfigReducer } from "./repositoryConfigSlice";
import { repositoryFiltersReducer } from "./repositoryFiltersSlice";
import { createAppStore } from "@gff/core";

const REPOSITORY_APP_NAME = "DownloadApp";

const downloadAppReducers = combineReducers({
  facets: repositoryConfigReducer,
  filters: repositoryFiltersReducer,
});

const persistConfig = {
  key: REPOSITORY_APP_NAME,
  version: 1,
  storage,
  whitelist: ["facets", "filters"],
};

// create the store, context and selector for the RepositoryApp
// Note the repository app has a local store and context which isolates
// the app's filters and other store/cache values

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: persistReducer(persistConfig, downloadAppReducers),
    name: REPOSITORY_APP_NAME,
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof downloadAppReducers>;
