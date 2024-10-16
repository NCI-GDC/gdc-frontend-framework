import React, { useEffect, useState, useRef } from "react";
import { fieldNameToTitle } from "@gff/core";
import { DEFAULT_VISIBLE_ITEMS, updateFacetEnum } from "./utils";
import { MdClose as CloseIcon } from "react-icons/md";
import { EnumFacetHooks, FacetCardProps } from "@/features/facets/types";
import { EnumFacetChart } from "../charts/EnumFacetChart";
import { ActionIcon, Checkbox, LoadingOverlay, TextInput } from "@mantine/core";
import { controlsIconStyle, FacetText, FacetHeader } from "./components";
import FacetExpander from "@/features/facets/FacetExpander";
import FacetSortPanel from "@/features/facets/FacetSortPanel";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import { SortType } from "./types";
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";
import FacetControlsHeader from "./FacetControlsHeader";
import { BAD_DATA_MESSAGE } from "./constants";

/**
 *  Enumeration facet filters handle display and selection of
 *  enumerated fields.
 * @param field - filter this FacetCard manages
 * @param hooks - object defining the hooks required by this facet component
 * @param valueLabel - label for the values column (e.g. "Cases" "Projects")
 * @param description - describes information about the facet
 * @param facetName - name of the Facet in human-readable form
 * @param showSearch - if the search icon show be displayed
 * @param showFlip - if the flip icon should be displayed
 * @param startShowingData - set = false to show the chart by default
 * @param showPercent - show the percentage
 * @param hideIfEmpty - if facet has no data, do not render
 * @param dismissCallback - if facet can be removed, supply a function which will ensure the "dismiss" control will be visible
 * @param width - set the width of the facet
 * @param header - object containing the components to use for the header
 * @category Facets
 */
