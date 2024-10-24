import React, { useState, useEffect } from "react";
import {
  FacetDefinition,
  fetchFacetsWithValues,
  useCoreDispatch,
  useCoreSelector,
  useFacetDictionary,
  usePrevious,
  FacetDefinitionType,
  selectUsefulFacets,
} from "@gff/core";
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
import isEqual from "lodash/isEqual";

interface FacetListProps {
  readonly data?: Record<string, FacetDefinition>; // Facets to display
  readonly searchString?: string; // current search string (used to highlight matches)
  readonly handleFilterSelected: (_: string) => void; // called when a Facet is picked.
}

/**
 * A Facet Filter List which is used to display and select a facet to add
 * to an application: CohortBuilder and Repository( e.x. Download) are
 * two tools using this component
 *
 */
const FacetList: React.FC<FacetListProps> = ({
  data,
  searchString,
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
                    data-testid={"button-" + x.field}
                    onClick={() => handleFilterSelected(x.full)}
                    className="text-left"
                  >
                    <Highlight
                      size="sm"
                      highlight={searchString}
                      className="font-bold"
                    >
                      {x.field}
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
  readonly facetType: FacetDefinitionType;
  readonly facets: Record<string, FacetDefinition>;
  readonly handleFilterSelected: (_: string) => void;
  readonly handleFilteredWithValuesChanged: (_: boolean) => void;
}

const FacetSelectionPanel = ({
  facets,
  handleFilterSelected,
  handleFilteredWithValuesChanged,
}: FacetSelectionProps) => {
  const [searchString, setSearchString] = useState("");
  const [filteredData, setFilteredData] = useState(undefined);

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
        .reduce((res: Record<string, FacetDefinition>, value) => {
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
  readonly facetType: FacetDefinitionType;
  readonly usedFacets: ReadonlyArray<string>;
  readonly handleFilterSelected: (string) => void;
}

/**
 * Top Level Facet Selection Panel. This component handles getting the available Facets using the supplied selector (useFacetSelector)
 * The Facets are either Case or File and are set by the facetType parameter. If a user picks a facet it will call handleFilterSelected
 * passing the full name of the selected Facet
 * @param facetType - cases or files
 * @param useFacets - list of filter currently in use, those filters are not shown in the list
 * @param handleFilterSelected - function which handled when a filter is selected
 */
const FacetSelection = ({
  facetType,
  usedFacets,
  handleFilterSelected,
}: FacetSelectionModalProps): JSX.Element => {
  // get the current list of cohort filters
  const { data: dictionaryData, isSuccess: isDictionaryReady } =
    useFacetDictionary();
  const [availableFacets, setAvailableFacets] = useState(undefined); // Facets that are current not used
  const [currentFacets, setCurrentFacets] = useState(undefined); // current set of Facets
  const [useUsefulFacets, setUseUsefulFacets] = useState(false); // list of Facet which have values
  const prevAssignedFacets = usePrevious(usedFacets);

  const { data: usefulFacets, status: usefulFacetsStatus } = useCoreSelector(
    (state) => selectUsefulFacets(state, facetType),
  );
  const coreDispatch = useCoreDispatch();

  // select facets with values if not already requested
  useEffect(() => {
    if (
      useUsefulFacets &&
      usefulFacetsStatus == "uninitialized" &&
      isDictionaryReady
    ) {
      coreDispatch(fetchFacetsWithValues(facetType));
    }
  }, [
    coreDispatch,
    facetType,
    isDictionaryReady,
    useUsefulFacets,
    usefulFacetsStatus,
  ]);

  // if data changes or the current facetSet changes rebuild the
  // available facet list
  useEffect(() => {
    if (!isEqual(prevAssignedFacets, usedFacets) && isDictionaryReady) {
      // build the list of filters that are not currently used
      const unusedFacets = Object.values(dictionaryData)
        .filter((x: FacetDefinition) => {
          return x.full.startsWith(facetType);
        })
        .filter((x: FacetDefinition) => {
          return !usedFacets.includes(x.full);
        })
        .reduce(
          (res: Record<string, FacetDefinition>, value: FacetDefinition) => {
            return { ...res, [value.field]: value };
          },
          {},
        );

      setAvailableFacets(unusedFacets);
    }
  }, [
    usedFacets,
    isDictionaryReady,
    prevAssignedFacets,
    useUsefulFacets,
    usefulFacetsStatus,
    usefulFacets,
    facetType,
    dictionaryData,
  ]);

  useEffect(() => {
    const pick = (obj, keys) =>
      Object.fromEntries(
        keys.filter((key) => key in obj).map((key) => [key, obj[key]]),
      );

    if (useUsefulFacets) {
      if (usefulFacetsStatus == "fulfilled") {
        // use only the filters in the list of useful filters
        const filters = pick(availableFacets, usefulFacets);
        setCurrentFacets(filters);
      } else {
        setCurrentFacets(undefined);
      }
    } // use all un-used filters (not assigned to Cohort Builder or Download)
    else setCurrentFacets(availableFacets);
  }, [availableFacets, useUsefulFacets, usefulFacetsStatus, usefulFacets]);

  return (
    <FacetSelectionPanel
      facets={currentFacets}
      facetType={facetType}
      handleFilterSelected={handleFilterSelected}
      handleFilteredWithValuesChanged={setUseUsefulFacets}
    />
  );
};

export default FacetSelection;
