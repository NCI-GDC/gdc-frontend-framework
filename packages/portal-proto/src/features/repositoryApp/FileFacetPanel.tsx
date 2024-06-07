import React, { useState, useCallback } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import {
  FacetDefinition,
  selectFacetDefinitionsByName,
  useCoreSelector,
  useFacetDictionary,
  fieldNameToTitle,
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
import FacetSelection from "@/components/FacetSelection";
import { Group, Button, LoadingOverlay, Text, Modal } from "@mantine/core";
import { MdAdd as AddAdditionalIcon } from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
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
  const customFacets = useAppSelector(selectCustomFacets);
  const facetsConfig = useAppSelector(selectRepositoryConfigFacets);
  const { isSuccess: isDictionaryReady } = useFacetDictionary();
  const facets = useCoreSelector((state) =>
    selectFacetDefinitionsByName(state, facetsConfig),
  );

  const [facetDefinitions, setFacetDefinitions] =
    useState<ReadonlyArray<FacetDefinition>>(facets);
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
  useDeepCompareEffect(() => {
    if (isDictionaryReady) {
      setFacetDefinitions(facets);
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
  };

  return (
    <div className="flex flex-col gap-y-2 mr-3 mb-4">
      <Group justify="space-between">
        <Text
          size="lg"
          className="text-primary-content-darker font-bold"
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
        aria-label="Add a custom filter"
        data-testid="button-add-a-file-filter"
        className="flex justify-center items-center border-primary-darker mb-2 text-primary hover:text-base-max hover:bg-primary rounded-md"
        onClick={() => setOpened(true)}
      >
        <AddAdditionalIcon className="text-2xl xl:text-xl" />
        <Text className="text-sm font-bold">Add a Custom Filter</Text>
      </Button>
      <div className="flex flex-col gap-y-4" data-testid="filters-facets">
        <Modal
          data-testid="modal-repository-add-custom-filter"
          size="xl"
          opened={opened}
          onClose={() => setOpened(false)}
          title="Add a Custom Filter"
        >
          <div className="p-4">
            <FacetSelection
              facetType="files"
              handleFilterSelected={handleFilterSelected}
              usedFacets={facetsConfig}
            />
          </div>
        </Modal>
        <LoadingOverlay
          data-testid="loading-spinner"
          visible={!isDictionaryReady}
        />
        <div className="h-screen overflow-y-scroll flex flex-col gap-y-4 border-t-1 border-b-1 rounded-md">
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
    </div>
  );
};
