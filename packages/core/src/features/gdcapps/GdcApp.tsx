import { coreStore } from "../../store";
import { v5 as uuidv5 } from "uuid";
import { addGdcAppMetadata, EntityType } from "./gdcAppsSlice";
import { configureStore, ReducersMapObject, AnyAction, EnhancedStore } from "@reduxjs/toolkit";
import { ComponentType, useEffect } from "react";
import { Provider,
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  ReactReduxContextValue,
  TypedUseSelectorHook, } from "react-redux";

import React from "react";
import { registerGdcApp } from "./gdcAppRegistry";
import {
  DataStatus,
} from "../../dataAcess";



// using a random uuid v4 as the namespace
const GDC_APP_NAMESPACE = "0bd921a8-e5a7-4e73-a63c-e3f872798061";

export interface CreateGDCAppStore {
  readonly name: string;
  readonly version: string;
  readonly reducer?: ReducersMapObject<any, AnyAction>;
}

export interface CreateGdcAppOptions extends CreateGDCAppStore {
  readonly name: string;
  readonly version: string;
  readonly requiredEntityTypes: ReadonlyArray<EntityType>;
  readonly App: ComponentType;
  readonly reducer?: ReducersMapObject<any, AnyAction>;
}

export interface CreateGdcAppWithStoreOptions {
  readonly name: string;
  readonly version: string;
  readonly requiredEntityTypes: ReadonlyArray<EntityType>;
  readonly App: ComponentType;
  store: EnhancedStore<any, AnyAction> ;
  context:any;
}

export const createAppStore = (options : CreateGDCAppStore) => {
  const { name, version, reducer } = options;
  const nameVersion = `${name}::${version}`;
  const id = uuidv5(nameVersion, GDC_APP_NAMESPACE);

  const store = configureStore({
    // TODO allow user to pass in a reducer in CreateGdcAppOptions?
    reducer: reducer ? reducer :  (state) => state,
    devTools: {
      name: `${nameVersion}::${id}`,
    },
  });
  type AppState = ReturnType<typeof store.getState>;
  const context  = React.createContext(
    undefined as unknown as ReactReduxContextValue<AppState, AnyAction>,
  );

   type AppDispatch = typeof store.dispatch;
   const useAppSelector: TypedUseSelectorHook<AppState> = createSelectorHook(context);
   const useAppDispatch: () => AppDispatch =  createDispatchHook(context);
   const useAppStore = createStoreHook(context);

  return {
    AppStore: store,
    AppContext: context,
    useAppSelector: useAppSelector,
    useAppDispatch: useAppDispatch,
    useAppStore: useAppStore,
  }
}

export const createGdcAppWithOwnStore = (options: CreateGdcAppWithStoreOptions) => {
  const {  name, version, store, context, App,  requiredEntityTypes } = options;
  const nameVersion = `${name}::${version}`;
  const id = uuidv5(nameVersion, GDC_APP_NAMESPACE);
  const GdcAppWrapper: React.FC = () => {
    useEffect(() => {
      document.title = `GDC - ${name}`;
    });

    return (
      <Provider store={store} context={context}>
        <App />
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
}

export const createGdcApp = (options: CreateGdcAppOptions): React.ReactNode => {
  const { App, name, version, requiredEntityTypes,} = options;

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
    reducer:  (state) => state,
    devTools: {
      name: `${nameVersion}::${id}`,
    },
  });

  const GdcAppWrapper: React.FC = () => {
    useEffect(() => {
      document.title = `GDC - ${name}`;
    });

    return (
      <Provider store={store} >
        <App />
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
}

export interface AppDataSelectorResponse<T> {
  readonly data?: T;
  readonly status: DataStatus;
  readonly error?: string;
}
