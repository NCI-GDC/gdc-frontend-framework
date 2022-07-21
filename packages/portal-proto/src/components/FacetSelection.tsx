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
  Title,
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
    <>
      <div className="flex flex-col h-screen/2 overflow-y-scroll">
        <SimpleGrid cols={1} spacing={1}>
          {data
            ? Object.values(data).map((x, index) => {
                return (
                  <button
                    key={x.field}
                    className={`flex flex-col justify-start px-1 ${
                      index % 2 == 0 ? "bg-nci-gray-lightest" : "bg-white"
                    } text-nci-gray-darkest hover:bg-nci-blue-darkest hover:text-nci-gray-lightest transition-colors`}
                    onClick={() => handleFilterSelected(x.full)}
                  >
                    <div className="flex-row font-bold">
                      <Highlight highlight={searchString}>{x.field}</Highlight>
                    </div>
                    {x.description ? (
                      <div className="italic text-sm text-justify">
                        <Highlight highlight={searchString}>
                          {x.description}
                        </Highlight>
                      </div>
                    ) : null}
                  </button>
                );
              })
            : null}
        </SimpleGrid>
      </div>
    </>
  );
};

interface FacetSelectionProps {
  readonly filterType?: string;
  readonly title: string;
  readonly filters: Record<string, FacetDefinition>;
  readonly handleFilterSelected: (_: string) => void;
  readonly handleFilteredWithValuesChanged: (_: boolean) => void;
}

const FacetSelectionPanel = ({
  filters,
  title,
  handleFilterSelected,
  handleFilteredWithValuesChanged,
  filterType = "cases",
}: FacetSelectionProps) => {
  const [searchString, setSearchString] = useState("");
  const [filteredData, setFilteredData] = useState(undefined);

  useEffect(() => {
    if (!filters) return;
    if (searchString && searchString.length > 1) {
      const s = Object.values(filters)
        .filter((y) => {
          return searchString
            ? y.field.includes(searchString) ||
                y.description.includes(searchString)
            : true;
        })
        .reduce((res: Record<string, FacetDefinition>, value) => {
          return { ...res, [value.field]: value };
        }, {});
      setFilteredData(s);
    } else {
      setFilteredData(filters);
    }
  }, [filters, searchString]);

  return (
    <>
      <div className="flex flex-col w-1/2">
        <Title order={3}>{title}</Title>
        <TextInput
          label="Search for a field:"
          placeholder="search"
          value={searchString}
          rightSection={
            searchString?.length > 0 ? (
              <UnstyledButton
                className="opacity-100"
                onClick={() => setSearchString("")}
              >
                x
              </UnstyledButton>
            ) : null
          }
          onChange={(evt) => setSearchString(evt.target.value)}
          aria-label="Search for a field"
        />
        <Group position="apart">
          <p>
            {filteredData ? Object.values(filteredData).length : ""}{" "}
            {filterType} fields
          </p>
          <Checkbox
            label="Only show fields with values"
            onChange={(event) =>
              handleFilteredWithValuesChanged(event.currentTarget.checked)
            }
            aria-label="show only field with values"
          ></Checkbox>
        </Group>
        <div>
          <LoadingOverlay visible={filters === undefined} />
          <FacetList
            data={filteredData}
            handleFilterSelected={handleFilterSelected}
            searchString={
              searchString && searchString.length > 1 ? searchString : ""
            }
          />
        </div>
      </div>
    </>
  );
};

interface FacetSelectionModalProps {
  readonly title: string;
  readonly facetType: FacetDefinitionType;
  readonly usedFacetsSelector: (CoreState) => string[];
  readonly handleFilterSelected: (string) => void;
}

/**
 * Top Level Facet Selection Panel. This component handles getting the available Facets using the supplied selector (useFacetSelector)
 * The Facets are either Case or File and are set by the facetType parameter. If a user picks a facet it will call handleFilterSelected
 * passing the full name of the selected Facet
 * @param title
 * @param facetType
 * @param usedFacetsSelector
 * @param handleFilterSelected
 * @constructor
 */
const FacetSelection = ({
  title,
  facetType,
  usedFacetsSelector,
  handleFilterSelected,
}: FacetSelectionModalProps) => {
  // get the current list of cohort filters
  const assignedFacets = useCoreSelector((state) => usedFacetsSelector(state));
  const { data, isSuccess } = useFacetDictionary();
  const [availableFacets, setAvailableFacets] = useState(undefined); // Facets that are current not used
  const [currentFacets, setCurrentFacets] = useState(undefined); // current set of Facets
  const [useUsefulFacets, setUseUsefulFacets] = useState(false); // list of Facet which have values
  const prevAssignedFacets = usePrevious(assignedFacets);
  // const usefulFacetsStatus = useCoreSelector((state) =>
  //   selectUsefulCaseFacets(state).status,
  // );
  // const usefulFacets = useCoreSelector((state) =>
  //   selectUsefulFacets(state, facetType).data,
  // );

  const { data: usefulFacets, status: usefulFacetsStatus } = useCoreSelector(
    (state) => selectUsefulFacets(state, facetType),
  );
  const prevData = usePrevious(data);
  const coreDispatch = useCoreDispatch();

  // select facets with values if not already requested
  useEffect(() => {
    if (useUsefulFacets && usefulFacetsStatus == "uninitialized" && isSuccess) {
      coreDispatch(fetchFacetsWithValues("cases"));
    }
  }, [coreDispatch, isSuccess, useUsefulFacets, usefulFacetsStatus]);

  // if data changes or the current facetSet changes rebuild the
  // available facet list
  useEffect(() => {
    if (
      !isEqual(prevData, data) ||
      !isEqual(prevAssignedFacets, assignedFacets)
    ) {
      // build the list of filters that are not currently used
      const unusedFacets = Object.values(data)
        .filter((x: FacetDefinition) => {
          return x.full.startsWith("cases");
        })
        .filter((x: FacetDefinition) => {
          return !assignedFacets.includes(x.full);
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
    assignedFacets,
    isSuccess,
    data,
    prevAssignedFacets,
    prevData,
    useUsefulFacets,
    usefulFacetsStatus,
    usefulFacets,
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
      title={title}
      filters={currentFacets}
      handleFilterSelected={handleFilterSelected}
      handleFilteredWithValuesChanged={setUseUsefulFacets}
    />
  );
};

export default FacetSelection;
