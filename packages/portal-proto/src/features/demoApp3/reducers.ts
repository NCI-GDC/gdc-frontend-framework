import { combineReducers } from "@reduxjs/toolkit";
import { repositoryConfigReducer } from "./fileFiltersSlice";
import { createAppStore } from "@gff/core";

const reducers = combineReducers({ facets: repositoryConfigReducer });

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({ reducers: reducers, name: "Demo App3", version: "0.0.0" });

export type AppState = ReturnType<typeof reducers>;
