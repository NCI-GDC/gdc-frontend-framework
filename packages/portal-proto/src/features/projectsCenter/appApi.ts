import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createAppStore } from "@gff/core";
import { projectCenterFiltersReducer } from "./projectCenterFiltersSlice";

const persistConfig = {
  key: "ProjectCenter",
  version: 1,
  storage,
  whitelist: ["filters"],
};

// create the store, context and selector for the ProjectsCenter
// Note the project app has a local store and context which isolates
// the filters and other store/cache values

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: persistReducer(persistConfig, projectCenterFiltersReducer),
    name: "ProjectCenter",
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof projectCenterFiltersReducer>;
