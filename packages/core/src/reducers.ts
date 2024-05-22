import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer, createMigrate } from "redux-persist";
import { cohortReducers } from "./features/cohort/cohortSlice";
import { sessionReducer } from "./features/session/sessionSlice";
import { facetsReducer } from "./features/facets/facetSlice";
import { fileCaseGenesMutationsFacetReducers } from "./features/facets/facetSliceGQL";
import { gdcAppReducer } from "./features/gdcapps/gdcAppsSlice";
import {
  filesApiReducer,
  filesApiSliceReducerPath,
} from "./features/files/filesSlice";
import {
  projectsApiReducer,
  projectsApiSliceReducerPath,
} from "./features/projects/projectsSlice";
import {
  projectPrimarySiteApiSliceReducer,
  projectPrimarySiteApiSliceReducerPath,
} from "./features/projects/projectsPrimarySiteSlice";
import { casesReducer } from "./features/cases/casesSlice";
import { genomicReducers } from "./features/genomic/genomicSlice";
import { bannerReducer } from "./features/bannerNotification";
import { cartReducer } from "./features/cart";
import { totalCountsReducer } from "./features/summary/totalCountsSlice";
import {
  cohortApiReducer,
  cohortApiSliceReducerPath,
} from "./features/api/cohortApiSlice";
import {
  allFilesApiReducer,
  allFilesApiSliceReducerPath,
} from "./features/files/allFilesMutation";
import {
  survivalApiSliceReducerPath,
  survivalApiReducer,
} from "./features/survival/survivalApiSlice";
import { clinicalDataAnalysisReducer } from "./features/clinicalDataAnalysis";
import { facetsByNameTypeAndFilterReducer } from "./features/facets/facetsByNameTypeAndFilter";
import { modalReducer } from "./features/modals/modalsSlice";
import {
  quickSearchApiReducer,
  quickSearchApiReducerPath,
} from "./features/quickSearch/quickSearch";
import { versionInfoReducer } from "./features/versionInfo/versionInfoSlice";
import {
  graphqlAPISliceReducerPath,
  graphqlAPIReducer,
} from "./features/gdcapi/gdcgraphql";
import {
  endpointReducer,
  endpointSliceReducerPath,
} from "./features/gdcapi/gdcapi";
import { setsReducer } from "./features/sets";
import { sessionStorage } from "./storage-persist";
import {
  userAuthApiReducer,
  userAuthApiReducerPath,
} from "./features/users/usersSlice";
import {
  historyApiReducer,
  historyApiSliceReducerPath,
} from "./features/history/historySlice";
import {
  bannerNotificationApiReducer,
  bannerNotificationApiSliceReducerPath,
} from "./features/bannerNotification/bannerNotificationSlice";
import {
  imageDetailsApiReducerPath,
  imageDetailsApiReducer,
} from "./features/imageDetails/imageDetailsSlice";

const migrations = {
  2: (state: any) => {
    console.log({ state });
    return {
      ...state,
      cohort: {
        ...state.cohort,
        builderConfig: {
          customFacets: state.cohort.builderConfig.custom.facets,
        },
      },
    };
  },
};

// We want unsaved cohorts to be persisted through a refresh but not through a user ending their session
const cohortPersistConfig = {
  key: "cohort",
  version: 2,
  storage: sessionStorage,
  migrate: createMigrate(migrations),
};

export const reducers = combineReducers({
  cohort: persistReducer(cohortPersistConfig, cohortReducers),
  session: sessionReducer,
  facets: facetsReducer, // TODO: Pick which one to use in V2
  facetsGQL: fileCaseGenesMutationsFacetReducers,
  facetsByNameTypeFilter: facetsByNameTypeAndFilterReducer,
  gdcApps: gdcAppReducer,
  cases: casesReducer,
  genomic: genomicReducers,
  cart: cartReducer,
  bannerNotification: bannerReducer,
  summary: totalCountsReducer,
  clinicalDataAnalysis: clinicalDataAnalysisReducer,
  modals: modalReducer,
  [imageDetailsApiReducerPath]: imageDetailsApiReducer,
  [quickSearchApiReducerPath]: quickSearchApiReducer,
  [filesApiSliceReducerPath]: filesApiReducer,
  [allFilesApiSliceReducerPath]: allFilesApiReducer,
  [projectsApiSliceReducerPath]: projectsApiReducer,
  [projectPrimarySiteApiSliceReducerPath]: projectPrimarySiteApiSliceReducer,
  [cohortApiSliceReducerPath]: cohortApiReducer,
  [survivalApiSliceReducerPath]: survivalApiReducer,
  [graphqlAPISliceReducerPath]: graphqlAPIReducer,
  [endpointSliceReducerPath]: endpointReducer,
  [userAuthApiReducerPath]: userAuthApiReducer,
  [historyApiSliceReducerPath]: historyApiReducer,
  [bannerNotificationApiSliceReducerPath]: bannerNotificationApiReducer,
  versionInfo: versionInfoReducer,
  sets: setsReducer,
});

/**
 * The redux store of the Portal V2 core.
 */

export type CoreState = ReturnType<typeof reducers>;
