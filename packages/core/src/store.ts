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
import { cohortApiSliceMiddleware } from "./features/api/cohortApiSlice";
import { caseSetListenerMiddleware } from "./listeners";

import storage from "./storage-persist";
import { survivalApiSliceMiddleware } from "./features/survival/survivalApiSlice";
import { genesTableApiSliceMiddleware } from "./features/genes/genesTable/genesTableApiSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart", "bannerNotification"],
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
        cohortApiSliceMiddleware,
        survivalApiSliceMiddleware,
        genesTableApiSliceMiddleware,
      )
      .prepend(caseSetListenerMiddleware.middleware), // needs to be prepended
});

setupListeners(coreStore.dispatch);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type CoreDispatch = typeof coreStore.dispatch;
