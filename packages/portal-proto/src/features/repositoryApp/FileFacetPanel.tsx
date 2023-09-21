import React, { useEffect, useState, useCallback } from "react";
import {
  FacetDefinition,
  selectFacetDefinitionsByName,
  useCoreSelector,
  useFacetDictionary,
  usePrevious,
  fieldNameToTitle,
} from "@gff/core";
import {
  useAppSelector,
  useAppDispatch,
} from "@/features/repositoryApp/appApi";
import {
  selectRepositoryConfig,
  addFilter,
  removeFilter,
  resetToDefault,
  getDefaultFacets,
} from "@/features/repositoryApp/repositoryConfigSlice";
import FacetSelection from "@/components/FacetSelection";
import { Group, Button, LoadingOverlay, Text, Modal } from "@mantine/core";
import { MdAdd as AddAdditionalIcon } from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import isEqual from "lodash/isEqual";
import partial from "lodash/partial";

import {
  useLocalFilters,
  useRepositoryFilters,
  useRepositoryEnumValues,
  useClearRepositoryFilters,
  useUpdateRepositoryFacetFilter,
  useSelectFieldFilter,
  useRepositoryRangeFacet,
} from "@/features/repositoryApp/hooks";
import {
  FacetDocTypeToCountsIndexMap,
  useTotalCounts,
} from "@/features/facets/hooks";
import { createFacetCard } from "@/features/facets/CreateFacetCard";
import { FacetRequiredHooks } from "@/features/facets/types";

const useRepositoryEnumData = (field: string) =>
  useLocalFilters(field, useRepositoryEnumValues, useRepositoryFilters);

export const FileFacetPanel = (): JSX.Element => {
  const config = useAppSelector(selectRepositoryConfig);
  const { isSuccess: isDictionaryReady } = useFacetDictionary();
  const facets = useCoreSelector((state) =>
    selectFacetDefinitionsByName(state, config.facets),
  );

  const [facetDefinitions, setFacetDefinitions] =
    useState<ReadonlyArray<FacetDefinition>>(facets);
  const prevCustomFacets = usePrevious(facets);
  const [opened, setOpened] = useState(false);
  const dispatch = useAppDispatch();

  const handleFilterSelected = useCallback(
    (filter: string) => {
      setOpened(false);
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
  useEffect(() => {
    if (isDictionaryReady && !isEqual(prevCustomFacets, facets)) {
      setFacetDefinitions(facets);
    }
  }, [facets, isDictionaryReady, prevCustomFacets]);

  const showReset = facetDefinitions.some(
    (facetDef) => !getDefaultFacets().includes(facetDef.full),
  );

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
  };

  return (
    <div className="flex flex-col gap-y-4 mr-3">
      <Group position="apart">
        <Text
          size="lg"
          weight={700}
          className="text-primary-content-darker"
          data-testid="filters-title"
        >
          Filters
        </Text>
        {showReset && (
          <Button
            size="xs"
            color="secondary"
            variant="outline"
            aria-label="Reset File Filters"
            onClick={() => handleClearAll()}
          >
            <UndoIcon size="0.85em" className="mr-4" />
            Reset
          </Button>
        )}
      </Group>
      <Button
        variant="outline"
        aria-label="Add a file filter"
        data-testid="button-add-a-file-filter"
        className="mx-1 bg-primary-lightest flex flex-row justify-center align-middle items-center border-primary-darker b-2"
        onClick={() => setOpened(true)}
      >
        <AddAdditionalIcon className="text-primary-content" size="2em" />
        <Text size="md" weight={700} className="text-primary-content-darker">
          {" "}
          Add a File Filter
        </Text>
      </Button>
      <div className="flex flex-col gap-y-4" data-testid="filters-facets">
        <Modal size="lg" opened={opened} onClose={() => setOpened(false)}>
          <FacetSelection
            title="Add a File Filter"
            facetType="files"
            handleFilterSelected={handleFilterSelected}
            usedFacets={config.facets}
          />
        </Modal>
        <LoadingOverlay
          data-testid="loading-spinner"
          visible={!isDictionaryReady}
        />
        {facetDefinitions.map((x) => {
          const isDefault = getDefaultFacets().includes(x.full);
          const facetName = fieldNameToTitle(x.full, isDefault ? 1 : 2);
          return createFacetCard(
            x,
            "Files",
            FileFacetHooks,
            "repository-app",
            !isDefault ? handleRemoveFilter : undefined,
            false,
            facetName,
            "w-full",
          );
        })}
      </div>
    </div>
  );
};
