import React, { useEffect, useState } from "react";
import {
  useCoreDispatch,
} from "@gff/core";

import {
  FacetEnumHooks,
  UpdateEnums,
} from "./hooks";

import {
  MdAddCircle as MoreIcon,
  MdFlip as FlipIcon,
  MdRemoveCircle as LessIcon,
  MdSearch as SearchIcon,
  MdSort as SortIcon,
  MdSortByAlpha as AlphaSortIcon,
} from "react-icons/md";
import { convertFieldToName } from "./utils";
import { EnumFacetChart } from "../charts/EnumFacetChart";
import { LoadingOverlay, Tooltip } from "@mantine/core";

export interface EnumFacetProps {

  readonly field: string;
  readonly type: string;
  readonly description?: string;
  readonly facetName?: string;
  readonly showSearch?: boolean;
  readonly showFlip?:boolean;
  readonly showPercent?: boolean;
  readonly startShowingData?: boolean;
  readonly valueLabel?: string;
  readonly hideIfEmpty?: boolean;
}

/**
 *  Enumeration facet filters handle display and selection of
 *  enumerated fields.
 * @param field
 * @param type
 * @param description
 * @param facetName
 * @param showSearch
 * @param showFlip
 * @param startShowingData
 * @param showPercent
 * @param valueLabel
 * @param hideIfEmpty
 * @constructor
 */
