import React, { useState } from "react";
import { isEqual } from "lodash";
import { Text, Modal, LoadingOverlay, Badge, Tooltip } from "@mantine/core";
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
  readonly customConfig?: {
    readonly handleRemoveFilter: (filter: string) => void;
    readonly handleCustomFilterSelected: (filter: string) => void;
    readonly handleResetCustomFilters: () => void;
    readonly defaultFilters: string[];
  };
  readonly filtersAppliedCount?: number;
  readonly handleClearAll: () => void;
  readonly hideIfEmpty?: boolean;
  readonly showPercent?: boolean;
  readonly isLoading?: boolean;
}

/**
 * Component for the facet filter panel on repository, projects, etc
 * @param facetDefinitions - list of defintions used to create filter cards
 * @param facetHooks - object defining the hooks required by this facet component
 * @param valueLabel - label for the values column (e.g. "Cases" "Projects")
 * @param app - app name
 * @param toggleAllFiltersExpanded - function to expand/collapse all filters
 * @param allFiltersCollapsed - whether all filters are collapsed
 * @param customConfig - props needed for a filter panel where a user can add custom filters
 * @param filtersAppliedCount - the count of filters that have been applied, up to the app to determine
 * @param handleClearAll - callback to remove custom filters
 * @param hideIfEmpty - hide facets if they do not have data
 * @param showPercent - whether to show the count percent of whole
 * @param isLoading - whether the filter defintions are loading
 */

const FilterPanel = ({
  facetDefinitions,
  facetHooks,
  valueLabel,
  app,
  toggleAllFiltersExpanded,
  allFiltersCollapsed,
  customConfig = undefined,
  filtersAppliedCount = 0,
  handleClearAll = undefined,
  hideIfEmpty = false,
  showPercent = true,
  isLoading = false,
}: FilterPanelProps) => {
  const [opened, setOpened] = useState(false);

  const facetFields = facetDefinitions.map((x) => x.full);

  return (
    <div className="w-1/3 xl:w-1/4 pl-[calc(100vw - 100%)]">
      <div className="flex flex-col gap-y-3 mr-3 mb-4">
        <div>
          <Text size="lg" className="text-primary-content-darker font-bold">
            Filters
          </Text>
        </div>
        <div className="flex flex-col flex-wrap gap-3">
          <div className="flex flex-wrap justify-between">
            <button
              onClick={() => toggleAllFiltersExpanded(allFiltersCollapsed)}
            >
              {allFiltersCollapsed ? "Expand All" : "Collapse All"}
            </button>
            {filtersAppliedCount > 0 && (
              <div className="flex flex-row items-center gap-1">
                <Badge className="bg-accent-vivid px-1.5" radius="xs">
                  {filtersAppliedCount}
                </Badge>
                <button
                  onClick={() => {
                    handleClearAll();
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
          {customConfig !== undefined && (
            <>
              <div className="flex min-h-[36px] mt-2">
                <Tooltip
                  label="Reset custom filters"
                  disabled={isEqual(customConfig.defaultFilters, facetFields)}
                >
                  <button
                    className="flex justify-center items-center w-12 border-1 rounded-l-md border-primary-darker text-primary disabled:opacity-50 disabled:bg-base-max disabled:text-primary disabled:cursor-not-allowed"
                    onClick={() => customConfig.handleResetCustomFilters()}
                    disabled={isEqual(customConfig.defaultFilters, facetFields)}
                    aria-label="Reset custom filters"
                  >
                    <UndoIcon />
                  </button>
                </Tooltip>
                <button
                  aria-label="Add a custom filter"
                  data-testid="button-add-a-file-filter"
                  className="flex justify-center items-center border-1 border-l-0 border-primary-darker rounded-r-md text-primary hover:text-base-max hover:bg-primary w-full"
                  onClick={() => setOpened(true)}
                >
                  <AddAdditionalIcon className="text-2xl xl:text-xl" />
                  <Text className="text-sm font-bold">Add a Custom Filter</Text>
                </button>
              </div>
              <div
                className="flex flex-col gap-y-4"
                data-testid="filters-facets"
              >
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
                        customConfig.handleCustomFilterSelected(filter);
                        setOpened(false);
                      }}
                      usedFacets={facetFields}
                    />
                  </div>
                </Modal>
              </div>
            </>
          )}
        </div>
        <LoadingOverlay data-testid="loading-spinner" visible={isLoading} />
        <div data-testid="filters-facets" className="flex flex-col gap-y-4">
          <div className="h-screen overflow-y-scroll flex flex-col gap-y-4 border-t-1 border-b-1 rounded-md">
            {facetDefinitions.map((x) => {
              const isDefault =
                customConfig?.defaultFilters !== undefined
                  ? customConfig.defaultFilters.includes(x.full)
                  : true;
              const facetName = x.title || fieldNameToTitle(x.full);
              return createFacetCard({
                facet: x,
                valueLabel:
                  typeof valueLabel === "string" ? valueLabel : valueLabel(x),
                dataFunctions: facetHooks,
                idPrefix: app,
                dismissCallback: !isDefault
                  ? customConfig.handleRemoveFilter
                  : undefined,
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
