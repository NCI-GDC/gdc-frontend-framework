import { createAppStore } from "@gff/core";
import { annotationBrowserReducer } from "./annotationBrowserFilterSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { annotationBrowserExpandReducer } from "./annotationBrowserExpandSlice";

const PROJECT_APP_NAME = "AnnotationBrowser";

const reducers = combineReducers({
  annotationBrowserFilterState: annotationBrowserReducer,
  annotationExpandState: annotationBrowserExpandReducer,
});

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers,
    name: PROJECT_APP_NAME,
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof reducers>;
