import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import { cohortReducers } from "./features/cohort/cohortSlice";
import { sessionReducer } from "./features/session/sessionSlice";
import { facetsReducer} from "./features/facets/facetSlice";
import { fileCaseGenesMutationsFacetReducers } from "./features/facets/facetSliceGQL";
import { gdcAppReducer } from "./features/gdcapps/gdcAppsSlice";
import { filesReducer } from "./features/files/filesSlice";
import { projectsReducer } from "./features/projects/projectsSlice";
import { annotationsReducer } from "./features/annotations/annotationsSlice";
import { casesReducer } from "./features/cases/casesSlice";
import { ssmsTableReducer } from "./features/ssmsTable/ssmsTableSlice";
//import { genesTableReducer } from "./features/genesTable/genesTableSlice";
//import { geneFrequencyChartReducer } from "./features/genesTable/genesFrequencyChartSlice";
import { survivalReducer } from "./features/survival/survivalSlice";
import { genomicReducers } from "./features/genomic/genomicSlice";

export const coreStore = configureStore({
  reducer: {
    cohort: cohortReducers,
    session: sessionReducer,
    facets: facetsReducer, // TODO: Pick which one to use in V2
    facetsGQL: fileCaseGenesMutationsFacetReducers,
    gdcApps: gdcAppReducer,
    files: filesReducer,
    projects: projectsReducer,
    annotations: annotationsReducer,
    cases: casesReducer,
    ssmsTable: ssmsTableReducer,
    survival: survivalReducer,
    genomic: genomicReducers,
  },
  devTools: {
    name: "@gff/core",
  },
});

setupListeners(coreStore.dispatch)

export type CoreDispatch = typeof coreStore.dispatch;
export type CoreState = ReturnType<typeof coreStore.getState>;
