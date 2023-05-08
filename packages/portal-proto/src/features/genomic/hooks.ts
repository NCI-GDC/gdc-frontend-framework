import {
  ClearFacetFunction,
  EnumFacetResponse,
  UpdateFacetFilterFunction,
} from "@/features/facets/types";
import {
  EnumOperandValue,
  FacetBuckets,
  fetchFacetByNameGQL,
  FilterSet,
  GQLDocType,
  GQLIndexType,
  isIncludes,
  joinFilters,
  OperandValue,
  Operation,
  selectCurrentCohortFilterOrCaseSet,
  selectCurrentCohortFiltersByName,
  selectFacetByDocTypeAndField,
  useCurrentCohortFilters,
  useCoreDispatch,
  useCoreSelector,
  usePrevious,
  FilterGroup,
  selectMultipleFacetsByDocTypeAndField,
} from "@gff/core";
import { useEffect, useMemo } from "react";
import isEqual from "lodash/isEqual";
import { extractValue } from "@/features/facets/hooks";
import { useAppDispatch, useAppSelector } from "@/features/genomic/appApi";
import {
  updateGeneAndSSMFilter,
  selectGeneAndSSMFiltersByName,
  selectGeneAndSSMFilters,
  removeGeneAndSSMFilter,
  selectGeneAndSSMFiltersByNames,
} from "@/features/genomic/geneAndSSMFiltersSlice";
import {
  removeFilterGroup,
  addNewFilterGroups,
  clearFilterGroups,
  selectFilterGroups,
} from "./geneFilterGroupSlice";

/**
 * Update Genomic Enum Facets filters. These are app local updates and are not added
 * to the current (global) cohort.
 */
export const useUpdateGenomicEnumFacetFilter =
  (): UpdateFacetFilterFunction => {
    const dispatch = useAppDispatch();
    // update the filter for this facet
    return (field: string, operation: Operation) => {
      dispatch(updateGeneAndSSMFilter({ field: field, operation: operation }));
    };
  };

/**
 * clears the genomic (local filters)
 */
export const useClearGenomicFilters = (): ClearFacetFunction => {
  const dispatch = useAppDispatch();
  return (field: string) => {
    dispatch(removeGeneAndSSMFilter(field));
  };
};

export const useGenomicFilterByName = (field: string): OperandValue => {
  const enumFilters: Operation = useAppSelector((state) =>
    selectGeneAndSSMFiltersByName(state, field),
  );
  return enumFilters ? extractValue(enumFilters) : undefined;
};

const useGenomicFiltersByNames = (
  fields: ReadonlyArray<string>,
): Record<string, OperandValue> => {
  const enumFilters: Record<string, Operation> = useAppSelector((state) =>
    selectGeneAndSSMFiltersByNames(state, fields),
  );
  return Object.entries(enumFilters).reduce((obj, [key, value]) => {
    if (value) obj[key] = extractValue(value);
    return obj;
  }, {});
};

const useCohortOrCaseSetFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilterOrCaseSet(state));
};

export const useGenomicFacetFilter = (): FilterSet => {
  return useAppSelector((state) => selectGeneAndSSMFilters(state));
};

/**
 * Genes Facet Selector using GQL. it combines the Cohort with Gene Filters
 * to get data for the current cohort and genes filters
 */
export const useGenesFacet = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  field: string,
): EnumFacetResponse => {
  const coreDispatch = useCoreDispatch();
  // facet data is store in core
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFacetByDocTypeAndField(state, docType, field),
  );

  const enumValues = useGenomicFilterByName(field);
  // used to detect changes to cohort filters
  const currentCohortFilters = useCurrentCohortFilters();
  // current cohort filter, if it contains a caseSet it is possible it will not change
  const cohortFilters = useCohortOrCaseSetFacetFilter();

  const genomicFilters = useGenomicFacetFilter();
  const prevCohortFilters = usePrevious(currentCohortFilters);
  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevEnumValues = usePrevious(enumValues);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const selectLocalGenomicFiltersPlusCohortFilters = (_ignore) =>
      joinFilters(cohortFilters, genomicFilters);
    if (
      !facet ||
      !isEqual(prevCohortFilters, currentCohortFilters) ||
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevEnumValues, enumValues)
    ) {
      coreDispatch(
        fetchFacetByNameGQL({
          field: field,
          docType: docType,
          index: indexType,
          filterSelector: selectLocalGenomicFiltersPlusCohortFilters,
        }),
      );
    }
  }, [
    coreDispatch,
    facet,
    field,
    currentCohortFilters,
    docType,
    indexType,
    prevCohortFilters,
    prevEnumValues,
    enumValues,
    prevGenomicFilters,
    genomicFilters,
    cohortFilters,
  ]);

  return {
    data: facet?.buckets,
    enumFilters: (enumValues as EnumOperandValue)?.map((x) => x.toString()),
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

export const useGenesFacetValues = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  field: string,
): EnumFacetResponse => {
  // facet data is store in core
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFacetByDocTypeAndField(state, docType, field),
  );
  const enumValues = useGenomicFilterByName(field);
  return {
    data: facet?.buckets,
    enumFilters: (enumValues as EnumOperandValue)?.map((x) => x.toString()),
    error: facet?.error,
    isUninitialized: facet === undefined,
    isFetching: facet?.status === "pending",
    isSuccess: facet?.status === "fulfilled",
    isError: facet?.status === "rejected",
  };
};

