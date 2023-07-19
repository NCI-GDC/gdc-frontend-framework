import { useEffect } from "react";
import {
  useCoreDispatch,
  useCoreSelector,
  selectAvailableCohorts,
  useGetCohortsByContextIdQuery,
  buildGqlOperationToFilterSet,
  setActiveCohortList,
  Cohort,
  removeCohort,
  addNewCohort,
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
  const outdatedCohortsIds = cohorts
    .filter((c) => c.saved && !updatedCohortIds.includes(c.id))
    .map((c) => c.id);

  useEffect(() => {
    // If cohortsListData is undefined that means either user doesn't have any cohorts saved as of now
    // or call to fetch the cohort list errored out. We need to create a default cohort for them.
    if (isSuccess || isError) {
      if (cohortsListData === undefined || cohortsListData.length === 0) {
        if (cohorts.length === 0) {
          coreDispatch(addNewCohort("New Unsaved Cohort"));
        }
      } else {
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
                modified_datetime: data.modified_datetime,
                saved: true,
                modified: false,
                caseCount: data?.case_ids.length,
              };
        });
        // TODO determine if setActiveCohortList is really needed

        coreDispatch(setActiveCohortList(updatedList)); // will create caseSet if needed
      }
      // A saved cohort that's not present in the API response has been deleted in another session
      for (const id of outdatedCohortsIds) {
        coreDispatch(removeCohort({ currentID: id }));
      }
    }

    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    coreDispatch,
    JSON.stringify(cohortsListData),
    isSuccess,
    isError,
    JSON.stringify(outdatedCohortsIds),
    JSON.stringify(cohorts.map((cohort) => cohort.id)),
  ]);
  /* eslint-enable */
};
