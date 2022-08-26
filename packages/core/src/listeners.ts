import {
  createListenerMiddleware,
  addListener,
  isAnyOf,
} from "@reduxjs/toolkit";
import type { TypedStartListening, TypedAddListener } from "@reduxjs/toolkit";
import { CoreDispatch } from "./store";
import { CoreState } from "./reducers";
import {
  updateCohortFilter,
  removeCohortFilter,
  clearCohortFilters,
} from "./features/cohort/cohortFilterSlice";
import { createCaseSet, clearCaseSet } from "./features/cohort/caseSetSlice";

/**
 * Defines coreListeners for adding middleware.
 * This listener will dispatch a createCaseSet each time the
 * current cohort filters mutate.
 */

export const caseSetListenerMiddleware = createListenerMiddleware();
export type CoreStartListening = TypedStartListening<CoreState, CoreDispatch>;

export const startCoreListening =
  caseSetListenerMiddleware.startListening as CoreStartListening;

export const addAppListener = addListener as TypedAddListener<
  CoreState,
  CoreDispatch
>;

startCoreListening({
  matcher: isAnyOf(updateCohortFilter, removeCohortFilter),
  effect: async (_, listenerApi) => {
    // dispatch updateCohortFilter or removeCohortFilter executed
    if (
      listenerApi.getState().cohort.currentFilters.filters == undefined ||
      Object.entries(listenerApi.getState().cohort.currentFilters.filters.root)
        .length === 0
    )
      await listenerApi.dispatch(clearCaseSet());
    else await listenerApi.dispatch(createCaseSet({ index: "repository" }));
  },
});

startCoreListening({
  matcher: isAnyOf(clearCohortFilters),
  effect: (_, listenerApi) => {
    // dispatch clearCohortFilters executed
    listenerApi.dispatch(clearCaseSet());
  },
});
