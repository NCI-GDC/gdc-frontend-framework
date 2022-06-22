import { useEffect } from "react";
import {
  fetchCases,
  GqlOperation,
  selectCasesData,
  selectCurrentCohortCaseGqlFilters,
  useCoreDispatch,
  useCoreSelector,
} from "@gff/core";

const useCohortFacetFilter = (): GqlOperation => {
  return useCoreSelector((state) => selectCurrentCohortCaseGqlFilters(state));
};

/**
 * TODO: This needs to move to core
 * @param pageSize
 * @param offset
 */
export const useCohortCases = (pageSize = 10, offset = 0) => {
  const coreDispatch = useCoreDispatch();
  const cohortFilters = useCohortFacetFilter();
  const cases = useCoreSelector((state) => selectCasesData(state));

  // cohortFilters is generated each time, use string representation
  // to control when useEffects are called
  const filters = JSON.stringify(cohortFilters);

  useEffect(() => {
    coreDispatch(
      fetchCases({
        fields: [
          "case_id",
          "submitter_id",
          "primary_site",
          "project.project_id",
          "demographic.gender",
          "diagnoses.primary_diagnosis",
          "diagnoses.tissue_or_organ_of_origin",
        ],
        filters: cohortFilters, // TODO: move filter setting to core
        size: pageSize,
        from: offset * pageSize,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pageSize, offset]);

  return {
    data: cases.data,
    error: cases?.error,
    isUninitialized: cases === undefined,
    isFetching: cases?.status === "pending",
    isSuccess: cases?.status === "fulfilled",
    isError: cases?.status === "rejected",
  };
};
