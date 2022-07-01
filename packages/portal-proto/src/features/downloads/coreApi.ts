import { combineReducers } from "@reduxjs/toolkit";
import { repositoryConfigReducer } from "./fileFiltersSlice";
import { createAppStore } from "@gff/core";

const downloadAppReducers = combineReducers({
  facets: repositoryConfigReducer,
});

// create the store, context and selector for the DownloadApp
// as the download app has a local store and context which isolates
// the app's filters and other store/cache values

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: downloadAppReducers,
    name: "DownloadApp",
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof downloadAppReducers>;
