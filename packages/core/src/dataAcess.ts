/*
 * Data Access Hooks
 */

import { useEffect } from "react";
import { useCoreDispatch, useCoreSelector } from "./hooks";
import { CoreState } from "./store";

export type StateStatus =
  | "uninitialized"
  | "pending"
  | "fulfilled"
  | "rejected";

export interface UseCoreDataResponse<T> {
  readonly data?: T;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

export interface CoreDataSelectorResponse<T> {
  readonly data: T;
  readonly status: "uninitialized" | "pending" | "fulfilled" | "rejected";
  readonly error?: string;
}

export interface CoreDataSelector<T> {
  (state: CoreState): CoreDataSelectorResponse<T>;
}

export interface FetchDataActionCreator<P, A> {
  (...params: P[]): A;
}

export interface UserCoreDataHook<P, T> {
  (...params: P[]): UseCoreDataResponse<T>;
}

export const createUseCoreDataHook = <P, A, T>(
  fetchDataActionCreator: FetchDataActionCreator<P, A>,
  dataSelector: CoreDataSelector<T>,
): UserCoreDataHook<P, T> => {
  return (...params: P[]): UseCoreDataResponse<T> => {
    const coreDispatch = useCoreDispatch();
    const { data, status, error } = useCoreSelector(dataSelector);
    const action = fetchDataActionCreator(...params);

    useEffect(() => {
      if (status === "uninitialized") {
        // createDispatchHook types forces the input to AnyAction, which is
        // not compatible with thunk actions. hence, the `as any` cast. ;(
        coreDispatch(action as any); // eslint-disable-line
      }
    }, [status, coreDispatch, action]);

    return {
      data,
      error,
      isUninitialized: status === "uninitialized",
      isFetching: status === "pending",
      isSuccess: status === "fulfilled",
      isError: status === "rejected",
    };
  };
};
