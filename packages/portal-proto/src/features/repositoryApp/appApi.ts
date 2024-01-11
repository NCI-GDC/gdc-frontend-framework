import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";
import { repositoryConfigReducer } from "./repositoryConfigSlice";
import { repositoryFiltersReducer } from "./repositoryFiltersSlice";
import { repositoryFacetsGQLReducer } from "./repositoryFacetSlice";
import { createAppStore, AppDataSelectorResponse } from "@gff/core";
import { imageCountsReducer } from "@/features/repositoryApp/slideCountSlice";
import { repositoryRangeFacetsReducer } from "@/features/repositoryApp/repositoryRangeFacet";

const REPOSITORY_APP_NAME = "DownloadApp";

const facetPersistConfig = {
  key: `${REPOSITORY_APP_NAME}Facets`,
  version: 1,
  storage,
};

const filterPersistConfig = {
  key: `${REPOSITORY_APP_NAME}Filters`,
  version: 1,
  storage: storageSession,
};

const downloadAppReducers = combineReducers({
  facets: persistReducer(facetPersistConfig, repositoryConfigReducer),
  filters: persistReducer(filterPersistConfig, repositoryFiltersReducer),
  images: imageCountsReducer,
  facetBuckets: repositoryFacetsGQLReducer,
  facetRanges: repositoryRangeFacetsReducer,
});

// create the store, context and selector for the RepositoryApp
// Note the repository app has a local store and context which isolates
// the app's filters and other store/cache values

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: downloadAppReducers,
    name: REPOSITORY_APP_NAME,
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof downloadAppReducers>;

export type AppDispatch = typeof AppStore.dispatch;

export interface AppDataSelector<T> {
  (state: AppState): AppDataSelectorResponse<T>;
}
