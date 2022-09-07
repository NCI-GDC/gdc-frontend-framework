import { EnumFacet } from "@/features/facets/EnumFacet";
import React, { useEffect, useState, useCallback } from "react";
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
import { convertFieldToName } from "@/features/facets/utils";

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

export const FileFacetPanel = (): JSX.Element => {
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

  const prevCohortFilters = usePrevious(cohortFilters);

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

  const clearFilters = useCallback(
    (f: string) => dispatch(removeCohortFilter(f)),
    [dispatch],
  );

  // rebuild customFacets
  useEffect(() => {
    if (isDictionaryReady && !isEqual(prevCustomFacets, facets)) {
      setFacetDefinitions(facets);
    }
  }, [facets, isDictionaryReady, prevCustomFacets]);

  // Clear filters if Cohort Changes
  useEffect(() => {
    if (!isEqual(prevCohortFilters, cohortFilters)) {
      dispatch(clearRepositoryFilters());
    }
  }, [dispatch, cohortFilters, prevCohortFilters, prevCustomFacets]);

  const showReset = facetDefinitions.some(
    (facetDef) => !getDefaultFacets().includes(facetDef.full),
  );

  return (
    <div className="flex flex-col gap-y-4 mr-3 w-64  ">
      <Group position="apart">
        <Text size="lg" weight={700} className="text-primary-content-darker">
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
        className="mx-1 bg-primary-lightest flex flex-row justify-center align-middle items-center border-primary-darker b-2"
        onClick={() => setOpened(true)}
      >
        <AddAdditionalIcon className="text-primary-content" size="2em" />
        <Text size="md" weight={700} className="text-primary-content-darker">
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
          const facetName = convertFieldToName(x.full, isDefault ? 1 : 2);
          return (
            // TODO: add other facet types when available
            <EnumFacet
              key={`${x.full}-${index}`}
              field={`${x.full}`}
              facetName={facetName}
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
