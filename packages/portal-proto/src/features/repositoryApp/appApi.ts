import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer, createMigrate } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { repositoryConfigReducer } from "./repositoryConfigSlice";
import { repositoryFiltersReducer } from "./repositoryFiltersSlice";
import { repositoryFacetsGQLReducer } from "./repositoryFacetSlice";
import { createAppStore, AppDataSelectorResponse } from "@gff/core";
import { imageCountsReducer } from "@/features/repositoryApp/slideCountSlice";
import { repositoryRangeFacetsReducer } from "@/features/repositoryApp/repositoryRangeFacet";
import RepositoryDefaultConfig from "./config/filters.json";
import { repositoryExpandedReducer } from "./repositoryFilterExpandedSlice";

const REPOSITORY_APP_NAME = "DownloadApp";

const downloadAppReducers = combineReducers({
  facets: repositoryConfigReducer,
  filters: repositoryFiltersReducer,
  images: imageCountsReducer,
  facetBuckets: repositoryFacetsGQLReducer,
  facetRanges: repositoryRangeFacetsReducer,
  filtersExpanded: repositoryExpandedReducer,
});

const migrations = {
  2: (state) => {
    return {
      ...state,
      facets: {
        customFacets: state.facets.facets.filter(
          (facet) => !RepositoryDefaultConfig.facets.includes(facet),
        ),
      },
    };
  },
};

const persistConfig = {
  key: REPOSITORY_APP_NAME,
  version: 2,
  storage,
  whitelist: ["facets", "filters", "filtersExpanded"],
  migrate: createMigrate(migrations),
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

export type AppDispatch = typeof AppStore.dispatch;

export interface AppDataSelector<T> {
  (state: AppState): AppDataSelectorResponse<T>;
}
