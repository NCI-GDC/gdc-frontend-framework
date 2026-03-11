/*
 * Data Access Hooks
 */

import { useEffect, useRef } from "react";
import { useCoreDispatch, useCoreSelector } from "./hooks";
import { CoreState } from "./store";
import { isEqual } from "lodash";
import { Pagination } from "./features/gdcapi/types";

/**
 * The status of asynchronous data fetching is a state machine.
 * - Before data is fetched, the status is "uninitialized".
 * - Once a data request is started, the status transitions from
 * "uninitialized" to "pending".
 * - If the data request successfully completes, then the status
 * transitions from "pending" to "fulfilled".
 * - If the data request fails for any reason, then the status
 * transitions from "pending" to "rejected".
 */
export type DataStatus = "uninitialized" | "pending" | "fulfilled" | "rejected";

export interface UseCoreDataResponse<T> {
  readonly data?: T;
  readonly error?: string;
  readonly pagination?: Pagination;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

export interface CoreDataSelectorResponse<T> {
  readonly data?: T;
  readonly pagination?: Pagination;
  readonly status: DataStatus;
  readonly error?: string;
}

export interface CoreDataSelector<T> {
  (state: CoreState): CoreDataSelectorResponse<T>;
}

export interface FetchDataActionCreator<P, C, A> {
  (params: P, config?: C): A;
}

export interface UseCoreDataHook<P, C, T> {
  (params: P, config?: C): UseCoreDataResponse<T>;
}

/**
 * hook to get the previous state of a prop.
 * See: https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * NOTE: if component using this defines a key prop ensure the key id persist between renders
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const createUseCoreDataHook = <P, C, A, T>(
  fetchDataActionCreator: FetchDataActionCreator<P, C, A>,
  dataSelector: CoreDataSelector<T>,
): UseCoreDataHook<P, C, T> => {
  return (params: P, config?: C): UseCoreDataResponse<T> => {
    const coreDispatch = useCoreDispatch();
    const { data, pagination, status, error } = useCoreSelector(dataSelector);
    const action = fetchDataActionCreator(params, config);
    const prevParams = usePrevious(params);

    useEffect(() => {
      if (status === "uninitialized" || !isEqual(prevParams, params)) {
        // createDispatchHook types forces the input to AnyAction, which is
        // not compatible with thunk actions. hence, the `as any` cast. ;(
        coreDispatch(action as any); // eslint-disable-line
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, coreDispatch, action, params, prevParams]);

    return {
      data,
      error,
      pagination,
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

export const createUseFiltersCoreDataHook = <P, C, A, T, F>(
  fetchDataActionCreator: FetchDataActionCreator<P, C, A>,
  dataSelector: CoreDataSelector<T>,
  secondarySelector: CoreDataValueSelector<F>,
): UseCoreDataHook<P, C, T> => {
  return (params: P, config?: C): UseCoreDataResponse<T> => {
    const coreDispatch = useCoreDispatch();
    const { data, status, error } = useCoreSelector(dataSelector);
    const action = fetchDataActionCreator(params, config);
    const secondary = useCoreSelector(secondarySelector);
    const prevParams = usePrevious<P | undefined>(params);
    const prevSecondary = usePrevious<F>(secondary);

    useEffect(() => {
      if (
        status === "uninitialized" ||
        !isEqual(prevParams, params) ||
        !isEqual(prevSecondary, secondary)
      ) {
        coreDispatch(action as any); // eslint-disable-line
      }
    }, [
      status,
      coreDispatch,
      action,
      prevParams,
      params,
      prevSecondary,
      secondary,
    ]);

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
