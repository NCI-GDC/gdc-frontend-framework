import React, { useEffect, useState, useRef } from "react";
import {
  useCoreDispatch,
  useCoreSelector,
  selectTotalCountsByName,
  usePrevious,
  removeCohortFilter,
} from "@gff/core";
import {
  FacetDocTypeToCountsIndexMap,
  FacetDocTypeToLabelsMap,
  FacetEnumHooks,
  UpdateEnums,
} from "./hooks";
import { DEFAULT_VISIBLE_ITEMS, convertFieldToName } from "./utils";

import {
  MdAddCircle as MoreIcon,
  MdFlip as FlipIcon,
  MdRemoveCircle as LessIcon,
  MdSearch as SearchIcon,
  MdSort as SortIcon,
  MdSortByAlpha as AlphaSortIcon,
  MdClose as CloseIcon,
} from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import { EnumFacetCardProps } from "@/features/facets/types";
import { EnumFacetChart } from "../charts/EnumFacetChart";
import { LoadingOverlay, Tooltip } from "@mantine/core";
import * as tailwindConfig from "tailwind.config";
import { isEqual } from "lodash";

/**
 *  Enumeration facet filters handle display and selection of
 *  enumerated fields.
 * @param field filter this FacetCard manages
 * @param docType documement type "cases" "files, etc.
 * @param indexType index this facet uses to get data from
 * @param description describes information about the facet
 * @param facetName name of the Facet in human readable form
 * @param showSearch if the search icon show be displayed
 * @param showFlip if the flip icon should be displayed
 * @param startShowingData set to false to show the chart by default
 * @param showPercent show the percentage
 * @param hideIfEmpty if facet has no data, do not render
 * @param dismissCallback if facet can be removed, supply a function and the dissmiss control will be visible
 * @param width set the width of the facet
 * @param facetDataFunc function to pull enumerated data with
 * @param updateEnumsFunc function to extract enumeration values (used to set checkboxes)
 * @param clearFilterFunc function to call when filter should be reset (all cehckboxes cleared)
 */
