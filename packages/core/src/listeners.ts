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
  // addCaseIds,
  addNewCohortWithFilterAndMessage,
  selectAvailableCohorts,
  // selectCurrentCohort,
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
    // dispatch updateCohortFilter or removeCohortFilter executed
    listenerApi.dispatch(resetSelectedCases());
  },
});

// startCoreListening({
//   matcher: isAnyOf(updateCohortFilter, removeCohortFilter),
//   effect: async (_, listenerApi) => {
//     // dispatch updateCohortFilter or removeCohortFilter executed
//     const latestCohort = selectCurrentCohort(listenerApi.getState());
//     try {
//       const res = await fetchGdcCases({
//         filters: buildCohortGqlOperator(latestCohort?.filters),
//         size: 100000,
//         fields: ["case_id"],
//       });

//       listenerApi.dispatch(
//         addCaseIds({
//           cohortId: latestCohort?.id,
//           caseIds: res.data.hits.map((hit) => hit.case_id),
//         }),
//       );
//     } catch (error) {}
//   },
// });

startCoreListening({
  matcher: isFulfilled(fetchCohortCaseCounts),
  effect: async (_, listenerApi) => {
    const cohortsCount = selectCohortCountsByName(
      listenerApi.getState(),
      "caseCount",
    );

    listenerApi.dispatch(addCaseCount({ caseCount: cohortsCount }));
    // const latestCohort = selectAvailableCohorts(listenerApi.getState());
    // try {
    //   const res = await fetchGdcCases({
    //     filters: buildCohortGqlOperator(latestCohort[0].filters),
    //     size: 100000,
    //     fields: ["case_id"],
    //   });

    //   listenerApi.dispatch(
    //     addCaseIds({
    //       cohortId: latestCohort[0].id,
    //       caseIds: res.data.hits.map((hit) => hit.case_id),
    //     }),
    //   );
    // } catch (error) {}
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
        // maybe give size of zero so that we can only get the count
      });
      const caseCount = res?.data?.pagination?.total;

      listenerApi.dispatch(
        addCaseCount({ cohortId: latestCohortId, caseCount: caseCount }),
      );
    } catch (error) {}
  },
});
