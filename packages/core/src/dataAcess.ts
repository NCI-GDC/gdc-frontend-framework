/*
 * Data Access Hooks
 */

import { useEffect } from "react";
import { useCoreDispatch, useCoreSelector } from "./hooks";
import { CoreState } from "./store";

/**
 * The status of asynchronous data fetching is a state machine.
 * - Before data is fetched, the status is "uninitialized".
 * - Once a data request is started, the status transitions from
 * "uninitialized" to "pending".
 * - If the data request successfully complets, then the status
 * transitions from "pending" to "fulfilled".
 * - If the data request fails for any reason, then the status
 * transitions from "pending" to "rejected".
 */
export type DataStatus = "uninitialized" | "pending" | "fulfilled" | "rejected";

export interface UseCoreDataResponse<T> {
  readonly data?: T;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

export interface CoreDataSelectorResponse<T> {
  readonly data?: T;
  readonly status: DataStatus;
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


export interface CoreDataValueSelector<T> {
  (state: CoreState): T;
}

export const createUseFiltersCoreDataHook = <P, A, T, F>(
  fetchDataActionCreator: FetchDataActionCreator<P, A>,
  dataSelector: CoreDataSelector<T>,
  secondarySelector: CoreDataValueSelector<F>
): UserCoreDataHook<P, T> => {
  return (...params: P[]): UseCoreDataResponse<T> => {
    const coreDispatch = useCoreDispatch();
    const { data, status, error } = useCoreSelector(dataSelector);
    const action = fetchDataActionCreator(...params);
    const secondary = useCoreSelector(secondarySelector)

    useEffect(() => {
      if (status === "uninitialized") {
        // createDispatchHook types forces the input to AnyAction, which is
        // not compatible with thunk actions. hence, the `as any` cast. ;(
        coreDispatch(action as any); // eslint-disable-line
      }
    }, [status, coreDispatch, action]);

    useEffect(() => {
        coreDispatch(action as any); // eslint-disable-line
    }, [ secondary]);


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

export const createUseMultipleFiltersCoreDataHook = <P, A, T, F, G>(
  fetchDataActionCreator: FetchDataActionCreator<P, A>,
  dataSelector: CoreDataSelector<T>,
  secondarySelector: CoreDataValueSelector<F>,
  tertiarySelector: CoreDataValueSelector<G>
): UserCoreDataHook<P, T> => {
  return (...params: P[]): UseCoreDataResponse<T> => {
    const coreDispatch = useCoreDispatch();
    const { data, status, error } = useCoreSelector(dataSelector);
    const action = fetchDataActionCreator(...params);
    const secondary = useCoreSelector(secondarySelector)
    const tertiary = useCoreSelector(tertiarySelector)

    useEffect(() => {
      if (status === "uninitialized") {
        // createDispatchHook types forces the input to AnyAction, which is
        // not compatible with thunk actions. hence, the `as any` cast. ;(
        coreDispatch(action as any); // eslint-disable-line
      }
    }, [status, coreDispatch, action]);

    useEffect(() => {
      coreDispatch(action as any); // eslint-disable-line
    }, [ secondary, tertiary]);


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





