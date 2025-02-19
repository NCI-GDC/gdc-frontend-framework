import { useCallback } from "react";
import {
  useCoreDispatch,
  useCoreSelector,
  removeCohortFilter,
  updateActiveCohortFilter,
  selectCurrentCohort,
  fieldNameToTitle,
} from "@gff/core";

export const useSelectCurrentCohort = () => {
  return useCoreSelector((state) => selectCurrentCohort(state));
};

const useClearCohortFilters = () => {
  const coreDispatch = useCoreDispatch();

  const clearCohortFilters = useCallback(
    () => coreDispatch(clearCohortFilters()),
    [coreDispatch],
  );

  return clearCohortFilters;
};

const useRemoveCohortFilter = () => {
  const coreDispatch = useCoreDispatch();

  const removeFilter = useCallback(
    (field: string) => {
      coreDispatch(removeCohortFilter(field));
    },
    [coreDispatch],
  );

  return removeFilter;
};

const useUpdateCohortFilter = () => {
  const coreDispatch = useCoreDispatch();

  const updateCohortFilter = useCallback(
    ({ field, operation }) => {
      coreDispatch(
        updateActiveCohortFilter({
          field,
          operation,
        }),
      );
    },
    [coreDispatch],
  );

  return updateCohortFilter;
};

const useFieldNameToTitle = () => {
  return (field: string) => fieldNameToTitle(field);
};

const queryExpressionHooks = {
  useSelectCurrentCohort,
  useClearCohortFilters,
  useRemoveCohortFilter,
  useUpdateCohortFilter,
  useFieldNameToTitle,
};

export default queryExpressionHooks;
