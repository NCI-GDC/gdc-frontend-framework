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
  addNewSavedCohort,
  selectCurrentCohortId,
  removeCohort,
  selectCurrentCohort,
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
    const currentCohortId = selectCurrentCohortId(listenerApi.getState());
    // need to pass the current cohort id to the case count fetcher because it is possible that
    // the current cohort will be different when the fetch is fulfilled
    currentCohortId &&
      listenerApi.dispatch(fetchCohortCaseCounts(currentCohortId));
  },
});

/**
 * When a new cohort is added, we need to fetch the case counts for it
 * both actions are handled here because a new uninitialized cohort is added and
 * will be the most recent cohort
 */
startCoreListening({
  matcher: isAnyOf(addNewUnsavedCohort, addNewDefaultUnsavedCohort),
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
 *  Remove cohort can potentially remove the last cohort, which will create a new default cohort
 *  so in this case we need to fetch the case counts for the new default cohort
 */
startCoreListening({
  matcher: isAnyOf(removeCohort),
  effect: async (_, listenerApi) => {
    const currentCohort = selectCurrentCohort(listenerApi.getState());
    if (currentCohort?.counts.status === "uninitialized") {
      listenerApi.dispatch(fetchCohortCaseCounts(currentCohort.id));
    }
  },
});

/**
 * Handle cohort creation/deletion for updating the counts. In this
 * case the id of the cohort is in the action payload
 */
startCoreListening({
  matcher: isAnyOf(
    addNewUnsavedCohort,
    addNewSavedCohort,
    discardCohortChanges,
  ),
  effect: async (action, listenerApi) => {
    // the last cohort added is the one we want to get the case count for

    const cohortId = action?.payload?.id;
    if (cohortId === undefined) {
      console.error("Listener: cohortId is undefined");
    }
    listenerApi.dispatch(fetchCohortCaseCounts(cohortId));
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
