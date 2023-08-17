import {
  createListenerMiddleware,
  isAnyOf,
  isFulfilled,
} from "@reduxjs/toolkit";
import type { TypedStartListening } from "@reduxjs/toolkit";
import { CoreDispatch } from "./store";
import { CoreState } from "./reducers";
import {
  addCaseCount,
  addNewCohortWithFilterAndMessage,
  selectAvailableCohorts,
  addNewCohort,
  createCaseSetsIfNeeded,
} from "./features/cohort/availableCohortsSlice";
import {
  fetchCohortCaseCounts,
  selectCohortCountsByName,
} from "./features/cohort/countSlice";

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

// TODO add clearCaseSet handler to remove caseSet from BE

startCoreListening({
  matcher: isFulfilled(fetchCohortCaseCounts),
  effect: async (_, listenerApi) => {
    const cohortsCount = selectCohortCountsByName(
      listenerApi.getState(),
      "caseCount",
    );
    listenerApi.dispatch(addCaseCount({ caseCount: cohortsCount }));
  },
});

startCoreListening({
  matcher: isAnyOf(addNewCohortWithFilterAndMessage, addNewCohort),
  effect: async (_, listenerApi) => {
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