const EnumFacet: React.FC<FacetCardProps<EnumFacetHooks>> = ({
  field,
  hooks,
  valueLabel,
  description,
  facetName = null,
  showSearch = true,
  showFlip = true,
  startShowingData = true,
  showPercent = true,
  hideIfEmpty = true,
  dismissCallback = undefined,
  width = undefined,
  header = {
    Panel: FacetHeader,
    Label: FacetText,
    iconStyle: controlsIconStyle,
  },
}: FacetCardProps<EnumFacetHooks>) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<SortType>({
    type: "alpha",
    direction: "asc",
  });
  const [sortedData, setSortedData] = useState(undefined);
  const [isFacetView, setIsFacetView] = useState(startShowingData);
  const cardRef = useRef<HTMLDivElement>(null);
  const { data, enumFilters, isSuccess, error, isUninitialized, isFetching } =
    hooks.useGetEnumFacetData(field);
  const [dataProcessed, setDataProcessed] = useState(false);

  const [selectedEnums, setSelectedEnums] = useState(enumFilters);
  const searchInputRef = useRef(null);

  const totalCount = hooks.useTotalCounts(field);
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();
  const isFilterExpanded =
    hooks?.useFilterExpanded && hooks.useFilterExpanded(field);
  const showFilters = isFilterExpanded === undefined || isFilterExpanded;

  useEffect(() => {
    if (isSearching) {
      searchInputRef?.current?.focus();
    }
  }, [isSearching]);

  useDeepCompareEffect(() => {
    setSelectedEnums(enumFilters);
  }, [enumFilters]);

  const maxValuesToDisplay = DEFAULT_VISIBLE_ITEMS;

  // update filters when checkbox is selected
  const handleChange = (value: string, checked: boolean) => {
    setFacetChartData({
      ...facetChartData,
      isSuccess: false,
    });
    if (checked) {
      const updated = selectedEnums ? [...selectedEnums, value] : [value];
      updateFacetEnum(field, updated, updateFacetFilters, clearFilters);
    } else {
      const updated = selectedEnums.filter((x) => x != value);
      updateFacetEnum(field, updated, updateFacetFilters, clearFilters);
    }
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    setSearchTerm("");
  };

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  const [facetChartData, setFacetChartData] = useState<{
    filteredData: [string, number][];
    filteredDataObj: Record<string, number>;
    remainingValues: number;
    numberOfBarsToDisplay: number;
    isSuccess: boolean;
    height: number;
    cardStyle: string;
  }>({
    filteredData: [],
    filteredDataObj: {},
    remainingValues: 0,
    numberOfBarsToDisplay: maxValuesToDisplay,
    isSuccess: false,
    height: 150,
    cardStyle: "overflow-hidden h-auto",
  });

  const calcCardStyle = useDeepCompareCallback(
    (remainingValues: number) => {
      if (isGroupExpanded) {
        const cardHeight =
          remainingValues > 16
            ? 96
            : remainingValues > 0
            ? Math.min(96, remainingValues * 5 + 40)
            : 24;
        /* h-96 is max height for the content of ExactValueFacet, EnumFacet, UploadFacet */
        return `flex-none h-${cardHeight} overflow-y-scroll `;
      } else {
        return "overflow-hidden h-auto";
      }
    },
    [isGroupExpanded],
  );

  const calcNumberOfBarsToDisplay = useDeepCompareCallback(
    (visibleItems: number) => {
      const totalNumberOfBars = enumFilters ? enumFilters.length : visibleItems;
      return isGroupExpanded
        ? Math.min(16, totalNumberOfBars)
        : Math.min(maxValuesToDisplay, totalNumberOfBars);
    },
    [isGroupExpanded, enumFilters, maxValuesToDisplay],
  );

  useDeepCompareEffect(() => {
    if (isSuccess && data) {
      // get all the data except the missing and empty values
      const tempFilteredData = Object.entries(data).filter(
        (entry) => entry[0] != "_missing" && entry[0] != "",
      );

      // it is possible that the selected enums are not in the data as their counts are 0
      // therefore we need to add them to the data
      const selectedEnumNotInData = selectedEnums
        ? selectedEnums.reduce((acc, curr) => {
            if (!tempFilteredData.find((x) => x[0] === curr)) {
              acc.push([curr, 0]); // count will be 0
            }
            return acc;
          }, [] as Array<[string, number]>)
        : [];

      const filteredData = [
        ...tempFilteredData,
        ...selectedEnumNotInData,
      ].filter((entry) =>
        searchTerm === ""
          ? entry
          : entry[0].toLowerCase().includes(searchTerm.toLowerCase().trim()),
      );

      const remainingValues = filteredData.length - maxValuesToDisplay;
      const cardStyle = calcCardStyle(remainingValues);
      const numberOfBarsToDisplay = calcNumberOfBarsToDisplay(
        tempFilteredData.length + selectedEnumNotInData.length,
      );

      setFacetChartData((prevFacetChartData) => ({
        ...prevFacetChartData,
        filteredData,
        filteredDataObj: Object.fromEntries(filteredData),
        remainingValues,
        numberOfBarsToDisplay,
        isSuccess: true,
        height:
          numberOfBarsToDisplay == 1
            ? 150
            : numberOfBarsToDisplay == 2
            ? 220
            : numberOfBarsToDisplay == 3
            ? 240
            : numberOfBarsToDisplay * 65 + 10,
        cardStyle: cardStyle,
      }));
    } else {
      setFacetChartData((prevFacetChartData) => ({
        ...prevFacetChartData,
        filteredDataObj: {},
        isSuccess: false,
      }));
    }
  }, [
    data,
    isSuccess,
    maxValuesToDisplay,
    searchTerm,
    calcCardStyle,
    calcNumberOfBarsToDisplay,
    selectedEnums,
  ]);

  useDeepCompareEffect(() => {
    if (facetChartData.filteredData && facetChartData.filteredData.length > 0) {
      setSortedData(
        Object.fromEntries(
          [...facetChartData.filteredData]
            .sort(
              sortType.type === "value"
                ? ([, a], [, b]) =>
                    sortType.direction === "dsc" ? b - a : a - b
                : ([a], [b]) =>
                    sortType.direction === "dsc"
                      ? b.localeCompare(a)
                      : a.localeCompare(b),
            )
            .slice(0, !isGroupExpanded ? maxValuesToDisplay : undefined),
        ),
      );
      setDataProcessed(true);
    } else {
      setDataProcessed(true);
    }
  }, [
    facetChartData.filteredData,
    sortType,
    isGroupExpanded,
    maxValuesToDisplay,
  ]);

  if (facetChartData.filteredData.length == 0 && hideIfEmpty) {
    return null; // nothing to render if visibleItems == 0
  }

  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-0"
      } bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition`}
      id={field}
    >
      <div>
        <FacetControlsHeader
          field={field}
          description={description}
          hooks={hooks}
          facetName={facetName}
          showSearch={showSearch}
          showFlip={showFlip}
          isFacetView={isFacetView}
          toggleFlip={toggleFlip}
          toggleSearch={toggleSearch}
          dismissCallback={dismissCallback}
          header={header}
        />
      </div>
      <div
        className={showFilters ? "h-full" : "h-0 invisible"}
        aria-hidden={!showFilters}
      >
        {isSuccess && error ? (
          <div className="m-4 font-content pb-2">{BAD_DATA_MESSAGE}</div>
        ) : (
          <>
            {isSearching && (
              <TextInput
                data-testid="textbox-search-values"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={`${
                  facetName ? facetName : fieldNameToTitle(field)
                } values`}
                className={"p-2"}
                placeholder="Search"
                ref={searchInputRef}
                rightSection={
                  searchTerm.length > 0 && (
                    <ActionIcon
                      onClick={() => {
                        setSearchTerm("");
                        searchInputRef.current.focus();
                      }}
                      className="border-0"
                    >
                      <CloseIcon aria-label="clear search" />
                    </ActionIcon>
                  )
                }
                role="search"
              />
            )}
            <div
              className={
                isFacetView ? `flip-card ` : `flip-card flip-card-flipped`
              }
              ref={cardRef}
            >
              <div
                className={`card-face bg-base-max rounded-b-md flex flex-col justify-between ${
                  !isFacetView ? "invisible" : ""
                }`}
              >
                <div>
                  <FacetSortPanel
                    sortType={sortType}
                    valueLabel={valueLabel}
                    setSort={setSortType}
                    field={facetName ? facetName : fieldNameToTitle(field)}
                  />

                  <div
                    className={facetChartData.cardStyle}
                    role="group"
                    aria-label="Filter values"
                  >
                    <LoadingOverlay
                      data-testid="loading-spinner"
                      visible={isUninitialized || isFetching || !dataProcessed}
                    />
                    {isUninitialized || isFetching || !dataProcessed ? (
                      <div>
                        {
                          // uninitialized, loading, error animated bars
                          Array.from(Array(maxValuesToDisplay)).map(
                            (_, index) => {
                              return (
                                <div
                                  key={`${field}-${index}`}
                                  className="flex items-center px-2 w-full"
                                >
                                  <div className="flex-none">
                                    <Checkbox
                                      size="xs"
                                      className="bg-base-lightest text-primary-contrast-lightest hover:bg-base-darkest hover:text-base-contrast-darkest"
                                    />
                                  </div>
                                  <div className="flex-grow h-3.5 align-center justify-center mt-1 ml-1 mr-8 bg-base-light rounded-b-sm animate-pulse" />
                                  <div className="flex-none h-3.5 align-center justify-center mt-1 w-10 bg-base-light rounded-b-sm animate-pulse" />
                                </div>
                              );
                            },
                          )
                        }
                      </div>
                    ) : isSuccess ? (
                      facetChartData.filteredData.length == 0 ||
                      !sortedData ||
                      Object.entries(sortedData).length === 0 ? (
                        <div className="mx-4 font-content text-sm">
                          {BAD_DATA_MESSAGE}
                        </div>
                      ) : (
                        Object.entries(sortedData).map(([value, count]) => {
                          return (
                            <div
                              key={`${field}-${value}`}
                              className="flex flex-row items-center gap-x-1 px-2"
                            >
                              <div className="flex-none">
                                <Checkbox
                                  data-testid={`checkbox-${value}`}
                                  aria-label={`${value}`}
                                  value={value}
                                  size="xs"
                                  color="accent"
                                  onChange={(e) =>
                                    handleChange(
                                      e.currentTarget.value,
                                      e.currentTarget.checked,
                                    )
                                  }
                                  classNames={{
                                    input: "hover:bg-accent-darker",
                                  }}
                                  checked={
                                    !!(
                                      selectedEnums &&
                                      selectedEnums.includes(value)
                                    )
                                  }
                                />
                              </div>
                              <OverflowTooltippedLabel label={value}>
                                <span className="font-content">{value}</span>
                              </OverflowTooltippedLabel>
                              <div
                                data-testid={`text-${value}`}
                                className="flex-none text-right w-14 font-content text-sm"
                              >
                                {count.toLocaleString()}
                              </div>
                              {showPercent ? (
                                <div className="flex-none text-right w-18 font-content text-sm">
                                  (
                                  {(
                                    ((count as number) / totalCount) *
                                    100
                                  ).toFixed(2)}
                                  %)
                                </div>
                              ) : null}
                            </div>
                          );
                        })
                      )
                    ) : null}
                  </div>
                </div>
                {
                  <FacetExpander
                    remainingValues={facetChartData.remainingValues}
                    isGroupExpanded={isGroupExpanded}
                    onShowChanged={setIsGroupExpanded}
                  />
                }
              </div>
              <div
                className={`card-face card-back rounded-b-md bg-base-max h-full pb-1 ${
                  isFacetView ? "invisible" : ""
                }`}
              >
                {facetChartData.filteredData.length === 0 ? (
                  <div className="mx-4">No results found</div>
                ) : (
                  !isFacetView && (
                    <EnumFacetChart
                      field={field}
                      data={facetChartData.filteredDataObj}
                      selectedEnums={selectedEnums}
                      isSuccess={facetChartData.isSuccess}
                      showTitle={false}
                      valueLabel={valueLabel}
                      maxBins={facetChartData.numberOfBarsToDisplay}
                      height={facetChartData.height}
                    />
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnumFacet;
