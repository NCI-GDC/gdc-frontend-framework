import { createAppStore } from "@gff/core";
import { annotationBrowserReducer } from "./annotationBrowserFilterSlice";

const PROJECT_APP_NAME = "AnnotationBrowser";

const reducers = annotationBrowserReducer;

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers,
    name: PROJECT_APP_NAME,
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof reducers>;
