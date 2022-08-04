import { EnumFacet } from "@/features/facets/EnumFacet";
import React, { useEffect, useState } from "react";
import {
  EnumOperandValue,
  FacetDefinition,
  GQLDocType,
  GQLIndexType,
  removeCohortFilter,
  selectCurrentCohortFilterSet,
  selectFacetDefinitionsByName,
  useCoreSelector,
  useFacetDictionary,
  usePrevious,
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
import {
  useLocalFilters,
  useRepositoryFilters,
  useRepositoryEnumValues,
  updateEnumerationFilters,
} from "@/features/repositoryApp/hooks";
import {
  updateRepositoryFilter,
  removeRepositoryFilter,
  clearRepositoryFilters,
} from "./repositoryFiltersSlice";

const useRepositoryEnumData = (
  field: string,
  docType: GQLDocType,
  indexType: GQLIndexType,
) =>
  useLocalFilters(
    field,
    docType,
    indexType,
    useRepositoryEnumValues,
    useRepositoryFilters,
  );

export const FileFacetPanel = () => {
  const config = useAppSelector(selectRepositoryConfig);
  const { isSuccess: isDictionaryReady } = useFacetDictionary();
  const facets = useCoreSelector((state) =>
    selectFacetDefinitionsByName(state, config.facets),
  );
  const dispatch = useAppDispatch();
  const useEnumValues = (
    enumerationFilters: EnumOperandValue,
    field: string,
  ) => {
    return updateEnumerationFilters(
      enumerationFilters,
      field,
      dispatch,
      updateRepositoryFilter,
      removeRepositoryFilter,
    );
  };

  const [facetDefinitions, setFacetDefinitions] =
    useState<ReadonlyArray<FacetDefinition>>(facets);
  const prevCustomFacets = usePrevious(facets);
  const [opened, setOpened] = useState(false);
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilterSet(state),
  );

  const appDispatch = useAppDispatch();
  const prevCohortFilters = usePrevious(cohortFilters);

  const handleFilterSelected = (filter: string) => {
    setOpened(false);
    appDispatch(addFilter({ facetName: filter }));
  };

  const handleRemoveFilter = (filter: string) => {
    appDispatch(removeFilter({ facetName: filter }));
  };

  // clears all added custom facets
  const handleClearAll = () => {
    appDispatch(resetToDefault());
  };

  const clearFilters = (f: string) => appDispatch(removeCohortFilter(f));

  // rebuild customFacets
  useEffect(() => {
    if (isDictionaryReady && !isEqual(prevCustomFacets, facets)) {
      setFacetDefinitions(facets);
    }
  }, [facets, isDictionaryReady, prevCustomFacets]);

  // Clear filters if Cohort Changes
  useEffect(() => {
    if (!isEqual(prevCohortFilters, cohortFilters)) {
      appDispatch(clearRepositoryFilters());
    }
  }, [appDispatch, cohortFilters, prevCohortFilters, prevCustomFacets]);

  return (
    <div className="flex flex-col gap-y-4 mr-3 w-64  ">
      <Group position="apart">
        <Text size="lg" weight={700} className="text-nci-blue-darker">
          Filters
        </Text>
        <Button
          size="xs"
          variant="outline"
          aria-label="Reset File Filters"
          onClick={() => handleClearAll()}
        >
          <UndoIcon size="0.85em" className="mr-4" />
          Reset
        </Button>
      </Group>
      <Button
        variant="outline"
        aria-label="Add a file filter"
        className="mx-1 bg-white flex flex-row justify-center align-middle items-center border-nci-blue-darker b-2"
        onClick={() => setOpened(true)}
      >
        <AddAdditionalIcon className="text-nci-blue" size="2em" />
        <Text size="md" weight={700} className="text-nci-blue-darker">
          {" "}
          Add a File Filter
        </Text>
      </Button>
      <div className="flex flex-col gap-y-4 mr-3 h-screen/1.5 overflow-y-scroll">
        <Modal size="lg" opened={opened} onClose={() => setOpened(false)}>
          <FacetSelection
            title={"Add File Filter"}
            facetType="files"
            handleFilterSelected={handleFilterSelected}
            usedFacets={config.facets}
          />
        </Modal>
        <LoadingOverlay visible={!isDictionaryReady} />
        {facetDefinitions.map((x, index) => {
          const isDefault = getDefaultFacets().includes(x.full);
          return (
            // TODO: add other facet types when available
            <EnumFacet
              key={`${x.full}-${index}`}
              field={`${x.full}`}
              docType="files"
              indexType="repository"
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
              dismissCallback={!isDefault ? handleRemoveFilter : undefined}
              facetDataFunc={useRepositoryEnumData}
              updateEnumsFunc={useEnumValues}
              clearFilterFunc={clearFilters}
            />
          );
        })}
      </div>
    </div>
  );
};
