import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { reducers } from "./reducers";
import { filesApiSliceMiddleware } from "./features/files/allFilesMutation";
import { cohortApiSliceMiddleware } from "./features/api/cohortApiSlice";
import { caseSetListenerMiddleware } from "./listeners";

import storage from "./storage-persist";
import { survivalApiSliceMiddleware } from "./features/survival/survivalApiSlice";
import { graphqlAPISliceMiddleware } from "./features/gdcapi/gdcgraphql";
import { endpointSliceMiddleware } from "./features/gdcapi/gdcapi";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart", "bannerNotification", "cohort", "sets"],
};

export const coreStore = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  devTools: {
    name: "@gff/core",
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(
        filesApiSliceMiddleware,
        cohortApiSliceMiddleware,
        survivalApiSliceMiddleware,
        graphqlAPISliceMiddleware,
        endpointSliceMiddleware,
      )
      .prepend(caseSetListenerMiddleware.middleware), // needs to be prepended
});

setupListeners(coreStore.dispatch);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type CoreDispatch = typeof coreStore.dispatch;
