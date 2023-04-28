import { useEffect, useMemo } from "react";
import {
  useCoreDispatch,
  useCoreSelector,
  selectAvailableCohorts,
  useGetCohortsByContextIdQuery,
  buildGqlOperationToFilterSet,
  setActiveCohortList,
  DataStatus,
  Cohort,
  addNewCohort,
  removeCohort,
} from "@gff/core";

export const useSetupInitialCohorts = (): void => {
  const {
    data: cohortsListData,
    isSuccess,
    isError,
  } = useGetCohortsByContextIdQuery();
  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  const updatedCohortIds = (cohortsListData || []).map((cohort) => cohort.id);
  const outdatedCohorts = useMemo(
    () => cohorts.filter((c) => c.saved && !updatedCohortIds.includes(c.id)),
    [cohorts, updatedCohortIds],
  );

  useEffect(() => {
    // If cohortsListData is undefined that means either user doesn't have any cohorts saved as of now
    // or call to fetch the cohort list errored out. We need to create a default cohort for them.
    if ((isSuccess || isError) && cohorts.length === 0) {
      if (cohortsListData === undefined || cohortsListData.length === 0) {
        coreDispatch(addNewCohort("New Unsaved Cohort"));
      } else {
        const updatedList: Cohort[] = cohortsListData.map((data) => ({
          id: data.id,
          name: data.name,
          filters: buildGqlOperationToFilterSet(data.filters),
          caseSet: {
            caseSetId: buildGqlOperationToFilterSet(data.filters),
            status: "fulfilled" as DataStatus,
          },
          modified_datetime: data.modified_datetime,
          saved: true,
          modified: false,
          caseCount: data?.case_ids.length,
        }));
        // TODO determine if setActiveCohortList is really needed

        coreDispatch(setActiveCohortList(updatedList)); // will create caseSet if needed
      }

      // A saved cohort that's not present in the API response has been deleted in another session
      for (const cohort of outdatedCohorts) {
        coreDispatch(removeCohort({ currentID: cohort.id }));
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    coreDispatch,
    cohortsListData,
    isSuccess,
    isError,
    cohorts.length,
    JSON.stringify(outdatedCohorts),
  ]);
  /* eslint-enable */
};