export const EnumFacet: React.FC<EnumFacetCardProps> = ({
  field,
  docType,
  indexType,
  description,
  facetName = null,
  showSearch = true,
  showFlip = true,
  startShowingData = true,
  showPercent = true,
  hideIfEmpty = true,
  dismissCallback = undefined,
  width = undefined,
  facetDataFunc = FacetEnumHooks[docType],
  updateEnumsFunc = UpdateEnums[docType],
  clearFilterFunc = undefined,
}: EnumFacetCardProps) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSortedByValue, setIsSortedByValue] = useState(false);
  const [isFacetView, setIsFacetView] = useState(startShowingData);
  const [visibleItems, setVisibleItems] = useState(DEFAULT_VISIBLE_ITEMS);
  const cardRef = useRef<HTMLDivElement>(null);
  const { data, enumFilters, isSuccess } = facetDataFunc(
    field,
    docType,
    indexType,
  );
  const [selectedEnums, setSelectedEnums] = useState(enumFilters);
  const prevFilters = usePrevious(enumFilters);
  const coreDispatch = useCoreDispatch();

  // get the total count to compute percentages
  // TODO: move this outside of Facet Component
  const totalCount = useCoreSelector((state) =>
    selectTotalCountsByName(state, FacetDocTypeToCountsIndexMap[docType]),
  );

  const clearFilters = () => {
    clearFilterFunc
      ? clearFilterFunc(field)
      : coreDispatch(removeCohortFilter(field));
  };

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
    if (isSuccess && !isEqual(prevFilters, enumFilters)) {
      setSelectedEnums(enumFilters);
    }
  }, [enumFilters, isSuccess, prevFilters]);

  const maxValuesToDisplay = DEFAULT_VISIBLE_ITEMS;
  const total = visibleItems;
  if (total == 0 && hideIfEmpty) {
    return null; // nothing to render if total == 0
  }

  // update filters when checkbox is selected
  const handleChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      const updated = selectedEnums ? [...selectedEnums, value] : [value];
      updateEnumsFunc(updated, field);
    } else {
      // TODO: replace with ToggleFacet
      const updated =
        field === "genes.is_cancer_gene_census"
          ? []
          : selectedEnums.filter((x) => x != value);
      updateEnumsFunc(updated, field);
    }
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
  };

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  const remainingValues = total - maxValuesToDisplay;
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

  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-1"
      } bg-white relative shadow-lg border-nci-gray-lightest border-1 rounded-b-md text-xs transition`}
    >
      <div>
        <div className="flex items-center justify-between flex-wrap bg-nci-blue-lightest shadow-md px-1.5">
          <Tooltip
            label={description}
            classNames={{
              arrow: "bg-nci-gray-light",
              body: "bg-white text-nci-gray-darkest",
            }}
            position="bottom"
            placement="start"
            wrapLines
            width={220}
            withArrow
            transition="fade"
            transitionDuration={200}
          >
            <div className="has-tooltip text-nci-gray-darkest font-heading font-semibold text-md">
              {facetName === null ? convertFieldToName(field) : facetName}
            </div>
          </Tooltip>
          <div className="flex flex-row">
            {showSearch ? (
              <button
                className="hover:bg-nci-grey-darker text-nci-gray font-bold py-2 px-1 rounded inline-flex items-center"
                onClick={toggleSearch}
                aria-label="Search"
              >
                <SearchIcon
                  size="1.45em"
                  color={tailwindConfig.theme.extend.colors["gdc-blue"].darker}
                />
              </button>
            ) : null}
            {showFlip ? (
              <button
                className="hover:bg-nci-grey-darker text-nci-gray font-bold py-2 px-1 rounded inline-flex items-center"
                onClick={toggleFlip}
                aria-label="Flip between form and chart"
              >
                <FlipIcon
                  size="1.25em"
                  color={tailwindConfig.theme.extend.colors["gdc-blue"].darker}
                />
              </button>
            ) : null}
            <button
              className="hover:bg-nci-grey-darker text-nci-gray font-bold py-2 px-1 rounded inline-flex items-center"
              onClick={clearFilters}
              aria-label="clear selection"
            >
              <UndoIcon
                size="1.15em"
                color={tailwindConfig.theme.extend.colors["gdc-blue"].darker}
              />
            </button>
            {dismissCallback ? (
              <button
                className="hover:bg-nci-grey-darker text-nci-gray font-bold py-2 px-1 rounded inline-flex items-center"
                onClick={() => {
                  clearFilters();
                  dismissCallback(field);
                }}
                aria-label="Remove the facet"
              >
                <CloseIcon
                  size="1.25em"
                  color={tailwindConfig.theme.extend.colors["gdc-blue"].darker}
                />
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="h-full">
        <div
          className={
            isFacetView
              ? `flip-card h-full `
              : `flip-card flip-card-flipped h-full`
          }
          ref={cardRef}
        >
          <div
            className={`card-face bg-white  ${!isFacetView ? "invisible" : ""}`}
          >
            <div>
              <div className="flex flex-row items-center justify-between flex-wrap p-1 mb-1 border-b-2">
                <button
                  className={
                    "ml-1 border rounded-sm border-nci-gray-darkest bg-nci-gray hover:bg-nci-gray-lightest text-white hover:text-nci-gray-darker"
                  }
                  aria-label="Sort alphabetically"
                >
                  <AlphaSortIcon
                    onClick={() => setIsSortedByValue(false)}
                    scale="1.5em"
                  />
                </button>
                <div className={"flex flex-row items-center "}>
                  <button
                    onClick={() => setIsSortedByValue(true)}
                    className={
                      "border rounded-sm border-nci-gray-darkest bg-nci-gray hover:bg-nci-gray-lightest text-white hover:text-nci-gray-darker transition-colors"
                    }
                    aria-label="Sort numerically"
                  >
                    <SortIcon scale="1.5em" />
                  </button>
                  <p className="px-2 mr-3">
                    {FacetDocTypeToLabelsMap[docType]}
                  </p>
                </div>
              </div>

              <div className={cardStyle}>
                <LoadingOverlay visible={!isSuccess} />
                {total == 0 ? (
                  <div className="mx-4">No data for this field</div>
                ) : isSuccess ? (
                  Object.entries(data)
                    .filter((entry) => entry[0] != "_missing" && entry[0] != "")
                    .sort(
                      isSortedByValue
                        ? ([, a], [, b]) => (b as number) - (a as number)
                        : ([a], [b]) => a.localeCompare(b),
                    )
                    .map(([value, count], i) => {
                      if (!isGroupExpanded && i >= maxValuesToDisplay)
                        return null;
                      if (field === "genes.is_cancer_gene_census") {
                        value = value === "1" ? "true" : "false";
                      }
                      return (
                        <div
                          key={`${field}-${value}`}
                          className="flex flex-row gap-x-1 px-2 "
                        >
                          <div className="flex-none">
                            <input
                              type="checkbox"
                              value={value}
                              onChange={handleChange}
                              aria-label={`checkbox for ${field}`}
                              className="hover:bg-nci-gray-darkest text-nci-gray-darkest checked:bg-nci-blue-darkest checked:border-bg-nci-blue-darkest focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain"
                              checked={
                                !!(
                                  selectedEnums && selectedEnums.includes(value)
                                )
                              }
                            />
                          </div>
                          <div className="flex-grow truncate ... font-heading text-md pt-0.5">
                            {value}
                          </div>
                          <div className="flex-none text-right w-14 ">
                            {count.toLocaleString()}
                          </div>
                          {showPercent ? (
                            <div className="flex-none text-right w-18 ">
                              (
                              {(((count as number) / totalCount) * 100)
                                .toFixed(2)
                                .toLocaleString()}
                              %)
                            </div>
                          ) : null}
                        </div>
                      );
                    })
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
                              <input
                                type="checkbox"
                                className="bg-nci-gray-lightest hover:bg-nci-gray-darkest text-nci-gray-darkest"
                              />
                            </div>
                            <div className="flex-grow h-3.5 align-center justify-center mt-1 ml-1 mr-8 bg-nci-gray-light rounded-b-sm animate-pulse" />
                            <div className="flex-none h-3.5 align-center justify-center mt-1 w-10 bg-nci-gray-light rounded-b-sm animate-pulse" />
                          </div>
                        );
                      })
                    }
                  </div>
                )}
              </div>
            </div>
            {
              <div className="mt-3 m-1">
                {remainingValues > 0 ? (
                  !isGroupExpanded ? (
                    <div className="flex flex-row justify-end items-center border-t-2 p-1.5">
                      <MoreIcon
                        key="show-more"
                        size="1.5em"
                        className="text-nci-gray-darkest "
                        onClick={() => setIsGroupExpanded(!isGroupExpanded)}
                        onKeyPress={(event) =>
                          event.key === "Enter"
                            ? setIsGroupExpanded(!isGroupExpanded)
                            : undefined
                        }
                        tabIndex={0}
                        aria-label="Toggle more options"
                      />
                      <div className="pl-1 text-nci-gray-darkest font-bold">
                        {" "}
                        {isSuccess ? remainingValues : "..."} more
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-row justify-end items-center border-t-2 border-b-0 border-r-0 border-l-0 p-1.5">
                      <LessIcon
                        key="show-less"
                        size="1.5em"
                        className="text-nci-gray-darkest"
                        onClick={() => setIsGroupExpanded(!isGroupExpanded)}
                        onKeyPress={(event) =>
                          event.key === "Enter"
                            ? setIsGroupExpanded(!isGroupExpanded)
                            : undefined
                        }
                        tabIndex={0}
                        aria-label="Toggle less options"
                      />
                      <div className="pl-1 text-nci-gray-darkest font-bold">
                        {" "}
                        show less
                      </div>
                    </div>
                  )
                ) : null}
              </div>
            }
          </div>
          <div
            className={`card-face card-back bg-white h-full pb-1 ${
              isFacetView ? "invisible" : ""
            }`}
          >
            <EnumFacetChart
              field={field}
              data={data}
              selectedEnums={selectedEnums}
              isSuccess={isSuccess}
              showTitle={false}
              maxBins={Math.min(isGroupExpanded ? 16 : Math.min(6, total))}
              height={
                cardRef.current === null ||
                cardRef.current.getBoundingClientRect().height < 200
                  ? 400
                  : cardRef.current.getBoundingClientRect().height + 500
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
