import { combineReducers } from "@reduxjs/toolkit";
import { cohortReducers } from "./features/cohort/cohortSlice";
import { sessionReducer } from "./features/session/sessionSlice";
import { facetsReducer } from "./features/facets/facetSlice";
import { fileCaseGenesMutationsFacetReducers } from "./features/facets/facetSliceGQL";
import { gdcAppReducer } from "./features/gdcapps/gdcAppsSlice";
import { filesReducer } from "./features/files/filesSlice";
import { historyReducer } from "./features/history/historySlice";
import { projectsReducer } from "./features/projects/projectsSlice";
import { annotationsReducer } from "./features/annotations/annotationsSlice";
import { casesReducer } from "./features/cases/casesSlice";
import { oncoGridReducer } from "./features/oncoGrid/oncoGridSlice";
import { genomicReducers } from "./features/genomic/genomicSlice";
import { imageDetailsReducer } from "./features/imageDetails/imageDetailsSlice";
import { imageViewerReducer } from "./features/imageDetails/imageViewer";
import { cohortComparisonReducer } from "./features/cohortComparison";
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
  survivalApiSliceReducerPath,
  survivalApiReducer,
} from "./features/survival/survivalApiSlice";
import { biospecimenReducer } from "./features/biospecimen/biospecimenSlice";
import { clinicalDataAnalysisReducer } from "./features/clinicalDataAnalysis";
import { caseSummarySliceReducer } from "./features/cases/caseSummarySlice";
import { facetsByNameTypeAndFilterReducer } from "./features/facets/facetsByNameTypeAndFilter";
import { userDetailsReducer } from "./features/users/usersSlice";
import { modalReducer } from "./features/modals/modalsSlice";
import { quickSearchReducer } from "./features/quickSearch/quickSearch";
import { versionInfoReducer } from "./features/versionInfo/versionInfoSlice";
import { cancerDistributionReducer } from "./features/cancerDistribution";
import {
  graphqlAPISliceReducerPath,
  graphqlAPIReducer,
} from "./features/gdcapi/gdcgraphql";

export const reducers = combineReducers({
  cohort: cohortReducers,
  session: sessionReducer,
  facets: facetsReducer, // TODO: Pick which one to use in V2
  facetsGQL: fileCaseGenesMutationsFacetReducers,
  facetsByNameTypeFilter: facetsByNameTypeAndFilterReducer,
  gdcApps: gdcAppReducer,
  files: filesReducer,
  history: historyReducer,
  projects: projectsReducer,
  annotations: annotationsReducer,
  cases: casesReducer,
  cancerDistribution: cancerDistributionReducer,
  oncogrid: oncoGridReducer,
  genomic: genomicReducers,
  imageDetails: imageDetailsReducer,
  imageViewer: imageViewerReducer,
  cohortComparison: cohortComparisonReducer,
  cart: cartReducer,
  bannerNotification: bannerReducer,
  summary: totalCountsReducer,
  biospecimen: biospecimenReducer,
  clinicalDataAnalysis: clinicalDataAnalysisReducer,
  caseSummary: caseSummarySliceReducer,
  ssms: ssmsReducer,
  genesSummary: genesSummaryReducer,
  userInfo: userDetailsReducer,
  modals: modalReducer,
  quickSearch: quickSearchReducer,
  [cohortApiSliceReducerPath]: cohortApiReducer,
  [survivalApiSliceReducerPath]: survivalApiReducer,
  [graphqlAPISliceReducerPath]: graphqlAPIReducer,
  versionInfo: versionInfoReducer,
});

export type CoreState = ReturnType<typeof reducers>;
