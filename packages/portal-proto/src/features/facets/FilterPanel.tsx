import React, { useState } from "react";
import { Text, Button, Modal, LoadingOverlay } from "@mantine/core";
import { MdAdd as AddAdditionalIcon } from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import { fieldNameToTitle } from "@gff/core";
import { createFacetCard } from "@/features/facets/CreateFacetCard";
import {
  FacetCardDefinition,
  FacetRequiredHooks,
} from "@/features/facets/types";
import FacetSelection from "@/components/FacetSelection";

interface FilterPanelProps {
  readonly facetDefinitions: FacetCardDefinition[];
  readonly facetHooks: FacetRequiredHooks;
  readonly valueLabel: string | ((x: FacetCardDefinition) => string);
  readonly app: string;
  readonly toggleAllFiltersExpanded: (expanded: boolean) => void;
  readonly allFiltersCollapsed: boolean;
  readonly hasCustomFilters?: boolean;
  readonly handleRemoveFilter?: (filter: string) => void;
  readonly handleCustomFilterSelected?: (filter: string) => void;
  readonly getDefaultFacets?: () => string[];
  readonly customFacetsConfig?: readonly string[];
  readonly showReset?: boolean;
  readonly handleClearAll?: () => void;
  readonly hideIfEmpty?: boolean;
  readonly showPercent?: boolean;
  readonly isLoading?: boolean;
}

const FilterPanel = ({
  facetDefinitions,
  facetHooks,
  valueLabel,
  app,
  toggleAllFiltersExpanded,
  allFiltersCollapsed,
  hasCustomFilters = false,
  handleRemoveFilter = undefined,
  handleCustomFilterSelected = undefined,
  getDefaultFacets = undefined,
  customFacetsConfig = undefined,
  showReset = false,
  handleClearAll = undefined,
  hideIfEmpty = false,
  showPercent = true,
  isLoading = false,
}: FilterPanelProps) => {
  const [opened, setOpened] = useState(false);

  return (
    <div className="w-1/3 xl:w-1/4 pl-[calc(100vw - 100%)]">
      <div className="flex flex-col gap-y-3 mr-3 mb-4">
        <div>
          <Text size="lg" className="text-primary-content-darker font-bold">
            Filters
          </Text>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => toggleAllFiltersExpanded(allFiltersCollapsed)}
            className="w-fit"
          >
            {allFiltersCollapsed ? "Expand All" : "Collapse All"}
          </button>
          {showReset && (
            <Button
              size="xs"
              color="secondary"
              variant="subtle"
              aria-label={`Reset ${
                typeof valueLabel === "string" ? valueLabel : ""
              } Filters`}
              onClick={() => handleClearAll()}
            >
              Reset Filters
            </Button>
          )}
        </div>
        {hasCustomFilters && (
          <>
            <Button
              variant="outline"
              aria-label="Add a custom filter"
              data-testid="button-add-a-file-filter"
              className="flex justify-center items-center border-primary-darker text-primary hover:text-base-max hover:bg-primary rounded-md"
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
                    handleFilterSelected={(filter: string) => {
                      handleCustomFilterSelected(filter);
                      setOpened(false);
                    }}
                    usedFacets={customFacetsConfig}
                  />
                </div>
              </Modal>
            </div>
          </>
        )}
        <LoadingOverlay data-testid="loading-spinner" visible={isLoading} />
        <div data-testid="filters-facets" className="flex flex-col gap-y-4">
          <div className="h-screen overflow-y-scroll flex flex-col gap-y-4 border-t-1 border-b-1 rounded-md">
            {facetDefinitions.map((x) => {
              const isDefault =
                getDefaultFacets !== undefined
                  ? getDefaultFacets().includes(x.full)
                  : true;
              const facetName = fieldNameToTitle(x.full);
              return createFacetCard({
                facet: x,
                valueLabel:
                  typeof valueLabel === "string" ? valueLabel : valueLabel(x),
                dataFunctions: facetHooks,
                idPrefix: app,
                dismissCallback: !isDefault ? handleRemoveFilter : undefined,
                hideIfEmpty,
                showPercent,
                facetName,
                width: "w-full",
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
