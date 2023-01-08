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

// TODO add clearCaseSet handler to remove caseSet from BE
startCoreListening({
  matcher: isAnyOf(updateCohortFilter, removeCohortFilter, setCurrentCohortId),
  effect: async (_, listenerApi) => {
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
    listenerApi.dispatch(addCaseCount({ caseCount: cohortsCount }));
  },
});

startCoreListening({
  matcher: isAnyOf(addNewCohortWithFilterAndMessage),
  effect: async (_, listenerApi) => {
    const latestCohort = selectAvailableCohorts(listenerApi.getState());
    const latestCohortFilter = latestCohort[1]?.filters;
    const latestCohortId = latestCohort[1]?.id;
    try {
      const res = await fetchGdcCases({
        filters: buildCohortGqlOperator(latestCohortFilter),
        size: 0,
      });
      const caseCount = res?.data?.pagination?.total;

      listenerApi.dispatch(
        addCaseCount({ cohortId: latestCohortId, caseCount: caseCount }),
      );
    } catch (error) {
      // TODO: how to deal with this?
      console.log({ error });
    }
  },
});
