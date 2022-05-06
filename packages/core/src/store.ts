import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import { coreReducers } from "./reducers";
import { cohortApiSliceMiddleware } from "./features/api/cohortApiSlice";

export const coreStore = configureStore({
  reducer: coreReducers,
  devTools: {
    name: "@gff/core",
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(cohortApiSliceMiddleware),
});

setupListeners(coreStore.dispatch);

export type CoreDispatch = typeof coreStore.dispatch;
