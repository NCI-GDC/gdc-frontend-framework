import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createAppStore } from "@gff/core";
import { projectCenterFiltersReducer } from "./projectCenterFiltersSlice";

const PROJECT_APP_NAME = "ProjectCenter";

const persistConfig = {
  key: PROJECT_APP_NAME,
  version: 1,
  storage,
  whitelist: ["projectApp"],
};

// create the store, context and selector for the ProjectsCenter
// Note the project app has a local store and context which isolates
// the filters and other store/cache values

const reducers = combineReducers({
  projectApp: projectCenterFiltersReducer,
});

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: persistReducer(persistConfig, reducers),
    name: PROJECT_APP_NAME,
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof reducers>;
