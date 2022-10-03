import { CoreState } from "../../reducers";
import { FilterSet, buildCohortGqlOperator } from "./filters";
import { Operation, GqlOperation } from "../gdcapi/filters";

export const selectCurrentCohortFilters = (
  state: CoreState,
): FilterSet | undefined => state.cohort.currentFilters.filters;

/**
 * selectCurrentCohortGqlFilters: returns an object representing the filters in the
 * current cohort.
 * @param state
 */
export const selectCurrentCohortGqlFilters = (
  state: CoreState,
): GqlOperation | undefined => {
  return buildCohortGqlOperator(state.cohort.currentFilters.filters);
};

export const selectCurrentCohortFilterOrCaseSet = (
  state: CoreState,
): FilterSet => {
  if (Object.keys(state.cohort.caseSet.caseSetId.root).length != 0) {
    return state.cohort.caseSet.caseSetId;
  } else return state.cohort.currentFilters.filters;
};

export const selectCurrentCohortFiltersByName = (
  state: CoreState,
  name: string,
): Operation | undefined => state.cohort.currentFilters.filters?.root[name];
