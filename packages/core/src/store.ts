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

import { coreReducers, apiSpliceMW } from "./reducers";

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
    }).concat(apiSpliceMW),
});

setupListeners(coreStore.dispatch);

export type CoreDispatch = typeof coreStore.dispatch;
