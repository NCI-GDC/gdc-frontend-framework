import { configureStore } from "@reduxjs/toolkit";
import { cohortReducer } from "./features/cohort/cohortSlice";
import { sessionReducer } from "./features/session/sessionSlice";
import { facetsReducer } from "./features/facets/facetSlice";
import { gdcAppReducer } from "./features/gdcapps/gdcAppsSlice";
import { filesReducer } from "./features/files/filesSlice";
import { projectsReducer } from "./features/projects/projectsSlice";
import { casesReducer } from "./features/cases/casesSlice";

export const coreStore = configureStore({
  reducer: {
    cohort: cohortReducer,
    session: sessionReducer,
    facets: facetsReducer,
    gdcApps: gdcAppReducer,
    files: filesReducer,
    projects: projectsReducer,
    cases: casesReducer,
  },
  devTools: {
    name: "@gff/core",
  },
});

export type CoreDispatch = typeof coreStore.dispatch;
export type CoreState = ReturnType<typeof coreStore.getState>;
