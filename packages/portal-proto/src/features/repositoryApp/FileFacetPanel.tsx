import React, { useState, useCallback } from "react";
import { useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";
import {
  FacetDefinition,
  selectFacetDefinitionsByName,
  useCoreSelector,
  useFacetDictionary,
} from "@gff/core";
import {
  useAppSelector,
  useAppDispatch,
} from "@/features/repositoryApp/appApi";
import {
  addFilter,
  removeFilter,
  resetToDefault,
  getDefaultFacets,
  selectRepositoryConfigFacets,
} from "@/features/repositoryApp/repositoryConfigSlice";
import { selectAppliedFilterCount } from "./repositoryFiltersSlice";
import {
  useLocalFilters,
  useRepositoryFilters,
  useRepositoryEnumValues,
  useClearRepositoryFilters,
  useUpdateRepositoryFacetFilter,
  useSelectFieldFilter,
  useRepositoryRangeFacet,
  useAllFiltersCollapsed,
  useFilterExpandedState,
  useToggleAllProjectFilters,
  useToggleExpandFilter,
  useClearAllRepositoryFilters,
} from "@/features/repositoryApp/hooks";
import { useTotalCounts } from "@/features/facets/hooks";
import { FacetRequiredHooks } from "@gff/portal-components";
import FilterPanel from "@/features/facets/FilterPanel";
import { useFieldNameToTitle } from "../cohortBuilder/queryExpressionHooks";
import { useSearchEnumTerms } from "../cohortBuilder/hooks";
import { CustomConfig } from "../facets/types";

const useRepositoryEnumData = (field: string) =>
  useLocalFilters(field, useRepositoryEnumValues, useRepositoryFilters);

export const FileFacetPanel = (): JSX.Element => {
  const facetsConfig = useAppSelector(selectRepositoryConfigFacets);
  const { isSuccess: isDictionaryReady } = useFacetDictionary();
  const facets = useCoreSelector((state) =>
    selectFacetDefinitionsByName(state, facetsConfig),
  );
  const appliedFilterCount = useAppSelector(selectAppliedFilterCount);
  const defaultFilters = getDefaultFacets();
  const clearAllFilters = useClearAllRepositoryFilters();

  const [facetDefinitions, setFacetDefinitions] = useState<
    Array<FacetDefinition>
  >(facets.map((f) => ({ ...f, field: f.full })));

  const dispatch = useAppDispatch();

  const handleFilterSelected = useCallback(
    (filter: string) => {
      dispatch(addFilter({ facetName: filter }));
    },
    [dispatch],
  );

  const handleRemoveFilter = useCallback(
    (filter: string) => {
      dispatch(removeFilter({ facetName: filter }));
    },
    [dispatch],
  );

  // clears all added custom facets
  const handleResetCustomFilters = useCallback(() => {
    dispatch(resetToDefault());
  }, [dispatch]);

  // rebuild customFacets
  useDeepCompareEffect(() => {
    if (isDictionaryReady) {
      setFacetDefinitions(facets.map((f) => ({ ...f, field: f.full })));
    }
  }, [facets, isDictionaryReady]);

  const FileFacetHooks: FacetRequiredHooks = {
    useGetEnumFacetData: useRepositoryEnumData,
    useGetRangeFacetData: useRepositoryRangeFacet,
    useUpdateFacetFilters: useUpdateRepositoryFacetFilter,
    useGetFacetFilters: useSelectFieldFilter,
    useClearFilter: useClearRepositoryFilters,
    useTotalCounts: useTotalCounts,
    useToggleExpandFilter: useToggleExpandFilter,
    useFilterExpanded: useFilterExpandedState,
    useFieldNameToTitle,
    useSearchEnumTerms: useSearchEnumTerms,
  };

  const allFiltersCollapsed = useAllFiltersCollapsed();
  const toggleAllFiltersExpanded = useToggleAllProjectFilters();

  const customConfig: CustomConfig = useDeepCompareMemo(
    () => ({
      usedFacets: facetsConfig,
      handleResetCustomFilters,
      handleRemoveFilter,
      handleCustomFilterSelected: handleFilterSelected,
      defaultFilters,
      queryOptions: { facetType: "files" },
    }),
    [
      facetsConfig,
      handleResetCustomFilters,
      handleRemoveFilter,
      handleFilterSelected,
      defaultFilters,
    ],
  );

  return (
    <FilterPanel
      facetDefinitions={facetDefinitions}
      facetHooks={FileFacetHooks}
      app="repository-app"
      valueLabel="Files"
      toggleAllFiltersExpanded={toggleAllFiltersExpanded}
      allFiltersCollapsed={allFiltersCollapsed}
      handleClearAll={clearAllFilters}
      filtersAppliedCount={appliedFilterCount}
      customConfig={customConfig}
      isLoading={!isDictionaryReady}
    />
  );
};
