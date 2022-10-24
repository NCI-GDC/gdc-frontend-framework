import { projectCenterFiltersReducer } from "./projectCenterFiltersSlice";
import { createAppStore } from "@gff/core";

// create the store, context and selector for the ProjectsCenter
// Note the project app has a local store and context which isolates
// the filters and other store/cache values

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: projectCenterFiltersReducer,
    name: "ProjectCenter",
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof projectCenterFiltersReducer>;
