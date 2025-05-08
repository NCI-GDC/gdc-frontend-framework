import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Group,
  Highlight,
  LoadingOverlay,
  SimpleGrid,
  TextInput,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import { FacetCardDefinition, QueryOptions } from "./types";

interface FacetListProps {
  readonly data?: Record<string, FacetCardDefinition>; // Facets to display
  readonly searchString?: string; // current search string (used to highlight matches)
  readonly handleFilterSelected: (field: string) => void; // called when a Facet is picked.
}

/**
 * A Facet Filter List which is used to display and select a facet to add
 * to an application
 *
 */
const FacetList: React.FC<FacetListProps> = ({
  data,
  searchString = "",
  handleFilterSelected,
}: FacetListProps) => {
  return (
    <Stack style={{ height: "50vh", overflow: "scroll" }}>
      <SimpleGrid cols={1} spacing={1}>
        {data
          ? Object.values(data).map((x, index) => {
              return (
                <Stack
                  key={x.field}
                  className={`${
                    index % 2 == 0
                      ? "bg-[var(--mantine-color-gray-0)]"
                      : "bg-[var(--mantine-color-gray-2)]"
                  } hover:bg-[var(--mantine-color-blue-1)]`}
                >
                  <button
                    data-testid={`button-${x.name ?? x.field}`}
                    onClick={() => handleFilterSelected(x.field)}
                    className="text-left"
                  >
                    <Highlight
                      size="sm"
                      highlight={searchString}
                      className="font-bold"
                    >
                      {x.name ?? x.field}
                    </Highlight>
                    {x.description ? (
                      <Highlight
                        size="xs"
                        highlight={searchString}
                        className="font-content"
                      >
                        {x.description}
                      </Highlight>
                    ) : null}
                  </button>
                </Stack>
              );
            })
          : null}
      </SimpleGrid>
    </Stack>
  );
};

interface FacetSelectionProps {
  readonly facets: Record<string, FacetCardDefinition>;
  readonly handleFilterSelected: (_: string) => void;
  readonly handleFilteredWithValuesChanged: (_: boolean) => void;
}

const FacetSelectionPanel = ({
  facets,
  handleFilterSelected,
  handleFilteredWithValuesChanged,
}: FacetSelectionProps) => {
  const [searchString, setSearchString] = useState("");
  const [filteredData, setFilteredData] = useState<
    Record<string, FacetCardDefinition> | undefined
  >(undefined);

  useEffect(() => {
    if (!facets) return;
    if (searchString && searchString.length > 1) {
      const s = Object.values(facets)
        .filter((y) => {
          return searchString
            ? y.field?.includes(searchString.trim()) ||
                y.description?.includes(searchString.trim())
            : true;
        })
        .reduce((res: Record<string, FacetCardDefinition>, value) => {
          return { ...res, [value.field]: value };
        }, {});
      setFilteredData(s);
    } else {
      setFilteredData(facets);
    }
  }, [facets, searchString]);

  return (
    <div className="flex flex-col" data-testid="section-file-filter-search">
      <TextInput
        data-autofocus
        label="Search for a property"
        data-testid="textbox-search-for-a-property"
        placeholder="search"
        value={searchString}
        rightSection={
          searchString?.length > 0 ? (
            <UnstyledButton
              className="opacity-100"
              onClick={() => setSearchString("")}
              aria-label="Clear Search"
            >
              x
            </UnstyledButton>
          ) : null
        }
        onChange={(evt) => setSearchString(evt.target.value)}
        type="search"
      />
      <Group justify="space-between">
        <p role="status">
          {filteredData ? Object.values(filteredData).length : ""} properties
        </p>
        <Checkbox
          label="Only show properties with values"
          onChange={(event) =>
            handleFilteredWithValuesChanged(event.currentTarget.checked)
          }
          aria-label="show only properties with values"
        />
      </Group>
      <div data-testid="list-file-filters">
        <LoadingOverlay
          data-testid="loading-spinner"
          visible={facets === undefined}
        />
        <FacetList
          data={filteredData}
          handleFilterSelected={handleFilterSelected}
          searchString={searchString.length > 1 ? searchString : ""}
        />
      </div>
    </div>
  );
};

interface FacetSelectionModalProps {
  readonly usedFacets: readonly string[];
  readonly useAvailableCustomFacets: (
    usedFacets: readonly string[],
    onlyFiltersWithValues: boolean,
    queryOptions?: QueryOptions,
  ) => {
    data: Record<string, FacetCardDefinition>;
  };
  readonly handleFilterSelected: (field: string) => void;
  readonly queryOptions?: QueryOptions;
}

/**
 * Top Level Facet Selection Panel. This component handles getting the available Facets using the supplied selector (useFacetSelector)
 * If a user picks a facet it will call handleFilterSelected
 * passing the full name of the selected Facet
 * @param usedFacets - list of facets that have already been selected
 * @param useAvailableCustomFacets - hook to retrieve list of filter currently in use, those filters are not shown in the list
 * @param handleFilterSelected - function which handled when a filter is selected
 * @param queryOptions - info to pass back to data fetching hooks about this facet
 */
const FacetSelection = ({
  usedFacets,
  useAvailableCustomFacets,
  handleFilterSelected,
  queryOptions,
}: FacetSelectionModalProps): JSX.Element => {
  const [onlyFiltersWithValues, setOnlyFiltersWithValues] = useState(false);
  const { data: currentFacets } = useAvailableCustomFacets(
    usedFacets,
    onlyFiltersWithValues,
    queryOptions,
  );

  return (
    <FacetSelectionPanel
      facets={currentFacets}
      handleFilterSelected={handleFilterSelected}
      handleFilteredWithValuesChanged={setOnlyFiltersWithValues}
    />
  );
};

export default FacetSelection;
