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
  setCurrentCohortId,
  addCaseCount,
  addNewCohortWithFilterAndMessage,
  selectAvailableCohorts,
  addNewCohort,
  createCaseSetsIfNeeded,
  createCaseSet,
} from "./features/cohort/availableCohortsSlice";
import {
  fetchCohortCaseCounts,
  selectCohortCountsByName,
} from "./features/cohort/countSlice";
import { resetSelectedCases } from "./features/cases/selectedCasesSlice";
import { fetchGdcCases } from "./features/gdcapi/gdcapi";
import { buildCohortGqlOperator } from "./features/cohort";

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

/**
 * If the cohort is changed, we need to reset the selected cases.
 */
startCoreListening({
  matcher: isAnyOf(updateCohortFilter, removeCohortFilter, setCurrentCohortId),
  effect: async (_, listenerApi) => {
    listenerApi.dispatch(resetSelectedCases());
  },
});

/**
 * Once the request for the case count is fulfilled, we need to add it to the cohort
 * Optionally if a cohortID is passed in, we can add the case count to that cohort
 * This is used when creating a new cohort from a link, as it is not the current cohort
 */
startCoreListening({
  matcher: isFulfilled(fetchCohortCaseCounts),
  effect: async (action, listenerApi) => {
    const cohortsCount = selectCohortCountsByName(
      listenerApi.getState(),
      "caseCount",
    );
    listenerApi.dispatch(
      addCaseCount({ cohortId: action.meta?.arg, caseCount: cohortsCount }),
    );
  },
});

startCoreListening({
  matcher: isAnyOf(addNewCohortWithFilterAndMessage, addNewCohort),
  effect: async (_, listenerApi) => {
    // the last cohort added is the one we want to get the case count for
    const cohorts = selectAvailableCohorts(listenerApi.getState()).sort(
      (a, b) => (a.modified_datetime <= b.modified_datetime ? 1 : -1),
    );

    const latestCohortFilter = cohorts[0]?.filters;
    const latestCohortId = cohorts[0]?.id;

    const res = await fetchGdcCases({
      filters: buildCohortGqlOperator(latestCohortFilter),
      size: 0,
    });
    const caseCount = res?.data?.pagination?.total;

    listenerApi.dispatch(
      addCaseCount({ cohortId: latestCohortId, caseCount: caseCount }),
    );
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
