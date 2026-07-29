import { createContext } from "react";
import { configureStore, UnknownAction } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import {
  ReactReduxContextValue,
  TypedUseSelectorHook,
  createSelectorHook,
  createDispatchHook,
  createStoreHook,
} from "react-redux";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { createAppID } from "./GdcApp";

export interface CreateGDCAppStore<AppState> {
  readonly name: string;
  readonly version: string;
  readonly reducers: Reducer<AppState>;
}

export const createAppStore = <AppState>(
  options: CreateGDCAppStore<AppState>,
) => {
  const { name, version, reducers } = options;
  const nameVersion = `${name}::${version}`;
  const id = createAppID(name, version);

  const store = configureStore({
    reducer: reducers,
    devTools: {
      name: `${nameVersion}::${id}`,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  const context = createContext(
    undefined as unknown as ReactReduxContextValue<
      AppState,
      UnknownAction
    > | null,
  );

  type AppDispatch = typeof store.dispatch;
  const useAppSelector: TypedUseSelectorHook<AppState> =
    createSelectorHook(context);
  const useAppDispatch: () => AppDispatch = createDispatchHook(context);
  const useAppStore = createStoreHook(context);

  return {
    id: id,
    AppStore: store,
    AppContext: context,
    useAppSelector: useAppSelector,
    useAppDispatch: useAppDispatch,
    useAppStore: useAppStore,
  };
};
