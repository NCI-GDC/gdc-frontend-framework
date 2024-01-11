import {
  createListenerMiddleware,
  isAnyOf,
  isFulfilled,
} from "@reduxjs/toolkit";
import type { TypedStartListening } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { CoreDispatch } from "./store";
import { CoreState } from "./reducers";
import {
  updateCohortFilter,
  removeCohortFilter,
  addNewUnsavedCohort,
  selectAvailableCohorts,
  addNewDefaultUnsavedCohort,
  createCaseSetsIfNeeded,
  createCaseSet,
  clearCohortFilters,
  discardCohortChanges,
  selectCurrentCohortId,
  addNewSavedCohort,
} from "./features/cohort/availableCohortsSlice";
import { fetchCohortCaseCounts } from "./features/cohort/cohortCountsQuery";
import { cohortApiSlice } from "./features/api/cohortApiSlice";

/**
 * Defines coreListeners for adding middleware.
 * This listener will dispatch a createCaseSet each time the
 * current cohort filters mutate, and it contains a filter entry in REQUIRES_CASE_SET_FILTERS
 */

export const coreStoreListenerMiddleware = createListenerMiddleware();
export type CoreStartListening = TypedStartListening<CoreState, CoreDispatch>;

export const startCoreListening =
  coreStoreListenerMiddleware.startListening as CoreStartListening;

// TODO add clearCaseSet handler to remove caseSet from the Cohort Persistence GDC API

startCoreListening({
  matcher: isAnyOf(
    updateCohortFilter,
    removeCohortFilter,
    clearCohortFilters,
    discardCohortChanges,
  ),
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
  matcher: isAnyOf(
    addNewUnsavedCohort,
    addNewDefaultUnsavedCohort,
    addNewSavedCohort,
  ),
  effect: async (action, listenerApi) => {
    // get the current cohort id
    console.log("action.meta.arg", action?.meta?.arg);
    const latestCohortId =
      action?.meta?.arg?.cohortId ??
      selectCurrentCohortId(listenerApi.getState());
    listenerApi.dispatch(fetchCohortCaseCounts(latestCohortId));
  },
});

/**
 * If we have a new cohort that requires a case set, we need to create it, even if it's
 * not the current cohort.
 */
startCoreListening({
  matcher: isAnyOf(addNewUnsavedCohort, addNewDefaultUnsavedCohort),
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

startCoreListening({
  matcher: isAnyOf(
    cohortApiSlice.endpoints.getCohortsByContextId.matchFulfilled,
    cohortApiSlice.endpoints.getCohortById.matchFulfilled,
    cohortApiSlice.endpoints.addCohort.matchFulfilled,
    cohortApiSlice.endpoints.updateCohort.matchFulfilled,
    cohortApiSlice.endpoints.deleteCohort.matchFulfilled,
  ),
  effect: async () => {
    // Store context id cookie in local storage to make it more resilient to deletion
    const contextId = Cookies.get("gdc_context_id");
    if (contextId) {
      localStorage.setItem("gdc_context_id", contextId);
    }
  },
});

startCoreListening({
  matcher: isAnyOf(
    cohortApiSlice.endpoints.getCohortsByContextId.matchPending,
    cohortApiSlice.endpoints.getCohortById.matchPending,
    cohortApiSlice.endpoints.addCohort.matchPending,
    cohortApiSlice.endpoints.updateCohort.matchPending,
    cohortApiSlice.endpoints.deleteCohort.matchPending,
  ),
  effect: async () => {
    // If cookie has been deleted, restore it from local storage
    if (!Cookies.get("gdc_context_id")) {
      const contextId = localStorage.getItem("gdc_context_id");
      if (contextId) {
        Cookies.set("gdc_context_id", contextId, { domain: ".gdc.cancer.gov" });
      }
    }
  },
});
