import {
  createListenerMiddleware,
  isAnyOf,
  isFulfilled,
} from "@reduxjs/toolkit";
import type { TypedStartListening } from "@reduxjs/toolkit";
import { CoreDispatch } from "./store";
import { CoreState } from "./reducers";
import {
  updateCohortFilter,
  removeCohortFilter,
  addNewCohortWithFilterAndMessage,
  selectAvailableCohorts,
  addNewCohort,
  createCaseSetsIfNeeded,
  createCaseSet,
  clearCohortFilters,
} from "./features/cohort/availableCohortsSlice";
import { fetchCohortCaseCounts } from "./features/cohort/cohortCountsQuery";

/**
 * Defines coreListeners for adding middleware.
 * This listener will dispatch a createCaseSet each time the
 * current cohort filters mutate, and it contains a filter entry in REQUIRES_CASE_SET_FILTERS
 */

export const caseSetListenerMiddleware = createListenerMiddleware();
export type CoreStartListening = TypedStartListening<CoreState, CoreDispatch>;

export const startCoreListening =
  caseSetListenerMiddleware.startListening as CoreStartListening;

// TODO add clearCaseSet handler to remove caseSet from the Cohort Persistence GDC API

startCoreListening({
  matcher: isAnyOf(updateCohortFilter, removeCohortFilter, clearCohortFilters),
  effect: async (_, listenerApi) => {
    listenerApi.dispatch(fetchCohortCaseCounts());
  },
});

/**
 * Once the request for the case count is fulfilled, we need to add it to the cohort
 * Optionally if a cohortID is passed in, we can add the case count to that cohort
 * This is used when creating a new cohort from a link, as it is not the current cohort
 */
startCoreListening({
  matcher: isAnyOf(addNewCohortWithFilterAndMessage, addNewCohort),
  effect: async (_, listenerApi) => {
    // the last cohort added is the one we want to get the case count for
    const cohorts = selectAvailableCohorts(listenerApi.getState()).sort(
      (a, b) => (a.modified_datetime <= b.modified_datetime ? 1 : -1),
    );

    const latestCohortId = cohorts[0]?.id;
    listenerApi.dispatch(fetchCohortCaseCounts(latestCohortId));
  },
});

/**
 * If we have a new cohort that requires a case set, we need to create it, even if it's
 * not the current cohort.
 */
startCoreListening({
  matcher: isAnyOf(addNewCohortWithFilterAndMessage),
  effect: async (_action, listenerApi) => {
    const cohorts = selectAvailableCohorts(listenerApi.getState()).sort(
      (a, b) => (a.modified_datetime <= b.modified_datetime ? 1 : -1),
    );
    // This optionally creates a case set if needed for the new cohort
    listenerApi.dispatch(createCaseSetsIfNeeded(cohorts[0]));
  },
});

startCoreListening({
  matcher: isFulfilled(createCaseSet),
  effect: async (action, listenerApi) => {
    // update the cohort case counts when the new case set is ready
    listenerApi.dispatch(fetchCohortCaseCounts(action.meta.arg?.cohortId));
  },
});
