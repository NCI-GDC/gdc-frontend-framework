import React, {
  useState,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { isEqual } from "lodash";
import { Text, Modal, LoadingOverlay, Badge, Tooltip } from "@mantine/core";
import { fieldNameToTitle } from "@gff/core";
import {
  createFacetCards,
  FacetSelection,
  FacetCardDefinition,
  FacetRequiredHooks,
} from "@gff/portal-components";
import { TableXPositionContext } from "@/components/Table/VerticalTable";
import { AddIcon, UndoIcon } from "@/utils/icons";
import { CustomConfig } from "./types";
import { EnumFacetChart } from "../charts/EnumFacetChart";
import { useAvailableCustomFacets } from "../cohortBuilder/hooks";
import { showNotification } from "@mantine/notifications";
interface FilterPanelProps {
  readonly facetDefinitions: FacetCardDefinition[];
  readonly facetHooks: FacetRequiredHooks;
  readonly valueLabel: string | ((queryOptions) => string);
  readonly app: string;
  readonly toggleAllFiltersExpanded: (expanded: boolean) => void;
  readonly allFiltersCollapsed: boolean;
  readonly customConfig?: CustomConfig;
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
  const ref = useRef<HTMLDivElement>();
  const { xPosition } = useContext(TableXPositionContext);

  const facetFields = facetDefinitions.map((x) => x.field);

  const maxHeight = useMemo(() => {
    const calcHeight = xPosition - ref?.current?.getBoundingClientRect().top;
    return isNaN(calcHeight) ? undefined : calcHeight;
  }, [xPosition]);

  const customFacetDefinitions = customConfig
    ? facetDefinitions.filter(
        (facet) => !customConfig.defaultFilters.includes(facet.field),
      )
    : [];
  const defaultFacetDefinitions = customConfig
    ? facetDefinitions.filter((facet) =>
        customConfig.defaultFilters.includes(facet.field),
      )
    : facetDefinitions;

  const handleResetCustomFilter = useCallback(() => {
    customConfig.handleResetCustomFilters();
    showNotification({
      message:
        "Custom filter cards have been removed from the Filters panel. Existing filters will still be applied.",
    });
  }, [customConfig]);

  return (
    <div className="flex flex-col gap-y-4 min-w-[14rem] w-3/12 max-w-[23rem]">
      <Text size="lg" className="text-primary-content-darker font-bold">
        Filters
      </Text>
      <div className="flex flex-col flex-wrap">
        <div className="flex flex-wrap justify-between text-primary-content-darker">
          <button
            data-testid="button-expand-collapse-files-table"
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
            <div className="flex min-h-[36px] mt-3.5 w-full">
              <Tooltip label="Remove all custom filters cards" offset={10}>
                <button
                  data-testid="button-reset-custom-filters-files-table"
                  className="flex justify-center items-center w-12 border-1 rounded-l-md border-primary-darker text-primary disabled:opacity-50 disabled:bg-base-max disabled:text-primary disabled:cursor-not-allowed"
                  onClick={handleResetCustomFilter}
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
                <AddIcon className="text-2xl xl:text-xl" />
                <Text className="text-sm font-bold">Add a Custom Filter</Text>
              </button>
            </div>

            <Modal
              data-testid="modal-repository-add-custom-filter"
              size="xl"
              opened={opened}
              onClose={() => setOpened(false)}
              title="Add a Custom Filter"
            >
              <div className="p-4">
                <FacetSelection
                  handleFilterSelected={(filter: string) => {
                    customConfig.handleCustomFilterSelected(filter);
                    setOpened(false);
                  }}
                  useAvailableCustomFacets={useAvailableCustomFacets}
                  queryOptions={customConfig.queryOptions}
                  usedFacets={customConfig.usedFacets}
                />
              </div>
            </Modal>
          </>
        )}
      </div>
      <LoadingOverlay data-testid="loading-spinner" visible={isLoading} />
      <div
        data-testid="filters-facets"
        className="flex flex-col gap-y-4 max-h-screen overflow-y-auto border-t-1 border-b-1 rounded-md"
        style={{
          maxHeight,
        }}
        ref={ref}
      >
        {createFacetCards({
          facets: customFacetDefinitions,
          valueLabel,
          hooks: facetHooks,
          idPrefix: app,
          dismissCallback: customConfig?.handleRemoveFilter,
          hideIfEmpty,
          showPercent,
          facetNameFormatter: (field: string) => {
            return fieldNameToTitle(field, 2);
          },
          Chart: EnumFacetChart,
          queryOptions: { docType: "cases" },
        })}
        {createFacetCards({
          facets: defaultFacetDefinitions,
          valueLabel,
          hooks: facetHooks,
          idPrefix: app,
          hideIfEmpty,
          showPercent,
          facetNameFormatter: fieldNameToTitle,
          Chart: EnumFacetChart,
          queryOptions: { docType: "cases" },
        })}
      </div>
    </div>
  );
};

export default FilterPanel;
