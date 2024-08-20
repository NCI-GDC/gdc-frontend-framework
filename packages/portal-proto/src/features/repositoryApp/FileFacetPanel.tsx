import React, { useState, useCallback } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
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
  selectCustomFacets,
  addFilter,
  removeFilter,
  resetToDefault,
  getDefaultFacets,
  selectRepositoryConfigFacets,
} from "@/features/repositoryApp/repositoryConfigSlice";
import partial from "lodash/partial";

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
} from "@/features/repositoryApp/hooks";
import {
  FacetDocTypeToCountsIndexMap,
  useTotalCounts,
} from "@/features/facets/hooks";
import { FacetRequiredHooks } from "@/features/facets/types";
import FilterPanel from "../facets/FilterPanel";

const useRepositoryEnumData = (field: string) =>
  useLocalFilters(field, useRepositoryEnumValues, useRepositoryFilters);

export const FileFacetPanel = (): JSX.Element => {
  const customFacets = useAppSelector(selectCustomFacets);
  const facetsConfig = useAppSelector(selectRepositoryConfigFacets);
  const { isSuccess: isDictionaryReady } = useFacetDictionary();
  const facets = useCoreSelector((state) =>
    selectFacetDefinitionsByName(state, facetsConfig),
  );

  const [facetDefinitions, setFacetDefinitions] = useState<
    Array<FacetDefinition>
  >([...facets]);

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
  const handleClearAll = useCallback(() => {
    dispatch(resetToDefault());
  }, [dispatch]);

  // rebuild customFacets
  useDeepCompareEffect(() => {
    if (isDictionaryReady) {
      setFacetDefinitions([...facets]);
    }
  }, [facets, isDictionaryReady]);

  const showReset = customFacets?.length > 0;

  const FileFacetHooks: FacetRequiredHooks = {
    useGetEnumFacetData: useRepositoryEnumData,
    useGetRangeFacetData: useRepositoryRangeFacet,
    useUpdateFacetFilters: useUpdateRepositoryFacetFilter,
    useGetFacetFilters: useSelectFieldFilter,
    useClearFilter: useClearRepositoryFilters,
    useTotalCounts: partial(
      useTotalCounts,
      FacetDocTypeToCountsIndexMap["files"],
    ),
    useToggleExpandFilter: useToggleExpandFilter,
    useFilterExpanded: useFilterExpandedState,
  };

  const allFiltersCollapsed = useAllFiltersCollapsed();
  const toggleAllFiltersExpanded = useToggleAllProjectFilters();

  return (
    <FilterPanel
      facetDefinitions={facetDefinitions}
      facetHooks={FileFacetHooks}
      app="repository-app"
      valueLabel="Files"
      toggleAllFiltersExpanded={toggleAllFiltersExpanded}
      allFiltersCollapsed={allFiltersCollapsed}
      showReset={showReset}
      handleClearAll={handleClearAll}
      hasCustomFilters
      handleRemoveFilter={handleRemoveFilter}
      handleCustomFilterSelected={handleFilterSelected}
      getDefaultFacets={getDefaultFacets}
      customFacetsConfig={facetsConfig}
      isLoading={!isDictionaryReady}
    />
  );
};
