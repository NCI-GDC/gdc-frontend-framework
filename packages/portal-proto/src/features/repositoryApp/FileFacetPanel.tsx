import { EnumFacet } from "@/features/facets/EnumFacet";
import React, { useEffect, useState } from "react";
import {
  FacetDefinition,
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
} from "@/features/repositoryApp/fileFiltersSlice";
import FacetSelection from "@/components/FacetSelection";
import { Group, Button, LoadingOverlay, Text, Modal } from "@mantine/core";
import { MdAdd as AddAdditionalIcon } from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import isEqual from "lodash/isEqual";

export const FileFacetPanel = () => {
  const config = useAppSelector(selectRepositoryConfig);
  const { isSuccess: isDictionaryReady } = useFacetDictionary();
  const facets = useCoreSelector((state) =>
    selectFacetDefinitionsByName(state, config.facets),
  );

  const [facetDefinitions, setFacetDefinitions] =
    useState<ReadonlyArray<FacetDefinition>>(facets);
  const prevCustomFacets = usePrevious(facets);
  const [opened, setOpened] = useState(false);
  const appDispatch = useAppDispatch();

  const handleFilterSelected = (filter: string) => {
    setOpened(false);
    appDispatch(addFilter({ facetName: filter }));
  };

  const handleRemoveFilter = (filter: string) => {
    appDispatch(removeFilter({ facetName: filter }));
  };

  const handleClearAll = () => {
    appDispatch(resetToDefault());
  };

  // rebuild customFacets
  useEffect(() => {
    if (isDictionaryReady && !isEqual(prevCustomFacets, facets)) {
      setFacetDefinitions(facets);
    }
  }, [facets, isDictionaryReady, prevCustomFacets]);

  return (
    <div className="flex flex-col gap-y-4 mr-3 w-64  ">
      <Group position="apart">
        Filters
        <Button
          variant="outline"
          aria-label="Reset"
          onClick={() => handleClearAll()}
        >
          <UndoIcon size="1.5em" className="mr-4" />
          Reset
        </Button>
      </Group>
      <Button
        variant="outline"
        className=" mx-6 bg-white flex flex-row justify-center align-middle items-center border-nci-blue-darker b-2"
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
            // TODO: add other facet type when available
            <EnumFacet
              key={`${x.full}-${index}`}
              field={`${x.full}`}
              docType="files"
              indexType="repository"
              showPercent={false}
              hideIfEmpty={false}
              description={x.description}
              dismissCallback={!isDefault ? handleRemoveFilter : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};
