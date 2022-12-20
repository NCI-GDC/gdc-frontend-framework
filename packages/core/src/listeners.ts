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
} from "./features/cohort/availableCohortsSlice";

import {
  fetchCohortCaseCounts,
  selectCohortCountsByName,
} from "./features/cohort/countSlice";
import { resetSelectedCases } from "./features/cases/selectedCasesSlice";

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
  matcher: isAnyOf(updateCohortFilter, removeCohortFilter, setCurrentCohortId),
  effect: async (_, listenerApi) => {
    // dispatch updateCohortFilter or removeCohortFilter executed

    // listen to case counts -> ask for current cohort id -> update the cases_count
    listenerApi.dispatch(resetSelectedCases());
  },
});

startCoreListening({
  matcher: isFulfilled(fetchCohortCaseCounts),
  effect: async (_, listenerApi) => {
    const cohortsCount = selectCohortCountsByName(
      listenerApi.getState(),
      "caseCount",
    );
    // listen to case counts -> ask for current cohort id -> update the cases_count
    listenerApi.dispatch(addCaseCount(cohortsCount));
  },
});
