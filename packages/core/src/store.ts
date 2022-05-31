import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./storage-persist";
import { cohortReducers } from "./features/cohort/cohortSlice";
import { sessionReducer } from "./features/session/sessionSlice";
import { facetsReducer } from "./features/facets/facetSlice";
import { fileCaseGenesMutationsFacetReducers } from "./features/facets/facetSliceGQL";
import { gdcAppReducer } from "./features/gdcapps/gdcAppsSlice";
import { filesReducer } from "./features/files/filesSlice";
import { projectsReducer } from "./features/projects/projectsSlice";
import { annotationsReducer } from "./features/annotations/annotationsSlice";
import { historyReducer } from "./features/history/historySlice";
import { casesReducer } from "./features/cases/casesSlice";
//import { ssmsTableReducer } from "./features/ssmsTable/ssmsTableSlice";
//import { genesTableReducer } from "./features/genesTable/genesTableSlice";
//import { geneFrequencyChartReducer } from "./features/genesTable/genesFrequencyChartSlice";
import { survivalReducer } from "./features/survival/survivalSlice";
import { oncoGridReducer } from "./features/oncoGrid/oncoGridSlice";
import { genomicReducers } from "./features/genomic/genomicSlice";
import { ssmPlotReducer } from "./features/cancerDistribution/ssmPlot";
import { cnvPlotReducer } from "./features/cancerDistribution/cnvPlot";
import { imageDetailsReducer } from "./features/imageDetails/imageDetailsSlice";
import { imageViewerReducer } from "./features/imageDetails/imageViewer";
import { cartReducer } from "./features/cart/cartSlice";
import { cohortComparisonReducer } from "./features/cohortComparison";
import { bannerReducer } from "./features/bannerNotification";

const reducers = {
  cohort: cohortReducers,
  session: sessionReducer,
  facets: facetsReducer, // TODO: Pick which one to use in V2
  facetsGQL: fileCaseGenesMutationsFacetReducers,
  gdcApps: gdcAppReducer,
  files: filesReducer,
  projects: projectsReducer,
  annotations: annotationsReducer,
  history: historyReducer,
  cases: casesReducer,
  ssmPlot: ssmPlotReducer,
  cnvPlot: cnvPlotReducer,
  survival: survivalReducer,
  oncogrid: oncoGridReducer,
  genomic: genomicReducers,
  imageDetails: imageDetailsReducer,
  imageViewer: imageViewerReducer,
  cohortComparison: cohortComparisonReducer,
  cart: cartReducer,
  bannerNotification: bannerReducer,
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart", "bannerNotification"],
};

const reducer = persistReducer(persistConfig, combineReducers(reducers));

export const coreStore = configureStore({
  reducer,
  devTools: {
    name: "@gff/core",
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

setupListeners(coreStore.dispatch);

export type CoreDispatch = typeof coreStore.dispatch;
export type CoreState = ReturnType<typeof coreStore.getState>;
