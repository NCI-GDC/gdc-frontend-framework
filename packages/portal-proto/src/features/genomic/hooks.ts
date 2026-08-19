import { useEffect, useMemo, useCallback } from "react";
import {
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
  GqlOperation,
  showModal,
  Modals,
  GeneSSMSEntry,
  TopSsm,
  fieldNameToTitle,
} from "@gff/core";
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
  clearGeneAndSSMFilters,
} from "@/features/genomic/geneAndSSMFiltersSlice";
import {
  toggleFilter,
  toggleAllFilters,
  selectFilterExpanded,
  selectAllFiltersCollapsed,
} from "./geneAndSSMFilterExpandedSlice";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { buildGeneHaveAndHaveNotFilters } from "@/features/genomic/utils";
import { AppModeState, ComparativeSurvival } from "./types";
import { overwritingDemoFilterMutationFrequency } from "./utils";
import { useDeepCompareMemo } from "use-deep-compare";
import FilterFacets from "@/features/genomic/filters.json";

/**
 * Update Genomic Enum Facets filters. These are app local updates and are not added
 * to the current (global) cohort.
 */
export const useUpdateGenomicEnumFacetFilter = () => {
  const dispatch = useAppDispatch();
  // update the filter for this facet
  return (field: string, operation: Operation) => {
    dispatch(updateGeneAndSSMFilter({ field: field, operation: operation }));
  };
};

/**
 * clears the genomic (local filters)
 */
export const useClearGenomicFilters = () => {
  const dispatch = useAppDispatch();
  return (field: string) => {
    dispatch(removeGeneAndSSMFilter(field));
  };
};

export const useClearAllGenomicFilters = () => {
  const dispatch = useAppDispatch();
  return useCallback(() => {
    dispatch(clearGeneAndSSMFilters());
  }, [dispatch]);
};

export const useGenomicFilterByName = (field: string) => {
  return useAppSelector((state) => selectGeneAndSSMFiltersByName(state, field));
};

