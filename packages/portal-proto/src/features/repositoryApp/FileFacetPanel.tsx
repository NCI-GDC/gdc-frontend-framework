import { EnumFacet } from "@/features/facets/EnumFacet";
import React, { useState } from "react";
import { useFacetDictionary } from "@gff/core";
import {
  useAppSelector,
  useAppDispatch,
} from "@/features/repositoryApp/appApi";
import {
  selectRepositoryConfig,
  addFilter,
  removeFilter,
  resetToDefault,
} from "@/features/repositoryApp/fileFiltersSlice";
import { getFacetInfo } from "@/features/cohortBuilder/utils";
import FacetSelection from "@/components/FacetSelection";
import { Group, Button, LoadingOverlay, Text, Modal } from "@mantine/core";
import { MdAdd as AddAdditionalIcon } from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";

export const FileFacetPanel = () => {
  const configState = useAppSelector(selectRepositoryConfig);
  const { isSuccess: isDictionaryReady } = useFacetDictionary();
  const facets = getFacetInfo(configState.facets);
  const [opened, setOpened] = useState(false);
  const appDispatch = useAppDispatch();

  const handleFilterSelected = (filter: string) => {
    setOpened(false);
    appDispatch(addFilter({ facetName: filter }));
  };

  const handleRemoveFilter = (filter: string) => {
    appDispatch(removeFilter({ facetName: filter }));
  };

  return (
    <div className="flex flex-col gap-y-4 mr-3">
      <Group position="apart">
        Filters
        <Button aria-label="Reset">
          <UndoIcon size="1.5em" />
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
      <div className="flex flex-col gap-y-4 mr-3">
        <Modal size="lg" opened={opened} onClose={() => setOpened(false)}>
          <FacetSelection
            title={"Add File Filter"}
            facetType="files"
            handleFilterSelected={handleFilterSelected}
            usedFacetsSelector={facets}
          />
        </Modal>
        <LoadingOverlay visible={!isDictionaryReady} />
        {facets.map((x, index) => {
          return (
            <EnumFacet
              key={`${x.field}-${index}`}
              field={`${x.field}`}
              docType="files"
              indexType="repository"
              showPercent={false}
              description={x.description}
              dismissCallback={handleRemoveFilter}
            />
          );
        })}
      </div>
    </div>
  );
};
