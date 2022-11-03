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
  clearCaseSet,
  setCurrentCohortId,
  cohortSelectors,
} from "./features/cohort/availableCohortsSlice";
import { createCaseSet } from "./features/cohort/availableCohortsSlice";
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
    const cohort = cohortSelectors.selectById(
      listenerApi.getState(),
      listenerApi.getState().cohort.availableCohorts.currentCohort,
    );
    if (cohort === undefined) return;
    if (
      cohort.filters == undefined ||
      Object.entries(cohort.filters.root).length === 0
    )
      await listenerApi.dispatch(clearCaseSet());
    else
      await listenerApi.dispatch(
        createCaseSet({ index: "explore", caseSetId: cohort.id }),
      );
  },
});

startCoreListening({
  matcher: isAnyOf(clearCohortFilters),
  effect: async (_, listenerApi) => {
    // dispatch clearCohortFilters executed
    await listenerApi.dispatch(clearCaseSet());
  },
});

startCoreListening({
  matcher: isAnyOf(setCurrentCohortId),
  effect: async (_, listenerApi) => {
    const cohort = cohortSelectors.selectById(
      listenerApi.getState(),
      listenerApi.getState().cohort.availableCohorts.currentCohort,
    ); // not cohort or no filters do not create a caseSet
    if (cohort === undefined) return;
    if (
      cohort.filters == undefined ||
      Object.entries(cohort.filters.root).length === 0
    )
      return;
    // cohort switched to a cohort that has defined filters
    // so (re)create a caseSetId in the explore index using the cohortId as the caseSetId to
    // minimize the number of caseSet ids
    await listenerApi.dispatch(
      createCaseSet({ index: "explore", caseSetId: cohort.id }),
    );
  },
});
