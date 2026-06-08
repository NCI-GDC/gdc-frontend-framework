import { useEffect, useMemo, useCallback, useState } from "react";
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
} from "@gff/core";
import { useDeepCompareEffect, useDeepCompareCallback } from "use-deep-compare";
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
import { overwritingDemoFilterMutationFrequency } from "@/features/genomic/GenesAndMutationFrequencyAnalysisTool";
import { buildGeneHaveAndHaveNotFilters } from "@/features/genomic/utils";
import { AppModeState, ComparativeSurvival } from "./types";
import { humanify } from "@/utils/index";
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
  survivalPlotIsUninit: boolean;
}

/*
 * This hook returns the filters, and survival plot data, and it's loading status for the gene and ssm panel.
 */
export const useGenomicSurvivalPlot = (
  comparativeSurvival: ComparativeSurvival,
  isGene: boolean,
  skipSurvivalPlot: boolean,
): GeneAndSSMPanelData => {
  const { cohortFilters, genomicFilters } = useGenomicFilters();
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
    isUninitialized: survivalPlotIsUninit,
  } = useGetSurvivalPlotQuery(
    {
      case_filters: caseFilters,
      filters: memoizedFilters,
    },
    { skip: skipSurvivalPlot || comparativeSurvival === undefined },
  );

  return {
    survivalPlotData,
    survivalPlotFetching,
    survivalPlotReady,
    survivalPlotIsUninit,
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
export const useComparativeSurvival = ({
  appMode,
  searchTermsForGene,
  topGeneSSMSSuccess,
  topGeneSSMS,
  topSSMSuccess,
  topSSM,
}: {
  appMode: AppModeState;
  searchTermsForGene: { geneId: string; geneSymbol: string };
  topGeneSSMSSuccess: boolean;
  topGeneSSMS;
  topSSMSuccess: boolean;
  topSSM;
}) => {
  const [comparativeSurvival, setComparativeSurvival] =
    useState<ComparativeSurvival>(undefined);

  /**
   * Update survival plot in response to user actions. There are two "states"
   * for the survival plot: If comparativeSurvival is undefined it will show the
   * plot for the currentCohort plus whatever local filters are selected for the "top"
   * gene or mutation.
   * If comparativeSurvival is set, then it will show two separate plots.
   * @param symbol - symbol (Gene or SSMS) to compare
   * @param name - used as the label for the symbol in the Survival Plot
   * @param field - which gene or ssms field the symbol applied to
   */
  const handleSurvivalPlotToggled = useDeepCompareCallback(
    (symbol: string, name: string, field: string) => {
      if (comparativeSurvival && comparativeSurvival?.symbol === symbol) {
        setComparativeSurvival(undefined);
      } else {
        setComparativeSurvival({
          symbol: symbol,
          name: name,
          field: field,
          setManually: true,
        });
      }
    },
    [comparativeSurvival],
  );

  useEffect(() => {
    setComparativeSurvival(undefined);
  }, [appMode]);

  // Plot top if new top
  useDeepCompareEffect(() => {
    if (!comparativeSurvival?.setManually && topGeneSSMSSuccess) {
      const { genes, ssms } = topGeneSSMS;
      const { name, symbol } = appMode === "genes" ? genes : ssms;

      if (
        comparativeSurvival !== undefined &&
        comparativeSurvival.symbol === symbol
      ) {
        return;
      }

      if (name === undefined) {
        setComparativeSurvival(undefined);
        return;
      }

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
  ]);

  // Set top when we've searched on SSM
  useDeepCompareEffect(() => {
    if (topSSMSuccess) {
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
  }, [topSSM, setComparativeSurvival, topSSMSuccess, searchTermsForGene]);

  return {
    comparativeSurvival,
    setComparativeSurvival,
    handleSurvivalPlotToggled,
  };
};

export const useGenomicFilters = () => {
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

  return {
    cohortFilters: isDemoMode ? overwritingDemoFilter : cohortFilters,
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
