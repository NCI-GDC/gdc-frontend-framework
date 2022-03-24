import { configureStore } from "@reduxjs/toolkit";
import { cohortReducer } from "./features/cohort/cohortSlice";
import { sessionReducer } from "./features/session/sessionSlice";
import { facetsReducer } from "./features/facets/facetSlice";
import { gdcAppReducer } from "./features/gdcapps/gdcAppsSlice";
import { filesReducer } from "./features/files/filesSlice";
import { projectsReducer } from "./features/projects/projectsSlice";
import { annotationsReducer } from "./features/annotations/annotationsSlice";
import { casesReducer } from "./features/cases/casesSlice";
import { ssmsTableReducer } from "./features/ssmsTable/ssmsTableSlice";
import { genesTableReducer } from "./features/genesTable/genesTableSlice";
import { geneFrequencyChartReducer } from "./features/genesTable/genesFrequencyChartSlice";
import { survivalReducer } from "./features/survival/survivalSlice";
import { oncoGridReducer } from "./features/oncoGrid/oncoGridSlice";
import { ssmPlotReducer } from "./features/cancerDistribution/ssmPlot";
import { cnvPlotReducer } from "./features/cancerDistribution/cnvPlot";

export const coreStore = configureStore({
  reducer: {
    cohort: cohortReducer,
    session: sessionReducer,
    facets: facetsReducer,
    gdcApps: gdcAppReducer,
    files: filesReducer,
    projects: projectsReducer,
    annotations: annotationsReducer,
    cases: casesReducer,
    ssmsTable: ssmsTableReducer,
    genesTable: genesTableReducer,
    geneFrequencyChart: geneFrequencyChartReducer,
    ssmPlot: ssmPlotReducer,
    cnvPlot: cnvPlotReducer,
    survival: survivalReducer,
    oncogrid: oncoGridReducer,
  },
  devTools: {
    name: "@gff/core",
  },
});

export type CoreDispatch = typeof coreStore.dispatch;
export type CoreState = ReturnType<typeof coreStore.getState>;
