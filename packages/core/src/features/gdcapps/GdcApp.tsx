import React, { ComponentType, useEffect } from "react";
import { coreStore } from "../../store";
import { v5 as uuidv5 } from "uuid";
import { addGdcAppMetadata, EntityType } from "./gdcAppsSlice";
import { configureStore, AnyAction } from "@reduxjs/toolkit";
import { Store, Action } from "redux";
import {
  Provider,
  ReactReduxContextValue,
  TypedUseSelectorHook,
  createSelectorHook,
  createDispatchHook,
  createStoreHook,
} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { registerGdcApp } from "./gdcAppRegistry";
import { DataStatus } from "../../dataAccess";
import { CookiesProvider } from "react-cookie";

// using a random uuid v4 as the namespace
const GDC_APP_NAMESPACE = "0bd921a8-e5a7-4e73-a63c-e3f872798061";

export interface CreateGdcAppOptions {
  readonly App: ComponentType;
  readonly name: string;
  readonly version: string;
  readonly requiredEntityTypes: ReadonlyArray<EntityType>;
}

export const createGdcApp = (options: CreateGdcAppOptions): React.ReactNode => {
  const { App, name, version, requiredEntityTypes } = options;

  // create a stable id for this app
  const nameVersion = `${name}::${version}`;
  const id = uuidv5(nameVersion, GDC_APP_NAMESPACE);

  // need to create store and provider.
  // return a component representing this app
  // if component gets added to a list, then the list can be iterated in index.js and each provider component can be added
  // a route can be setup for the app

  // need to register its name, category, path, data requirements
  // this will be used to build page3
  // click app link
  const store = configureStore({
    // TODO allow user to pass in a reducer in CreateGdcAppOptions?
    reducer: (state) => state,
    devTools: {
      name: `${nameVersion}::${id}`,
    },
  });

  const GdcAppWrapper: React.FC = () => {
    useEffect(() => {
      document.title = `GDC - ${name}`;
    });

    return (
      <Provider store={store}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </Provider>
    );
  };

  // add the app to the store
  coreStore.dispatch(
    addGdcAppMetadata({
      id,
      name,
      version,
      requiredEntityTypes,
    }),
  );
  registerGdcApp(id, GdcAppWrapper);

  return GdcAppWrapper;
};

export interface AppDataSelectorResponse<T> {
  readonly data?: T;
  readonly status: DataStatus;
  readonly error?: string;
}

export interface CreateGDCAppStore {
  readonly name: string;
  readonly version: string;
  readonly reducers: (...args: any) => any;
}

// ----------------------------------------------------------------------------------------
// Apps with Local Storage
//

export const createAppStore = (
  options: CreateGDCAppStore,
): Record<any, any> => {
  const { name, version, reducers } = options;
  const nameVersion = `${name}::${version}`;
  const id = uuidv5(nameVersion, GDC_APP_NAMESPACE);

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
  type AppState = ReturnType<typeof reducers>;
  const context = React.createContext(
    undefined as unknown as ReactReduxContextValue<AppState, AnyAction>,
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

export interface CreateGdcAppWithOwnStoreOptions<
  A extends Action = AnyAction,
  S = any,
> {
  readonly App: ComponentType;
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly requiredEntityTypes: ReadonlyArray<EntityType>;
  readonly store: Store<S, A>;
  readonly context: any;
}

export const createGdcAppWithOwnStore = <A extends Action = AnyAction, S = any>(
  options: CreateGdcAppWithOwnStoreOptions<A, S>,
): React.ReactNode => {
  const { App, id, name, version, requiredEntityTypes, store, context } =
    options;

  // need to create store and provider.
  // return a component representing this app
  // if component gets added to a list, then the list can be iterated in index.js and each provider component can be added
  // a route can be setup for the app

  // need to register its name, category, path, data requirements
  // this will be used to build page3
  // click app link

  const GdcAppWrapper: React.FC = () => {
    useEffect(() => {
      document.title = `GDC - ${name}`;
    });

    return (
      <Provider store={store} context={context}>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </Provider>
    );
  };

  // add the app to the store
  coreStore.dispatch(
    addGdcAppMetadata({
      id,
      name,
      version,
      requiredEntityTypes,
    }),
  );
  registerGdcApp(id, GdcAppWrapper);
  return GdcAppWrapper;
};

export const createGdcAppWithPersistentStore = <
  A extends Action = AnyAction,
  S = any,
>(
  options: CreateGdcAppWithOwnStoreOptions<A, S>,
): React.ReactNode => {
  const { App, id, name, version, requiredEntityTypes, store, context } =
    options;

  const GdcAppWrapper: React.FC = () => {
    useEffect(() => {
      document.title = `GDC - ${name}`;
    });

    const persistor = persistStore(store);

    return (
      <Provider store={store} context={context}>
        <CookiesProvider>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </CookiesProvider>
      </Provider>
    );
  };

  // add the app to the store
  coreStore.dispatch(
    addGdcAppMetadata({
      id,
      name,
      version,
      requiredEntityTypes,
    }),
  );
  registerGdcApp(id, GdcAppWrapper);
  return GdcAppWrapper;
};
