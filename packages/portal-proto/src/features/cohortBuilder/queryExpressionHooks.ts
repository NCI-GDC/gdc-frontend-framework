import { useCallback, useMemo } from "react";
import { useDeepCompareCallback } from "use-deep-compare";
import {
  useCoreDispatch,
  useCoreSelector,
  removeCohortFilter,
  updateActiveCohortFilter,
  selectCurrentCohort,
  fieldNameToTitle,
  clearCohortFilters,
  useLazyGeneSymbolQuery,
  selectAllSets,
  useLazyGeneSetCountQuery,
  useLazySsmSetCountQuery,
  useLazyCaseSetCountQuery,
} from "@gff/core";
import { Operation } from "@gff/core";

export const useSelectCurrentCohort = () => {
  return useCoreSelector((state) => selectCurrentCohort(state));
};

const useClearCohortFilters = () => {
  const coreDispatch = useCoreDispatch();

  const clearFilters = useCallback(() => {
    coreDispatch(clearCohortFilters());
  }, [coreDispatch]);

  return clearFilters;
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
    (field: string, operation: Operation) => {
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

export const useFieldNameToTitle = () => {
  const fieldToTitle = useCallback((field: string, sections?: number) => {
    return field === "genes.gene_id"
      ? "Mutated Gene"
      : fieldNameToTitle(field, sections);
  }, []);

  return fieldToTitle;
};

export const useFormatValue = () => {
  const [getGeneSymbol] = useLazyGeneSymbolQuery();
  const sets = useCoreSelector((state) => selectAllSets(state));
  const [getGeneSetCount] = useLazyGeneSetCountQuery();
  const [getSsmSetCount] = useLazySsmSetCountQuery();
  const [getCaseSetCount] = useLazyCaseSetCountQuery();

  const docTypeToQuery = useMemo(
    () => ({
      genes: getGeneSetCount,
      ssms: getSsmSetCount,
      cases: getCaseSetCount,
    }),
    [getCaseSetCount, getGeneSetCount, getSsmSetCount],
  );

  const formatValue = useDeepCompareCallback(
    (value: string, field: string) => {
      const setId = value.includes("set_id:") ? value.split(":")[1] : null;
      const [docType] = field.split(".");

      if (setId) {
        const setName: string = sets?.[docType]?.[setId];
        if (setName) {
          return Promise.resolve(setName);
        } else {
          return new Promise<string>((resolve) =>
            docTypeToQuery[docType]({ setId })
              .unwrap()
              .then((data: number) => {
                resolve(
                  `${data.toLocaleString()} input ${
                    field === "genes.gene_id" ? "gene" : fieldNameToTitle(field)
                  }s`.toLowerCase(),
                );
              }),
          );
        }
      } else {
        if (field === "genes.gene_id") {
          return new Promise<string>((resolve) =>
            getGeneSymbol(value)
              .unwrap()
              .then((data: string) => resolve(data)),
          );
        } else {
          return Promise.resolve(value.toString());
        }
      }
    },
    [getGeneSymbol, docTypeToQuery, sets],
  );

  return formatValue;
};

const queryExpressionHooks = {
  useSelectCurrentCohort,
  useClearCohortFilters,
  useRemoveCohortFilter,
  useUpdateCohortFilter,
  useFieldNameToTitle,
  useFormatValue,
};

export default queryExpressionHooks;
