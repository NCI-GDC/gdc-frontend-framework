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
  addFilter,
  removeFilter,
  resetToDefault,
  getDefaultFacets,
  selectRepositoryConfigFacets,
} from "@/features/repositoryApp/repositoryConfigSlice";
import { selectAppliedFilterCount } from "./repositoryFiltersSlice";
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
  useClearAllRepositoryFilters,
} from "@/features/repositoryApp/hooks";
import {
  FacetDocTypeToCountsIndexMap,
  useTotalCounts,
} from "@/features/facets/hooks";
import { FacetRequiredHooks } from "@/features/facets/types";
import FilterPanel from "@/features/facets/FilterPanel";

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
  const handleResetCustomFilters = useCallback(() => {
    dispatch(resetToDefault());
  }, [dispatch]);

  // rebuild customFacets
  useDeepCompareEffect(() => {
    if (isDictionaryReady) {
      setFacetDefinitions([...facets]);
    }
  }, [facets, isDictionaryReady]);

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
      handleClearAll={clearAllFilters}
      filtersAppliedCount={appliedFilterCount}
      customConfig={{
        handleResetCustomFilters,
        handleRemoveFilter,
        handleCustomFilterSelected: handleFilterSelected,
        defaultFilters,
      }}
      isLoading={!isDictionaryReady}
    />
  );
};
