import { combineReducers } from "redux";
import { createAppStore } from "@gff/core";
import { projectCenterFiltersReducer } from "./projectCenterFiltersSlice";
import { pickedProjectsReducer } from "./pickedProjectsSlice";

// create the store, context and selector for the ProjectsCenter
// Note the project app has a local store and context which isolates
// the filters and other store/cache values

const reducers = combineReducers({
  projectApp: projectCenterFiltersReducer,
  selected: pickedProjectsReducer,
});

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: reducers,
    name: "ProjectCenter",
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof reducers>;