export const EnumFacet: React.FC<EnumFacetProps> = ({
                                              field,
                                              type,
                                              description,
                                              facetName = null,
                                              showSearch = true,
                                              showFlip=true,
                                              startShowingData = true,
                                              showPercent = true,
                                              valueLabel = "Cases",
                                              hideIfEmpty = true
                                            }: EnumFacetProps) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSortedByValue, setIsSortedByValue] = useState(false);
  const [isFacetView, setIsFacetView] = useState(startShowingData);
  const [visibleItems, setVisibleItems] = useState(6);

  const { data, enumFilters, isSuccess } = FacetEnumHooks[type](field);
  const [selectedEnums, setSelectedEnums] = useState(enumFilters);
  const coreDispatch = useCoreDispatch();

  const updateFilters = UpdateEnums[type];

  useEffect(() => {
    setSelectedEnums(enumFilters);
  } ,[enumFilters]);

  useEffect(() => {
    if (isSuccess) {
      setVisibleItems(Object.entries(data).filter(data => (data[0] != "_missing" && data[0] != "")).length)
    }
  } ,[data, isSuccess]);

  useEffect(() => {
    updateFilters(coreDispatch, selectedEnums, field, `${type}.`);
  }, [ updateFilters, coreDispatch, selectedEnums, field, type] );

  const maxValuesToDisplay = 6;
  const total = visibleItems;
  if (total == 0 && hideIfEmpty) {
    return null; // nothing to render if total == 0
  }

  const handleChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
        const updated = selectedEnums ? [...selectedEnums, value] : [value];
        setSelectedEnums(updated);
    } else {
      const updated = field === "is_cancer_gene_census" ? [] : selectedEnums.filter((x) => x != value);
      setSelectedEnums(updated);
    }
  };

  const toggleSearch = () => {
    setIsSearching(!isSearching);
  };

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  const remainingValues = (total - maxValuesToDisplay);
  const cardHeight = remainingValues > 16 ? 96 : remainingValues > 0 ? Math.min(96, remainingValues * 5 + 40) : 24;
  const cardStyle = isGroupExpanded ? `flex-none  h-${cardHeight} overflow-y-scroll ` : `overflow-hidden pr-3.5`;
  const numberOfLines = (total - maxValuesToDisplay) < 0 ? total : isGroupExpanded ? 16 : maxValuesToDisplay;
  return (
      <div className="flex flex-col w-64 bg-white relative shadow-lg border-nci-gray-lightest border-1 rounded-b-md text-xs transition ">
        <div>
          <div className="flex items-center justify-between flex-wrap bg-nci-gray-lighter shadow-md px-1.5">
            <Tooltip label={description}
                     classNames={{
                       arrow: "bg-nci-gray-light",
                       body: "bg-white text-nci-gray-darkest"
                     }}
                     position="bottom"
                     placement="start"
                     wrapLines
                     width={220}
                     withArrow
                     transition="fade"
                     transitionDuration={200}>
            <div className="has-tooltip text-nci-gray-darkest font-heading font-semibold text-md">{(facetName === null) ? convertFieldToName(field) : facetName}
             </div>
            </Tooltip>
            <div className="flex flex-row">
              {showSearch ? <button
                className="hover:bg-nci-grey-darker text-nci-gray font-bold py-2 px-1 rounded inline-flex items-center"
                onClick={toggleSearch}
                aria-label="Search"
              >
                <SearchIcon size="1.25em" />
              </button> : null
              }
              {showFlip ? <button
                className="hover:bg-nci-grey-darker text-nci-gray font-bold py-2 px-1 rounded inline-flex items-center"
                onClick={toggleFlip}
                aria-label="Flip between form and chart"
              >
                <FlipIcon size="1.25em" />
              </button> : null
              }
            </div>
          </div>
        </div>
        <div>
          <div className={isFacetView ? "flip-card" : "flip-card flip-card-flipped"}>
            <div className="card-face bg-white">
              <div>
                <div
                  className="flex flex-row items-center justify-between flex-wrap border p-1">
                  <button
                    className={"ml-0.5 border rounded-sm border-nci-gray-darkest bg-nci-gray hover:bg-nci-gray-lightest text-white hover:text-nci-gray-darker"}
                    aria-label="Sort alphabetically"
                  >
                    <AlphaSortIcon onClick={() => setIsSortedByValue(false)} scale="1.5em"  />
                  </button>
                  <div className={"flex flex-row items-center "}>
                    <button onClick={() => setIsSortedByValue(true)}
                            className={"border rounded-sm border-nci-gray-darkest bg-nci-gray hover:bg-nci-gray-lightest text-white hover:text-nci-gray-darker transition-colors"}
                            aria-label="Sort numerically"
                    >
                      <SortIcon scale="1.5em" /></button>
                    <p className="px-2 mr-3">{valueLabel}</p>
                  </div>
                </div>

                <div className={cardStyle}>
                  <LoadingOverlay visible={!isSuccess} />
                  {
                    (total == 0) ? <div className="mx-4">No data for this field</div> :
                    isSuccess ?
                      Object.entries(data).filter(data => (data[0] != "_missing" && data[0] != "")).sort(isSortedByValue ? ([, a], [, b]) => (b as number) - (a as number) : ([a], [b]) => a.localeCompare(b),
                      ).map(([value, count], i) => {
                        if (!isGroupExpanded && i >= maxValuesToDisplay) return null;
                        if (field === "is_cancer_gene_census") {
                          value = value === "1" ? "true" : "false";
                        }
                        return (
                          <div key={`${field}-${value}`} className="flex flex-row gap-x-1 px-2 ">
                            <div className="flex-none">
                              { (field === "is_cancer_gene_census") ?  // TODO: Remove after Feb 2022 MR review
                                <input type="checkbox"
                                       value={value}
                                       onChange={handleChange}
                                       aria-label={`checkbox for ${field}`}
                                        className="bg-nci-gray-lightest hover:bg-nci-gray-darkest text-nci-gray-darkest"
                                        checked={!!(selectedEnums && selectedEnums.includes(value))} />
                                        :
                                        <input type="checkbox"
                                               value={value}
                                               onChange={handleChange}
                                               aria-label={`checkbox for ${field}`}
                                               className="bg-nci-gray-lightest hover:bg-nci-gray-darkest text-nci-gray-darkest"
                                               checked={!!(selectedEnums && selectedEnums.includes(value))} />
                              }
                            </div>
                            <div className="flex-grow truncate ... font-heading text-md pt-0.5">{value}</div>
                            <div className="flex-none text-right w-14 ">{count.toLocaleString()}</div>
                            {showPercent ? <div
                              className="flex-none text-right w-18 ">({((count as number / 85415) * 100).toFixed(2).toLocaleString()}%)
                            </div> : null
                            }

                          </div>
                        );
                      }) :
                      <div>
                        { // uninitialized, loading, error animated bars
                          Array.from(Array(numberOfLines)).map((_, index) => {
                            return (
                              <div key={`${field}-${index}`} className="flex flex-row items-center px-2">
                                <div className="flex-none">
                                  <input type="checkbox" className="bg-nci-gray-lightest hover:bg-nci-gray-darkest text-nci-gray-darkest"/>
                                </div>
                                <div className="flex-grow h-3.5 align-center justify-center mt-1 ml-1 mr-8 bg-nci-gray-light rounded-b-sm animate-pulse"/>
                                <div className="flex-none h-3.5 align-center justify-center mt-1 w-10 bg-nci-gray-light rounded-b-sm animate-pulse"/>
                              </div>);
                          })
                        }
                      </div>
                  }
                </div>
              </div>
              {
                <div className="mt-3 m-1">
                  {remainingValues > 0 ? !isGroupExpanded ?
                      <div className="flex flex-row justify-end items-center border-t-2 p-1.5">
                        <MoreIcon key="show-more" size="1.5em" className="text-nci-gray-darkest"
                                  onClick={() => setIsGroupExpanded(!isGroupExpanded)} />
                        <div className="pl-1 text-nci-gray-darkest"> {isSuccess ? remainingValues : "..."} more</div>
                      </div>
                      :
                      <div
                        className="flex flex-row justify-end items-center border-t-2 border-b-0 border-r-0 border-l-0 p-1.5">
                        <LessIcon key="show-less" size="1.5em" className="text-nci-gray-darkest"
                                  onClick={() => setIsGroupExpanded(!isGroupExpanded)} />
                        <div className="pl-1 text-nci-gray-darkest"> show less</div>
                      </div>
                    : null
                  }
                </div>
              }
            </div>

            <div className="card-face card-back bg-white">

              <EnumFacetChart
                field={field}
                data={data}
                isSuccess={isSuccess}
                type={type}
                marginBottom={40}
                marginTop={5} padding={1}
                showXLabels={true}
                showTitle={false}
                height={undefined}
                orientation="h"
                valueLabel={valueLabel}
                maxBins={Math.min(isGroupExpanded ? 16 : Math.min(6, total))}
              />

            </div>

          </div>
        </div>
      </div>

  );
};



