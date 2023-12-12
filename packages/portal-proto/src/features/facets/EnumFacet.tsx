import React, { useEffect, useState, useRef } from "react";
import { fieldNameToTitle } from "@gff/core";
import { DEFAULT_VISIBLE_ITEMS, updateFacetEnum } from "./utils";
import {
  MdFlip as FlipIcon,
  MdSearch as SearchIcon,
  MdClose as CloseIcon,
} from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import { EnumFacetHooks, FacetCardProps } from "@/features/facets/types";
import { EnumFacetChart } from "../charts/EnumFacetChart";
import {
  ActionIcon,
  Checkbox,
  LoadingOverlay,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  FacetIconButton,
  controlsIconStyle,
  FacetText,
  FacetHeader,
} from "./components";
import FacetExpander from "@/features/facets/FacetExpander";
import FacetSortPanel from "@/features/facets/FacetSortPanel";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import { SortType } from "./types";
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";

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
  const { data, enumFilters, isSuccess } = hooks.useGetFacetData(field);

  const [selectedEnums, setSelectedEnums] = useState(enumFilters);
  const searchInputRef = useRef(null);

  const totalCount = hooks.useTotalCounts();
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();

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
        return `flex-none  h-${cardHeight} overflow-y-scroll `;
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
      const tempFlteredData = Object.entries(data)
        .filter((entry) => entry[0] != "_missing" && entry[0] != "")
        .filter((entry) =>
          searchTerm === ""
            ? entry
            : entry[0].toLowerCase().includes(searchTerm.toLowerCase().trim()),
        );
      const remainingValues = tempFlteredData.length - maxValuesToDisplay;
      const cardStyle = calcCardStyle(remainingValues);
      const numberOfBarsToDisplay = calcNumberOfBarsToDisplay(
        tempFlteredData.length,
      );

      setFacetChartData((prevFacetChartData) => ({
        ...prevFacetChartData,
        filteredData: tempFlteredData,
        filteredDataObj: Object.fromEntries(tempFlteredData),
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
        <header.Panel>
          <Tooltip
            label={description}
            position="bottom-start"
            multiline
            width={220}
            withArrow
            transitionProps={{ duration: 200, transition: "fade" }}
            disabled={!description}
          >
            <header.Label>
              {facetName ? facetName : fieldNameToTitle(field)}
            </header.Label>
          </Tooltip>
          <div className="flex flex-row">
            {showSearch ? (
              <Tooltip label="Search values">
                <FacetIconButton onClick={toggleSearch} aria-label="Search">
                  <SearchIcon size="1.45em" className={header.iconStyle} />
                </FacetIconButton>
              </Tooltip>
            ) : null}
            {showFlip ? (
              <Tooltip label={isFacetView ? "Chart view" : "Selection view"}>
                <FacetIconButton
                  onClick={toggleFlip}
                  aria-pressed={!isFacetView}
                  aria-label="chart view"
                >
                  <FlipIcon size="1.45em" className={header.iconStyle} />
                </FacetIconButton>
              </Tooltip>
            ) : null}
            <Tooltip label="Clear selection">
              <FacetIconButton
                onClick={() => clearFilters(field)}
                aria-label="clear selection"
              >
                <UndoIcon size="1.25em" className={header.iconStyle} />
              </FacetIconButton>
            </Tooltip>
            {dismissCallback ? (
              <Tooltip label="Remove the facet">
                <FacetIconButton
                  onClick={() => {
                    clearFilters(field);
                    dismissCallback(field);
                  }}
                  aria-label="remove the facet"
                >
                  <CloseIcon size="1.25em" className={header.iconStyle} />
                </FacetIconButton>
              </Tooltip>
            ) : null}
          </div>
        </header.Panel>
      </div>
      <div className="h-full">
        {isSearching && (
          <TextInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label={"search values"}
            className={"p-2"}
            placeholder="Search"
            ref={searchInputRef}
            rightSection={
              searchTerm.length > 0 ? (
                <ActionIcon
                  onClick={() => {
                    setSearchTerm("");
                    searchInputRef.current.focus();
                  }}
                  aria-label={"clear search"}
                >
                  <CloseIcon />
                </ActionIcon>
              ) : undefined
            }
          />
        )}
        <div
          className={isFacetView ? `flip-card ` : `flip-card flip-card-flipped`}
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

              <div className={facetChartData.cardStyle}>
                <LoadingOverlay
                  data-testid="loading-spinner"
                  visible={!isSuccess}
                />
                {facetChartData.filteredData.length == 0 ? (
                  <div className="mx-4 font-content">
                    No data for this field
                  </div>
                ) : isSuccess ? (
                  !sortedData || Object.entries(sortedData).length === 0 ? (
                    <div className="mx-4">No results found</div>
                  ) : (
                    Object.entries(sortedData).map(([value, count]) => {
                      return (
                        <div
                          key={`${field}-${value}`}
                          className="flex flex-row items-center gap-x-1 px-2 "
                        >
                          <div className="flex-none">
                            <Checkbox
                              data-testid={`checkbox-${value}`}
                              value={value}
                              size="xs"
                              color="accent"
                              onChange={(e) =>
                                handleChange(
                                  e.currentTarget.value,
                                  e.currentTarget.checked,
                                )
                              }
                              aria-label={`checkbox for ${field}`}
                              classNames={{
                                input: "hover:bg-accent-darker",
                              }}
                              checked={
                                !!(
                                  selectedEnums && selectedEnums.includes(value)
                                )
                              }
                            />
                          </div>
                          <OverflowTooltippedLabel label={value}>
                            <span className="font-content">{value}</span>
                          </OverflowTooltippedLabel>
                          <div
                            data-testid={`text-${value}`}
                            className="flex-none text-right w-14 font-content"
                          >
                            {count.toLocaleString()}
                          </div>
                          {showPercent ? (
                            <div className="flex-none text-right w-18 font-content">
                              (
                              {(((count as number) / totalCount) * 100).toFixed(
                                2,
                              )}
                              %)
                            </div>
                          ) : null}
                        </div>
                      );
                    })
                  )
                ) : (
                  <div>
                    {
                      // uninitialized, loading, error animated bars
                      Array.from(Array(maxValuesToDisplay)).map((_, index) => {
                        return (
                          <div
                            key={`${field}-${index}`}
                            className="flex flex-row items-center px-2"
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
                      })
                    }
                  </div>
                )}
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
      </div>
    </div>
  );
};

export default EnumFacet;
