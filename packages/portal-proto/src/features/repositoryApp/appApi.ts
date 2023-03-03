import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { repositoryConfigReducer } from "./repositoryConfigSlice";
import { repositoryFiltersReducer } from "./repositoryFiltersSlice";
import { createAppStore, AppDataSelectorResponse } from "@gff/core";
import { imageCountsReducer } from "@/features/repositoryApp/slideCountSlice";

const REPOSITORY_APP_NAME = "DownloadApp";

const downloadAppReducers = combineReducers({
  facets: repositoryConfigReducer,
  filters: repositoryFiltersReducer,
  images: imageCountsReducer,
});

const persistConfig = {
  key: REPOSITORY_APP_NAME,
  version: 1,
  storage,
  debug: true,
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

export interface AppDataSelector<T> {
  (state: AppState): AppDataSelectorResponse<T>;
}
