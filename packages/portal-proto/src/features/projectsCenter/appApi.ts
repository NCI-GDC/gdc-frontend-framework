import { combineReducers } from "@reduxjs/toolkit";
import { projectCenterFiltersReducer } from "./projectCenterFiltersSlice";
import { createAppStore } from "@gff/core";

const projectCenterAppReducers = combineReducers({
  filters: projectCenterFiltersReducer,
});

// create the store, context and selector for the ProjectsCenter
// Note the project app has a local store and context which isolates
// the filters and other store/cache values

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: projectCenterAppReducers,
    name: "ProjectCenter",
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof projectCenterFiltersReducer>;