export const useGenesFacets = (
  docType: GQLDocType,
  indexType: GQLIndexType,
  fields: ReadonlyArray<string>,
  isDemoMode: boolean,
): void => {
  const facet: ReadonlyArray<FacetBuckets> = useCoreSelector((state) =>
    selectMultipleFacetsByDocTypeAndField(state, docType, fields),
  );

  const coreDispatch = useCoreDispatch();
  const enumValues = useGenomicFiltersByNames(fields);

  const demoFilter: FilterSet = useMemo(
    () => ({
      mode: "and",
      root: {
        "cases.project.project_id": {
          operator: "includes",
          field: "cases.project.project_id",
          operands: ["TCGA-LGG"],
        },
      },
    }),
    [],
  );

  const cohortFilters = useCohortOrCaseSetFacetFilter();

  const genomicFilters = useGenomicFacetFilter();
  const prevCohortFilters = usePrevious(cohortFilters);
  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevEnumValues = usePrevious(enumValues);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const selectLocalGenomicFiltersPlusCohortFilters = (_ignore) =>
      joinFilters(isDemoMode ? demoFilter : cohortFilters, genomicFilters);
    if (
      !facet ||
      !isEqual(prevCohortFilters, cohortFilters) ||
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevEnumValues, enumValues)
    ) {
      coreDispatch(
        fetchFacetByNameGQL({
          field: fields,
          docType: docType,
          index: indexType,
          filterSelector: selectLocalGenomicFiltersPlusCohortFilters,
        }),
      );
    }
  }, [
    coreDispatch,
    facet,
    fields,
    cohortFilters,
    docType,
    indexType,
    prevCohortFilters,
    prevEnumValues,
    enumValues,
    prevGenomicFilters,
    genomicFilters,
    demoFilter,
    isDemoMode,
  ]);
};

/**
 * returns the values of a field. Assumes required field
 * is of type Includes. Returns an empty array if filter is undefined or not
 * of type Includes.
 * @param field to get values of
 */
export const useSelectFilterContent = (
  field: string,
): ReadonlyArray<string> => {
  const filter = useCoreSelector((state) =>
    selectCurrentCohortFiltersByName(state, field),
  );
  if (filter === undefined) return [];
  if (isIncludes(filter)) {
    return filter.operands.map((x) => x.toString());
  }
  return [];
};

export const useUpdateGeneAndSSMFilters = (): UpdateFacetFilterFunction => {
  const dispatch = useAppDispatch();
  // update the filter for this facet

  return (field: string, operation: Operation) => {
    dispatch(updateGeneAndSSMFilter({ field: field, operation: operation }));
  };
};

export const useAddNewGenomicFilterGroups = (): ((
  groups: FilterGroup[],
) => void) => {
  const dispatch = useAppDispatch();
  return (groups: FilterGroup[]) => dispatch(addNewFilterGroups(groups));
};

export const useFilterGroups = (field: string): FilterGroup[] =>
  useAppSelector((state) => selectFilterGroups(state, field));

export const useClearFilterGroups = (): ((field: string) => void) => {
  const dispatch = useAppDispatch();
  return (field: string) => dispatch(clearFilterGroups(field));
};

export const useRemoveFilterGroup = (): ((group: FilterGroup) => void) => {
  const dispatch = useAppDispatch();
  return (group: FilterGroup) => dispatch(removeFilterGroup(group));
};
