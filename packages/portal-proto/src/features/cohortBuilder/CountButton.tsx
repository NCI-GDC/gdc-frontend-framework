import { useEffect, useState } from "react";
import { Button, Loader} from "@mantine/core";
import {
  useCoreDispatch,
  useCoreSelector,
  selectCurrentCohortFilters,
  selectCohortCounts,
  fetchCohortCounts, FacetBuckets, selectCohortCountsData
} from "@gff/core";

interface UseCurrentCohortCountsResponse {
  readonly data?: Record<string, number>;
  readonly error?: string;
  readonly isUninitialized: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

const useCurrentCohortCounts = () : UseCurrentCohortCountsResponse => {
  const coreDispatch = useCoreDispatch();
  const counts = useCoreSelector((state) =>
    selectCohortCountsData(state),
  );

  const selectFacetFilter = useCoreSelector((state) => selectCurrentCohortFilters(state));
  useEffect(() => {
    if (!counts) {
      coreDispatch(fetchCohortCounts());
    }
  }, [coreDispatch, counts]);


  useEffect(() => {
    coreDispatch(fetchCohortCounts());
  }, [selectFacetFilter ]);

  return {
    data: counts?.data,
    error: counts?.error,
    isUninitialized: counts === undefined,
    isFetching: counts?.status === "pending",
    isSuccess: counts?.status === "fulfilled",
    isError: counts?.status === "rejected",
  };
}

export interface CountButtonProp {
  readonly countName: string;
  readonly label: string;
  readonly className?: string;
}

const CountButton : React.FC<CountButtonProp> = ({countName, label, className = ""} : CountButtonProp) => {
  const cohortCounts = useCurrentCohortCounts();

  return (
    <div className={className}>{(cohortCounts.isSuccess) ?`${cohortCounts.data[countName].toLocaleString()} ${label}` :  <Loader></Loader>}</div>
  )
}

export default CountButton;
