import { useState } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import {
  useCoreDispatch,
  useCoreSelector,
  selectAvailableCohorts,
  useGetCohortsByContextIdQuery,
  buildGqlOperationToFilterSet,
  setActiveCohortList,
  Cohort,
  removeCohort,
  NullCountsData,
} from "@gff/core";

export const useSetupInitialCohorts = (): boolean => {
  const [fetched, setFetched] = useState(false);
  const {
    data: cohortsListData,
    isSuccess,
    isError,
  } = useGetCohortsByContextIdQuery(null, { skip: fetched });

  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const updatedCohortIds = (cohortsListData || []).map((cohort) => cohort.id);
  const outdatedCohortsIds = cohorts
    .filter((c) => c.saved && !updatedCohortIds.includes(c.id))
    .map((c) => c.id);

  useDeepCompareEffect(() => {
    if ((isSuccess || isError) && !fetched) {
      const updatedList: Cohort[] = (cohortsListData || []).map((data) => {
        const existingCohort = cohorts.find((c) => c.id === data.id);
        return existingCohort?.modified
          ? existingCohort
          : {
              id: data.id,
              name: data.name,
              filters: buildGqlOperationToFilterSet(data.filters),
              caseSet: {
                ...(existingCohort?.caseSet ?? { status: "uninitialized" }),
              },
              counts: {
                ...NullCountsData,
              },
              modified_datetime: data.modified_datetime,
              saved: true,
              modified: false,
            };
      });

      coreDispatch(setActiveCohortList(updatedList)); // will create caseSet if needed
      // A saved cohort that's not present in the API response has been deleted in another session
      for (const id of outdatedCohortsIds) {
        coreDispatch(removeCohort({ id }));
      }

      setFetched(true);
    }
  }, [
    cohortsListData,
    isSuccess,
    isError,
    cohorts,
    fetched,
    setFetched,
    coreDispatch,
    outdatedCohortsIds,
  ]);

  return fetched;
};
