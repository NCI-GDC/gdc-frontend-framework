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
  createTransform,
} from "redux-persist";
import Cookies from "js-cookie";
import { reducers } from "./reducers";
import { allFilesApiSliceMiddleware } from "./features/files/allFilesMutation";
import { cohortApiSliceMiddleware } from "./features/api/cohortApiSlice";
import { coreStoreListenerMiddleware } from "./listeners";
import { survivalApiSliceMiddleware } from "./features/survival/survivalApiSlice";
import { graphqlAPISliceMiddleware } from "./features/gdcapi/gdcgraphql";
import { endpointSliceMiddleware } from "./features/gdcapi/gdcapi";
import { projectApiSliceMiddleware } from "./features/projects/projectsSlice";
import { filesApiSliceMiddleware } from "./features/files/filesSlice";
import storage from "./storage-persist";
import { userAuthApiMiddleware } from "./features/users/usersSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart", "bannerNotification", "sets"],
  transforms: [
    createTransform(
      (inboundState) => {
        return inboundState;
      },
      (outboundState) => {
        // Retrieve context id from local storage when rehydrating the store
        const contextId = localStorage.getItem("gdc_context_id");
        if (contextId) {
          Cookies.remove("gdc_context_id");
          Cookies.set("gdc_context_id", contextId, {
            domain: ".gdc.cancer.gov",
          });
        }
        return outboundState;
      },
    ),
  ],
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
        allFilesApiSliceMiddleware,
        filesApiSliceMiddleware,
        cohortApiSliceMiddleware,
        survivalApiSliceMiddleware,
        graphqlAPISliceMiddleware,
        endpointSliceMiddleware,
        projectApiSliceMiddleware,
        userAuthApiMiddleware,
      )
      .prepend(coreStoreListenerMiddleware.middleware), // needs to be prepended
});

setupListeners(coreStore.dispatch);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export type CoreDispatch = typeof coreStore.dispatch;
