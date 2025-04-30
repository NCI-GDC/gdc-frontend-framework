import React, { useEffect, useState, useRef } from "react";
import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from "use-deep-compare";
import { ActionIcon, Checkbox, LoadingOverlay, TextInput } from "@mantine/core";
import OverflowTooltippedLabel from "@/common/OverflowTooltippedLabel";
import { CloseIcon } from "src/commonIcons";
import FacetSortPanel from "./FacetSortPanel";
import FacetControlsHeader from "./FacetControlsHeader";
import { SortType, EnumFacetCardProps } from "../types";
import { BAD_DATA_MESSAGE, DEFAULT_VISIBLE_ITEMS } from "../constants";
import FacetExpander from "./FacetExpander";
import { Includes } from "@/cohort/QueryExpression/types";

/**
 * Facet card component for enumerated fields
 * @param field - filter this FacetCard manages
 * @param hooks - object defining the hooks required by this facet component
 * @param description - describes information about the facet
 * @param facetName - name of the Facet in human-readable form
 * @param valueLabel - label for the values column (e.g. "Cases" "Projects")
 * @param startShowingData - set = false to show the chart by default
 * @param showPercent - show the percentage
 * @param hideIfEmpty - if facet has no data, do not render
 * @param dismissCallback - if facet can be removed, supply a function which will ensure the "dismiss" control will be visible
 * @param variant - display variant
 * @param queryOptions - info to pass back to data fetching hooks about this facet
 * @param Chart - Component for rendering a Chart view of the data
 */
const EnumFacet: React.FC<EnumFacetCardProps> = ({
  field,
  hooks,
  description,
  facetName,
  valueLabel = undefined,
  startShowingData = true,
  showPercent = true,
  hideIfEmpty = true,
  dismissCallback = undefined,
  variant = "default",
  Chart = undefined,
  queryOptions = undefined,
  cardScrollMargin = 0,
}) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState<SortType>({
    type: "alpha",
    direction: "asc",
  });
  const [sortedData, setSortedData] = useState<Record<string, number>>({});
  const [isFacetView, setIsFacetView] = useState(startShowingData);
  const { data, isSuccess, error, isUninitialized, isFetching } =
    hooks.useGetEnumFacetData(field, queryOptions);
  const filters = hooks.useGetFacetFilters(field);
  const enumFilters = useDeepCompareMemo(
    () => ((filters as Includes)?.operands || []).map((x) => x.toString()),
    [filters],
  );
  const [dataProcessed, setDataProcessed] = useState(false);
  const [selectedEnums, setSelectedEnums] = useState(enumFilters);

  const cardRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const hash = window?.location?.hash.split("#")?.[1];
  const searchParams = new URLSearchParams(window.location.search);

  const searchTermParam = searchParams.get("searchTerm") as string;
  const cardSelected = hash !== undefined && hash === field;

  useEffect(() => {
    if (cardSelected && searchTermParam !== null) {
      setIsSearching(true);
      setSearchTerm(searchTermParam);
    }
  }, [cardSelected, searchTermParam]);

  const totalCount = hooks.useTotalCounts(queryOptions);
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

    const updated = checked
      ? selectedEnums
        ? [...selectedEnums, value]
        : [value]
      : selectedEnums.filter((x) => x != value);

    if (updated.length > 0) {
      updateFacetFilters(field, {
        operator: "includes",
        field,
        operands: updated,
      });
    }
    // no values remove the filter
    else {
      clearFilters(field);
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
      const totalNumberOfBars =
        enumFilters && enumFilters.length > 0
          ? enumFilters.length
          : visibleItems;
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

      const enumData = [...tempFilteredData, ...selectedEnumNotInData];

      const filteredData = searchTerm
        ? hooks.useSearchEnumTerms(enumData, searchTerm)
        : enumData;
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
    hooks,
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
      className={`flex flex-col mx-0 bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition ${
        cardSelected ? "animate-border-highlight " : undefined
      }`}
      style={{
        scrollMarginTop: cardScrollMargin + 10,
      }}
      id={field}
    >
      <div>
        <FacetControlsHeader
          field={field}
          description={description}
          hooks={hooks}
          facetName={facetName}
          showFlip={Chart !== undefined}
          isFacetView={isFacetView}
          toggleFlip={toggleFlip}
          toggleSearch={toggleSearch}
          dismissCallback={dismissCallback}
          variant={variant}
          showSearch={hooks.useSearchEnumTerms !== undefined}
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
                aria-label={`${facetName} values`}
                className={"p-2"}
                placeholder="Search"
                ref={searchInputRef}
                rightSection={
                  searchTerm.length > 0 && (
                    <ActionIcon
                      onClick={() => {
                        setSearchTerm("");
                        searchInputRef?.current?.focus();
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
                    field={facetName}
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
                              {count !== undefined && (
                                <>
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
                                </>
                              )}
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
                  !isFacetView &&
                  Chart !== undefined && (
                    <Chart
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
