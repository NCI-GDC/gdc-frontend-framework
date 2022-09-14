import React, { useEffect, useState, useRef } from "react";
import {
  useCoreDispatch,
  useCoreSelector,
  selectTotalCountsByName,
  usePrevious,
  removeCohortFilter,
  EnumOperandValue,
  fieldNameToTitle,
} from "@gff/core";
import {
  FacetDocTypeToCountsIndexMap,
  FacetDocTypeToLabelsMap,
  FacetEnumHooks,
  UpdateEnums,
} from "./hooks";
import { DEFAULT_VISIBLE_ITEMS } from "./utils";

import {
  MdFlip as FlipIcon,
  MdSearch as SearchIcon,
  MdClose as CloseIcon,
} from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import { EnumFacetCardProps } from "@/features/facets/types";
import { EnumFacetChart } from "../charts/EnumFacetChart";
import { Checkbox, LoadingOverlay, Tooltip } from "@mantine/core";
import { isEqual } from "lodash";
import { FacetIconButton, controlsIconStyle } from "./components";
import FacetExpander from "@/features/facets/FacetExpander";
import FacetSortPanel from "@/features/facets/FacetSortPanel";

/**
 *  Enumeration facet filters handle display and selection of
 *  enumerated fields.
 * @param field filter this FacetCard manages
 * @param docType document type "cases" "files, etc.
 * @param indexType index this facet uses to get data from
 * @param description describes information about the facet
 * @param facetName name of the Facet in human-readable form
 * @param showSearch if the search icon show be displayed
 * @param showFlip if the flip icon should be displayed
 * @param startShowingData set = false to show the chart by default
 * @param showPercent show the percentage
 * @param hideIfEmpty if facet has no data, do not render
 * @param dismissCallback if facet can be removed, supply a function which will ensure the "dismiss" control will be visible
 * @param width set the width of the facet
 * @param facetDataFunc function to pull enumerated data with
 * @param updateEnumsFunc function to extract enumeration values (used to set checkboxes)
 * @param clearFilterFunc function to call when filter should be reset (all checkboxes cleared)
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
  updateEnumsFunc = undefined,
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

  const updateFacetEnum = (
    enumerationFilters: EnumOperandValue,
    fieldname: string,
  ) => {
    updateEnumsFunc
      ? updateEnumsFunc(enumerationFilters, fieldname)
      : UpdateEnums[docType](enumerationFilters, fieldname, coreDispatch);
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
  const handleChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      const updated = selectedEnums ? [...selectedEnums, value] : [value];
      updateFacetEnum(updated, field);
    } else {
      // TODO: replace with ToggleFacet
      const updated =
        field === "genes.is_cancer_gene_census"
          ? []
          : selectedEnums.filter((x) => x != value);
      updateFacetEnum(updated, field);
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

  const totalNumberOfBars = enumFilters ? enumFilters.length : total;
  const numberOfBarsToDisplay = isGroupExpanded
    ? Math.min(16, totalNumberOfBars)
    : Math.min(maxValuesToDisplay, totalNumberOfBars);

  const sortedData = data
    ? Object.fromEntries(
        Object.entries(data)
          .filter((entry) => entry[0] != "_missing" && entry[0] != "")
          .sort(
            isSortedByValue
              ? ([, a], [, b]) => b - a
              : ([a], [b]) => a.localeCompare(b),
          )
          .slice(0, !isGroupExpanded ? maxValuesToDisplay : undefined)
          .map(([value, count]) => {
            if (field === "genes.is_cancer_gene_census") {
              value = value === "1" ? "true" : "false";
            }
            return [value, count];
          }),
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
        <div className="flex items-center justify-between flex-wrap bg-primary-lighter shadow-md px-1.5">
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
            <div className="text-primary-contrast-lighter font-heading font-semibold text-md">
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
              onClick={clearFilters}
              aria-label="clear selection"
            >
              <UndoIcon size="1.15em" className={controlsIconStyle} />
            </FacetIconButton>
            {dismissCallback ? (
              <FacetIconButton
                onClick={() => {
                  clearFilters();
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
                            onChange={handleChange}
                            aria-label={`checkbox for ${field}`}
                            classNames={{
                              input: "hover:bg-accent-darker",
                            }}
                            checked={
                              !!(selectedEnums && selectedEnums.includes(value))
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
            {!isFacetView && (
              <EnumFacetChart
                field={field}
                data={data}
                selectedEnums={selectedEnums}
                isSuccess={isSuccess}
                showTitle={false}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
