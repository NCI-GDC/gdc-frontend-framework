import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import { cohortReducers } from "./features/cohort/cohortSlice";
import { sessionReducer } from "./features/session/sessionSlice";
import { facetsReducer } from "./features/facets/facetSlice";
import { fileCaseGenesMutationsFacetReducers } from "./features/facets/facetSliceGQL";
import { gdcAppReducer } from "./features/gdcapps/gdcAppsSlice";
import { filesReducer } from "./features/files/filesSlice";
import { projectsReducer } from "./features/projects/projectsSlice";
import { annotationsReducer } from "./features/annotations/annotationsSlice";
import { casesReducer } from "./features/cases/casesSlice";
import { ssmPlotReducer } from "./features/cancerDistribution/ssmPlot";
import { cnvPlotReducer } from "./features/cancerDistribution/cnvPlot";
import { survivalReducer } from "./features/survival/survivalSlice";
import { oncoGridReducer } from "./features/oncoGrid/oncoGridSlice";
import { genomicReducers } from "./features/genomic/genomicSlice";
import { imageDetailsReducer } from "./features/imageDetails/imageDetailsSlice";
import { imageViewerReducer } from "./features/imageDetails/imageViewer";
import { cohortComparisonReducer } from "./features/cohortComparison";
import { bannerReducer } from "./features/bannerNotification";
import { cartReducer } from "./features/cart/cartSlice";
import {
  cohortApiReducer,
  cohortApiSliceReducerPath,
} from "./features/api/cohortApiSlice";

export const reducers = combineReducers({
  cohort: cohortReducers,
  session: sessionReducer,
  facets: facetsReducer, // TODO: Pick which one to use in V2
  facetsGQL: fileCaseGenesMutationsFacetReducers,
  gdcApps: gdcAppReducer,
  files: filesReducer,
  projects: projectsReducer,
  annotations: annotationsReducer,
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
  [cohortApiSliceReducerPath]: cohortApiReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart"],
};

export const coreReducers = persistReducer(persistConfig, reducers);
export type CoreState = ReturnType<typeof coreReducers>;
