import React, { useEffect, useState, useRef } from "react";
import { usePrevious, fieldNameToTitle } from "@gff/core";
import { FacetDocTypeToCountsIndexMap, FacetDocTypeToLabelsMap } from "./hooks";
import { DEFAULT_VISIBLE_ITEMS } from "./utils";

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
import { isEqual } from "lodash";
import { FacetIconButton, controlsIconStyle } from "./components";
import { updateFacetEnum } from "./utils";
import FacetExpander from "@/features/facets/FacetExpander";
import FacetSortPanel from "@/features/facets/FacetSortPanel";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";

/**
 *  Enumeration facet filters handle display and selection of
 *  enumerated fields.
 * @param field filter this FacetCard manages
 * @param docType document type "cases" "files, etc.
 * @param indexType index this facet uses to get data from
 * @param hooks object defining the hooks required by this facet component
 * @param description describes information about the facet
 * @param facetName name of the Facet in human-readable form
 * @param showSearch if the search icon show be displayed
 * @param showFlip if the flip icon should be displayed
 * @param startShowingData set = false to show the chart by default
 * @param showPercent show the percentage
 * @param hideIfEmpty if facet has no data, do not render
 * @param dismissCallback if facet can be removed, supply a function which will ensure the "dismiss" control will be visible
 * @param width set the width of the facet
 */
