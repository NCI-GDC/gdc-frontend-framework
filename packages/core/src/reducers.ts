import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
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
import { annotationsReducer } from "./features/annotations/annotationsSlice";
import { casesReducer } from "./features/cases/casesSlice";
import { genomicReducers } from "./features/genomic/genomicSlice";
import { imageDetailsReducer } from "./features/imageDetails/imageDetailsSlice";
import { imageViewerReducer } from "./features/imageDetails/imageViewer";
import { bannerReducer } from "./features/bannerNotification";
import { cartReducer } from "./features/cart";
import { totalCountsReducer } from "./features/summary/totalCountsSlice";
import { ssmsReducer } from "./features/genomic/ssmsSummary/ssmsSummarySlice";
import { genesSummaryReducer } from "./features/genomic/geneSummary/geneSummarySlice";

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
import { caseSummarySliceReducer } from "./features/cases/caseSummarySlice";
import { facetsByNameTypeAndFilterReducer } from "./features/facets/facetsByNameTypeAndFilter";
import { modalReducer } from "./features/modals/modalsSlice";
import { quickSearchReducer } from "./features/quickSearch/quickSearch";
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

// We want unsaved cohorts to be persisted through a refresh but not through a user ending their session
const cohortPersistConfig = {
  key: "cohort",
  version: 1,
  storage: sessionStorage,
};

export const reducers = combineReducers({
  cohort: persistReducer(cohortPersistConfig, cohortReducers),
  session: sessionReducer,
  facets: facetsReducer, // TODO: Pick which one to use in V2
  facetsGQL: fileCaseGenesMutationsFacetReducers,
  facetsByNameTypeFilter: facetsByNameTypeAndFilterReducer,
  gdcApps: gdcAppReducer,
  annotations: annotationsReducer,
  cases: casesReducer,
  genomic: genomicReducers,
  imageDetails: imageDetailsReducer,
  imageViewer: imageViewerReducer,
  cart: cartReducer,
  bannerNotification: bannerReducer,
  summary: totalCountsReducer,
  clinicalDataAnalysis: clinicalDataAnalysisReducer,
  caseSummary: caseSummarySliceReducer,
  ssms: ssmsReducer,
  genesSummary: genesSummaryReducer,
  modals: modalReducer,
  quickSearch: quickSearchReducer,
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
  versionInfo: versionInfoReducer,
  sets: setsReducer,
});

/**
 * The redux store of the Portal V2 core.
 */

export type CoreState = ReturnType<typeof reducers>;
