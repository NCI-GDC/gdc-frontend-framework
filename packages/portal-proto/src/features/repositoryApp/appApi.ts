import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import { repositoryConfigReducer } from "./repositoryConfigSlice";
import { repositoryFiltersReducer } from "./repositoryFiltersSlice";
import { createAppStore } from "@gff/core";
import storage from "redux-persist/lib/storage";

const downloadAppReducers = combineReducers({
  facets: repositoryConfigReducer,
  filters: repositoryFiltersReducer,
});

const persistConfig = {
  key: "downloadApp",
  version: 1,
  storage,
  whitelist: ["facets"],
};

// create the store, context and selector for the RepositoryApp
// Note the repository app has a local store and context which isolates
// the app's filters and other store/cache values

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: persistReducer(persistConfig, downloadAppReducers),
    name: "DownloadApp",
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof downloadAppReducers>;
