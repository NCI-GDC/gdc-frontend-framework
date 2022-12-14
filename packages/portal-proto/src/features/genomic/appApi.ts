import { combineReducers } from "redux";
import {
  AppDataSelectorResponse,
  createAppStore,
  Pagination,
  usePrevious,
} from "@gff/core";
import { geneFrequencyFiltersReducer } from "./geneAndSSMFiltersSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { genomicCaseSetReducer } from "@/features/genomic/genomicCaseSet";
import { useEffect } from "react";
import { isEqual } from "lodash";

const persistConfig = {
  key: "MutationFrequency",
  version: 1,
  storage,
  whitelist: ["filters"],
};

const reducers = combineReducers({
  filters: geneFrequencyFiltersReducer,
  genomicCaseSet: genomicCaseSetReducer,
});

export const { id, AppStore, AppContext, useAppSelector, useAppDispatch } =
  createAppStore({
    reducers: persistReducer(persistConfig, reducers),
    name: "MutationFrequency",
    version: "0.0.1",
  });

export type AppState = ReturnType<typeof reducers>;

export type AppDispatch = typeof AppStore.dispatch;

export interface AppDataSelector<T> {
  (state: AppState): AppDataSelectorResponse<T>;
}

export interface FetchDataActionCreator<P, A> {
  (...params: P[]): A;
}

export interface UseAppDataResponse<T> {
  readonly data?: T;
  readonly error?: string;
  readonly pagination?: Pagination;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

export interface UserAppDataHook<P, T> {
  (...params: P[]): UseAppDataResponse<T>;
}