const EnumFacet: React.FC<FacetCardProps<EnumFacetHooks>> = ({
  field,
  docType,
  indexType,
  hooks,
  description,
  facetName = null,
  showSearch = true,
  showFlip = true,
  startShowingData = true,
  showPercent = true,
  hideIfEmpty = true,
  dismissCallback = undefined,
  width = undefined,
}: FacetCardProps<EnumFacetHooks>) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSortedByValue, setIsSortedByValue] = useState(false);
  const [isFacetView, setIsFacetView] = useState(startShowingData);
  const [visibleItems, setVisibleItems] = useState(DEFAULT_VISIBLE_ITEMS);
  const cardRef = useRef<HTMLDivElement>(null);
  const { data, enumFilters, isSuccess } = hooks.useGetFacetData(
    field,
    docType,
    indexType,
  );
  const [selectedEnums, setSelectedEnums] = useState(enumFilters);
  const prevFilters = usePrevious(enumFilters);
  const searchInputRef = useRef(null);

  const totalCount = hooks.useTotalCounts(
    FacetDocTypeToCountsIndexMap[docType],
  );
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();

  useEffect(() => {
    if (isSearching) {
      searchInputRef?.current?.focus();
    }
  }, [isSearching]);

  // filter missing and "" strings and update checkboxes
  useEffect(() => {
    if (isSuccess) {
      setVisibleItems(
        Object.entries(data).filter(
          (entry) => entry[0] != "_missing" && entry[0] != "",
        ).length,
      );
    }
  }, [data, field, isSuccess]);

  useEffect(() => {
    if (!isEqual(prevFilters, enumFilters)) {
      setSelectedEnums(enumFilters);
    }
  }, [enumFilters, isSuccess, prevFilters]);

  const maxValuesToDisplay = DEFAULT_VISIBLE_ITEMS;
  const total = visibleItems;
  if (total == 0 && hideIfEmpty) {
    return null; // nothing to render if total == 0
  }

  // update filters when checkbox is selected
  const handleChange = (value: string, checked: boolean) => {
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

  const filteredData = data
    ? Object.entries(data)
        .filter((entry) => entry[0] != "_missing" && entry[0] != "")
        .filter((entry) =>
          searchTerm === ""
            ? entry
            : entry[0].toLowerCase().includes(searchTerm.toLowerCase()),
        )
    : [];

  const remainingValues = filteredData.length - maxValuesToDisplay;
  const cardHeight =
    remainingValues > 16
      ? 96
      : remainingValues > 0
      ? Math.min(96, remainingValues * 5 + 40)
      : 24;

  const cardStyle = isGroupExpanded
    ? `flex-none  h-${cardHeight} overflow-y-scroll `
    : `overflow-hidden pr-3.5 h-auto`;
  const numberOfLines =
    total - maxValuesToDisplay < 0
      ? total
      : isGroupExpanded
      ? 16
      : maxValuesToDisplay;

  const totalNumberOfBars = enumFilters ? enumFilters.length : total;
  const numberOfBarsToDisplay = isGroupExpanded
    ? Math.min(16, totalNumberOfBars)
    : Math.min(maxValuesToDisplay, totalNumberOfBars);

  const sortedData = filteredData
    ? Object.fromEntries(
        filteredData
          .sort(
            isSortedByValue
              ? ([, a], [, b]) => b - a
              : ([a], [b]) => a.localeCompare(b),
          )
          .slice(0, !isGroupExpanded ? maxValuesToDisplay : undefined),
      )
    : undefined;

  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-1"
      } bg-base-max relative border-primary-lightest border-1 rounded-b-md text-xs transition`}
      id={field}
    >
      <div>
        <div className="flex items-start justify-between flex-nowrap bg-primary-lighter shadow-md px-1.5">
          <Tooltip
            label={description}
            classNames={{
              arrow: "bg-base-light",
              tooltip: "bg-base-max text-base-contrast-max",
            }}
            position="bottom-start"
            multiline
            width={220}
            withArrow
            transition="fade"
            transitionDuration={200}
          >
            <div className="text-primary-contrast-lighter font-heading font-semibold text-md break-words py-2">
              {facetName ? facetName : fieldNameToTitle(field)}
            </div>
          </Tooltip>
          <div className="flex flex-row">
            {showSearch ? (
              <FacetIconButton onClick={toggleSearch} aria-label="Search">
                <SearchIcon size="1.45em" className={controlsIconStyle} />
              </FacetIconButton>
            ) : null}
            {showFlip ? (
              <FacetIconButton
                onClick={toggleFlip}
                aria-label="Flip between form and chart"
              >
                <FlipIcon size="1.25em" className={controlsIconStyle} />
              </FacetIconButton>
            ) : null}
            <FacetIconButton
              onClick={() => clearFilters(field)}
              aria-label="clear selection"
            >
              <UndoIcon size="1.15em" className={controlsIconStyle} />
            </FacetIconButton>
            {dismissCallback ? (
              <FacetIconButton
                onClick={() => {
                  clearFilters(field);
                  dismissCallback(field);
                }}
                aria-label="Remove the facet"
              >
                <CloseIcon size="1.25em" className={controlsIconStyle} />
              </FacetIconButton>
            ) : null}
          </div>
        </div>
      </div>
      <div className="h-full">
        {isSearching && (
          <TextInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label={"search values"}
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
          className={
            isFacetView
              ? `flip-card h-full `
              : `flip-card flip-card-flipped h-full`
          }
          ref={cardRef}
        >
          <div
            className={`card-face bg-base-max ${
              !isFacetView ? "invisible" : ""
            }`}
          >
            <div>
              <FacetSortPanel
                isSortedByValue={isSortedByValue}
                valueLabel={FacetDocTypeToLabelsMap[docType]}
                setIsSortedByValue={setIsSortedByValue}
              />

              <div className={cardStyle}>
                <LoadingOverlay visible={!isSuccess} />
                {total == 0 ? (
                  <div className="mx-4">No data for this field</div>
                ) : isSuccess ? (
                  Object.entries(sortedData).length === 0 ? (
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
                            {value}
                          </OverflowTooltippedLabel>
                          <div className="flex-none text-right w-14 ">
                            {count.toLocaleString()}
                          </div>
                          {showPercent ? (
                            <div className="flex-none text-right w-18 ">
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
                      Array.from(Array(numberOfLines)).map((_, index) => {
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
                remainingValues={remainingValues}
                isGroupExpanded={isGroupExpanded}
                onShowChanged={setIsGroupExpanded}
              />
            }
          </div>
          <div
            className={`card-face card-back bg-base-max h-full overflow-y-auto pb-1 ${
              isFacetView ? "invisible" : ""
            }`}
          >
            {filteredData.length === 0 ? (
              <div className="mx-4">No results found</div>
            ) : (
              !isFacetView && (
                <EnumFacetChart
                  field={field}
                  data={Object.fromEntries(filteredData)}
                  selectedEnums={selectedEnums}
                  isSuccess={isSuccess}
                  showTitle={false}
                  valueLabel={FacetDocTypeToLabelsMap[docType]}
                  maxBins={numberOfBarsToDisplay}
                  height={
                    numberOfBarsToDisplay == 1
                      ? 150
                      : numberOfBarsToDisplay == 2
                      ? 220
                      : numberOfBarsToDisplay == 3
                      ? 240
                      : numberOfBarsToDisplay * 65 + 10
                  }
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