export const useGenomicFilterValueByName = (field: string): OperandValue => {
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

export const useToggleExpandFilter = () => {
  const dispatch = useAppDispatch();
  return (field: string, expanded: boolean) => {
    dispatch(toggleFilter({ field, expanded }));
  };
};

export const useToggleAllFilters = () => {
  const dispatch = useAppDispatch();
  return (expanded: boolean) => {
    dispatch(toggleAllFilters(expanded));
  };
};

export const useFilterExpandedState = (field: string) => {
  return useAppSelector((state) => selectFilterExpanded(state, field));
};

export const useAllFiltersCollapsed = () => {
  return useAppSelector((state) => selectAllFiltersCollapsed(state));
};

export const useGenesFacetValues = (field: string) => {
  // facet data is store in core
  const docType = FilterFacets.find((f) => f.field === field).queryOptions
    .docType as GQLDocType;
  const facet: FacetBuckets = useCoreSelector((state) =>
    selectFacetByDocTypeAndField(state, docType, field),
  );

  return {
    data: facet?.buckets,
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
  survivalPlotData: Survival;
  survivalPlotFetching: boolean;
  survivalPlotReady: boolean;
}

/*
 * This hook returns the filters, and survival plot data, and it's loading status for the gene and ssm panel.
 */
export const useGenomicSurvivalPlot = (
  comparativeSurvival: ComparativeSurvival,
  isGene: boolean,
): GeneAndSSMPanelData => {
  const { cohortFilters, genomicFilters } = useMutationFrequencyFilters();
  const caseFilters: GqlOperation = useDeepCompareMemo(
    () => buildCohortGqlOperator(cohortFilters),
    [cohortFilters],
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
    isUninitialized: survivalPlotUninit,
  } = useGetSurvivalPlotQuery(
    {
      case_filters: caseFilters,
      filters: memoizedFilters,
    },
    { skip: comparativeSurvival === undefined },
  );

  return {
    survivalPlotData,
    survivalPlotFetching: survivalPlotFetching || survivalPlotUninit,
    survivalPlotReady,
  };
};

/**
 * Hook to set the comparative survival to the top result of the table when the filters, search on the mutation table
 * due to a user selecting a mutation on the genes table or app changes
 * @param appMode - current app
 * @param comparativeSurvival - value for what is plotted against the current cohort on survival plot
 * @param setComparativeSurvival - function to set comparative survival
 * @param searchTermsForGene - search filter for the mutation table
 * @param topGeneSSMSSuccess - whether the request for the top gene/ssms has succeeded
 * @param topGeneSSMS - the top gene/ssms data
 * @param topSMSSuccess - whether the request for the top ssm has succeeded
 * @param topSSM - the top ssm when a user has searched from the genes table
 **/
export const useAutomaticComparativeSurvival = ({
  appMode,
  comparativeSurvival,
  setComparativeSurvival,
  searchTermsForGene,
  topGeneSSMSSuccess,
  topGeneSSMS,
  topSSMSuccess,
  topSSM,
}: {
  appMode: AppModeState;
  comparativeSurvival: ComparativeSurvival;
  setComparativeSurvival: (comparativeSurvival: ComparativeSurvival) => void;
  searchTermsForGene: { geneId: string; geneSymbol: string };
  topGeneSSMSSuccess: boolean;
  topGeneSSMS: GeneSSMSEntry;
  topSSMSuccess: boolean;
  topSSM: TopSsm;
}) => {
  const ssmSearch = searchTermsForGene?.geneSymbol;

  // Set new comparative survival if top changed due to filters or tab change
  useDeepCompareEffect(() => {
    if (!comparativeSurvival?.setManually && topGeneSSMSSuccess && !ssmSearch) {
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
                  ? fieldNameToTitle(
                      consequence_type
                        .replace("_variant", "")
                        .replace("_", " "),
                    )
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

  // Set comparative survival when we've selected a mutation from the genes table
  useDeepCompareEffect(() => {
    if (topSSMSuccess && ssmSearch) {
      const { ssm_id, consequence_type, aa_change = "" } = topSSM;
      const description = consequence_type
        ? `${searchTermsForGene?.geneSymbol ?? ""} ${aa_change} ${fieldNameToTitle(
            consequence_type.replace("_variant", "").replace("_", " "),
          )}`
        : "";

      setComparativeSurvival({
        symbol: ssm_id,
        name: description,
        field: "gene.ssm.ssm_id",
      });
    }
  }, [
    topSSM,
    setComparativeSurvival,
    searchTermsForGene,
    ssmSearch,
    topSSMSuccess,
  ]);
};

export const useMutationFrequencyFilters = () => {
  const isDemoMode = useIsDemoApp();

  const currentCohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const genomicFilters: FilterSet = useAppSelector((state) =>
    selectGeneAndSSMFilters(state),
  );

  const cohortFilters = useDeepCompareMemo(
    () =>
      isDemoMode
        ? overwritingDemoFilterMutationFrequency
        : currentCohortFilters,
    [isDemoMode, currentCohortFilters],
  );

  return {
    cohortFilters,
    genomicFilters,
  };
};

export const useOpenUploadModal = () => {
  const coreDispatch = useCoreDispatch();

  const openUploadModal = (field: string) => {
    if (field === "genes.upload.gene_id") {
      coreDispatch(showModal({ modal: Modals.LocalGeneSetModal }));
    } else if (field === "ssms.upload.ssm_id") {
      coreDispatch(showModal({ modal: Modals.LocalMutationSetModal }));
    }
  };

  return openUploadModal;
};

export const useUploadFilterItems = (uploadField: string) => {
  const field = uploadField.split(".upload").join("");
  const items = useGenomicFilterValueByName(field);
  return { items, noData: items === undefined };
};
