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
  useTopGeneQuery,
  useGetSsmTableDataMutation,
  GqlOperation,
} from "@gff/core";
import { useEffect, useMemo } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
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
import { AppModeState, ComparativeSurvival } from "./types";
import { humanify } from "@/utils/index";
import { useDeepCompareMemo } from "use-deep-compare";

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
 * @param field - to get values of
 */
export const useSelectFilterContent = (field: string): Array<string> => {
  const filter = useCoreSelector((state) =>
    selectCurrentCohortFiltersByName(state, field),
  );
  if (filter === undefined) return [];
  if (isIncludes(filter)) {
    return filter.operands.map((x) => x.toString());
  }
  return [];
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
  comparativeSurvival: ComparativeSurvival,
  isGene: boolean,
): GeneAndSSMPanelData => {
  const isDemoMode = useIsDemoApp();
  const currentCohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const genomicFilters: FilterSet = useAppSelector((state) =>
    selectGeneAndSSMFilters(state),
  );
  const overwritingDemoFilter = useMemo(
    () => overwritingDemoFilterMutationFrequency,
    [],
  );

  const cohortFilters: GqlOperation = useDeepCompareMemo(
    () =>
      buildCohortGqlOperator(
        isDemoMode ? overwritingDemoFilter : currentCohortFilters,
      ),
    [currentCohortFilters, isDemoMode, overwritingDemoFilter],
  );

  const localFilters = useDeepCompareMemo(
    () => buildCohortGqlOperator(genomicFilters),
    [genomicFilters],
  );

  const memoizedFilters = useMemo(
    () =>
      buildGeneHaveAndHaveNotFilters(
        buildCohortGqlOperator(genomicFilters),
        comparativeSurvival?.symbol,
        comparativeSurvival?.field,
        isGene,
      ),
    [
      comparativeSurvival?.field,
      comparativeSurvival?.symbol,
      isGene,
      genomicFilters,
    ],
  );

  const {
    data: survivalPlotData,
    isFetching: survivalPlotFetching,
    isSuccess: survivalPlotReady,
  } = useGetSurvivalPlotQuery({
    case_filters: cohortFilters,
    filters:
      comparativeSurvival !== undefined
        ? memoizedFilters
        : localFilters
        ? [localFilters]
        : [],
  });

  return {
    isDemoMode,
    cohortFilters: currentCohortFilters,
    genomicFilters,
    overwritingDemoFilter,
    survivalPlotData,
    survivalPlotFetching,
    survivalPlotReady,
  };
};

/**
 * Hook to set the comparative survival to the top result of the table when the filters, search on the mutation table
 * or app changes
 * @param appMode - current app
 * @param comparativeSurvival - value for what is plotted against the current cohort on survival plot
 * @param setComparativeSurvival - function to set comparative survival
 * @param searchTermsForGene - search filter for the mutation table
 * @returns whether the request for determining the top gene/ssms has successfully completed
 */
export const useTopGeneSsms = ({
  appMode,
  comparativeSurvival,
  setComparativeSurvival,
  searchTermsForGene,
}: {
  appMode: AppModeState;
  comparativeSurvival: ComparativeSurvival;
  setComparativeSurvival: (comparativeSurvival: ComparativeSurvival) => void;
  searchTermsForGene: { geneId: string; geneSymbol: string };
}): boolean => {
  const isDemoMode = useIsDemoApp();

  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const genomicFilters: FilterSet = useAppSelector((state) =>
    selectGeneAndSSMFilters(state),
  );

  const overwritingDemoFilter = useMemo(
    () => overwritingDemoFilterMutationFrequency,
    [],
  );

  const ssmSearch = searchTermsForGene?.geneSymbol;

  const { data: topGeneSSMS, isSuccess: topGeneSSMSSuccess } = useTopGeneQuery({
    cohortFilters: isDemoMode ? overwritingDemoFilter : cohortFilters,
    genomicFilters: genomicFilters,
  }); // get the default top gene/ssms to show by default

  // Plot top if no current survival plot
  useDeepCompareEffect(() => {
    if (comparativeSurvival === undefined && topGeneSSMSSuccess && !ssmSearch) {
      const { genes, ssms } = topGeneSSMS;
      const { name, symbol } = appMode === "genes" ? genes : ssms;
      const { consequence_type, aa_change } = ssms;
      setComparativeSurvival({
        symbol: symbol,
        name:
          appMode === "genes"
            ? name
            : `${name} ${aa_change ?? ""} ${
                consequence_type
                  ? humanify({
                      term: consequence_type
                        .replace("_variant", "")
                        .replace("_", " "),
                    })
                  : ""
              }`,
        field: appMode === "genes" ? "gene.symbol" : "gene.ssm.ssm_id",
      });
    }
  }, [
    comparativeSurvival,
    topGeneSSMS,
    topGeneSSMSSuccess,
    appMode,
    setComparativeSurvival,
    ssmSearch,
  ]);

  const [getTopSSM, { data: topSSM, isSuccess: topSSMSuccess }] =
    useGetSsmTableDataMutation();

  useEffect(() => {
    const { geneId = "", geneSymbol = "" } = searchTermsForGene;
    if (searchTermsForGene && appMode === "ssms") {
      getTopSSM({
        pageSize: 1,
        offset: 0,
        searchTerm: geneId,
        geneSymbol: geneSymbol,
        genomicFilters: genomicFilters,
        cohortFilters: cohortFilters,
        caseFilter: undefined,
      });
    }
  }, [
    genomicFilters,
    cohortFilters,
    searchTermsForGene,
    getTopSSM,
    appMode,
    setComparativeSurvival,
  ]);

  // Set top when we've searched on SSM
  useDeepCompareEffect(() => {
    if (topSSMSuccess && ssmSearch) {
      const { ssm_id, consequence_type, aa_change = "" } = topSSM;
      const description = consequence_type
        ? `${searchTermsForGene?.geneSymbol ?? ""} ${aa_change} ${humanify({
            term: consequence_type.replace("_variant", "").replace("_", " "),
          })}`
        : "";

      setComparativeSurvival({
        symbol: ssm_id,
        name: description,
        field: "gene.ssm.ssm_id",
      });
    }
  }, [
    topGeneSSMSSuccess,
    topSSM,
    setComparativeSurvival,
    searchTermsForGene,
    ssmSearch,
    topSSMSuccess,
  ]);

  return ssmSearch ? topSSMSuccess : topGeneSSMSSuccess;
};
