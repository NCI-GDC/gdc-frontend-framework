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
  selectCurrentCohortFiltersByName,
  selectFacetByDocTypeAndField,
  useCoreDispatch,
  useCoreSelector,
  usePrevious,
  type Survival,
  selectMultipleFacetsByDocTypeAndField,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  useGetSurvivalPlotQuery,
  selectCurrentCohortGeneAndSSMCaseSet,
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
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { overwritingDemoFilterMutationFrequency } from "@/features/genomic/GenesAndMutationFrequencyAnalysisTool";
import { buildGeneHaveAndHaveNotFilters } from "@/features/genomic/utils";

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

const useCohortFacetFilter = (): FilterSet => {
  return useCoreSelector((state) => selectCurrentCohortFilters(state));
};

export const useGenomicFacetFilter = (): FilterSet => {
  return useAppSelector((state) => selectGeneAndSSMFilters(state));
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

  const cohortFilters = useCohortFacetFilter();
  const genomicFilters = useGenomicFacetFilter();
  const prevCohortFilters = usePrevious(cohortFilters);
  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevEnumValues = usePrevious(enumValues);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const selectCohortFilters = (_ignore) =>
      isDemoMode ? demoFilter : cohortFilters;
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
          caseFilterSelector: selectCohortFilters,
          localFilters: genomicFilters,
          splitIntoCasePlusLocalFilters: true,
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

export interface GeneAndSSMPanelData {
  isDemoMode: boolean;
  genomicFilters: FilterSet;
  cohortFilters: FilterSet;
  overwritingDemoFilter: FilterSet;
  survivalPlotData: Survival;
  survivalPlotFetching: boolean;
  survivalPlotReady: boolean;
}

/*
 * This hook returns the filters, and survival plot data, and it's loading status for the gene and ssm panel.
 */
export const useGeneAndSSMPanelData = (
  comparativeSurvival: Record<string, string>,
  isGene: boolean,
): GeneAndSSMPanelData => {
  const isDemoMode = useIsDemoApp();
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortGeneAndSSMCaseSet(state),
  );
  const genomicFilters: FilterSet = useAppSelector((state) =>
    selectGeneAndSSMFilters(state),
  );
  const overwritingDemoFilter = useMemo(
    () => overwritingDemoFilterMutationFrequency,
    [],
  );

  const filters = useMemo(
    () =>
      buildCohortGqlOperator(
        joinFilters(
          isDemoMode ? overwritingDemoFilter : cohortFilters,
          genomicFilters,
        ),
      ),

    [isDemoMode, cohortFilters, overwritingDemoFilter, genomicFilters],
  );

  const memoizedFilters = useMemo(
    () =>
      buildGeneHaveAndHaveNotFilters(
        filters,
        comparativeSurvival?.symbol,
        comparativeSurvival?.field,
        isGene,
      ),
    [comparativeSurvival?.field, comparativeSurvival?.symbol, filters, isGene],
  );

  const {
    data: survivalPlotData,
    isFetching: survivalPlotFetching,
    isSuccess: survivalPlotReady,
  } = useGetSurvivalPlotQuery({
    filters:
      comparativeSurvival !== undefined
        ? memoizedFilters
        : filters
        ? [filters]
        : [],
  });

  return {
    isDemoMode,
    cohortFilters,
    genomicFilters,
    overwritingDemoFilter,
    survivalPlotData,
    survivalPlotFetching,
    survivalPlotReady,
  };
};
