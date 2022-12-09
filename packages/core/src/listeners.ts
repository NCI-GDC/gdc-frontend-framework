import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import type { TypedStartListening } from "@reduxjs/toolkit";
import { CoreDispatch } from "./store";
import { CoreState } from "./reducers";
import {
  updateCohortFilter,
  removeCohortFilter,
  setCurrentCohortId,
  //cohortSelectors,
} from "./features/cohort/availableCohortsSlice";
//import { createCaseSet } from "./features/cohort/availableCohortsSlice";
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
    listenerApi.dispatch(resetSelectedCases());
    // const cohort = cohortSelectors.selectById(
    //   listenerApi.getState(),
    //   listenerApi.getState().cohort.availableCohorts.currentCohort,
    // );
    // if (cohort === undefined) return; // there is no cohort so return
    // if (cohort.caseSet.pendingFilters != undefined)
    //   // there are filters which require a caseSet so create a caseSet
    //   await listenerApi.dispatch(
    //     createCaseSet({
    //       caseSetId:
    //         listenerApi.getState().cohort.availableCohorts.currentCohort,
    //     }),
    //   );
  },
});
